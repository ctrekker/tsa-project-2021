const { json } = require('express');
const express = require('express');
const getDb = require('../../db');
const router = express.Router();
const mysql = require('mysql');
const {requireAuth, issue, verify} = require('../../auth');

/*
_________________
GET
_________________
*/

router.get('/', requireAuth, async (req, res) => { 
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;
    const userLobbies = (req.query.userLobbies == 'true') || false;
    
    let category = -1;
    if (req.query.category) category = parseInt(req.query.category);

    let sql = `SELECT LOBBY.ID AS ID,
    LOBBY.NAME AS NAME,
    LOBBY_CATEGORY.NAME AS CATEGORY,
    LOBBY.CREATOR,
    LOBBY.CREATED_AT,
    LOBBY.DESCRIPTION,
    (SELECT COUNT(*) FROM LOBBY_MEMBER AS LM WHERE LM.LOBBY = LOBBY.ID AND LM.MEMBER = ${mysql.escape(req.user.id)}) AS IS_MEMBER
    FROM LOBBY
    LEFT JOIN LOBBY_CATEGORY
    ON LOBBY.CATEGORY=LOBBY_CATEGORY.ID `;
    
    let params = [];
    if(req.query.category || userLobbies || req.query.search){
        sql += "WHERE ";
    }

    if (req.query.category) { 
        sql += " LOBBY.CATEGORY = " + mysql.escape(category);
    }
    if(req.query.search){
        if(req.query.category) sql += " AND "
        sql += ` LOBBY.NAME LIKE CONCAT (${mysql.escape(req.query.search)}, '%') `
    }
    if(userLobbies){ 
        if(req.query.category || req.query.search) sql += " AND ";
        sql += " LOBBY.ID IN (SELECT L.LOBBY FROM LOBBY_MEMBER AS L LEFT JOIN USER AS U ON U.ID = L.MEMBER WHERE U.EMAIL = ?)";
        params.push(req.user.email);
    }
    sql += ` LIMIT ?, ?;`;
    params.push(offset);
    params.push(limit);

    const lobbies = await req.conn.queryAsync(sql, params);
    
    if(lobbies) return res.jsonDb(lobbies);
    return res.status(400).send();
})

router.get('/:lobbyId', requireAuth, async(req,res) => {    
    
    const sql = `SELECT LOBBY.ID, LOBBY.NAME, LOBBY.CATEGORY, LOBBY.CREATOR, LOBBY.CREATED_AT, LOBBY.DESCRIPTION, LOBBY.ICON, \
    JSON_ARRAYAGG(JSON_OBJECT('USER', USER.ID, 'USER_NAME', USER.NAME, 'EMAIL', USER.EMAIL,'USER_PICTURE', USER.PICTURE)) AS MEMBERS, \
    (SELECT COUNT(*) FROM LOBBY_MEMBER AS LM WHERE LM.LOBBY = LOBBY.ID AND LM.MEMBER = ${mysql.escape(req.user.id)}) AS IS_MEMBER
    FROM LOBBY \
    LEFT JOIN LOBBY_MEMBER ON LOBBY.ID = LOBBY_MEMBER.LOBBY \
    LEFT JOIN USER ON USER.ID = LOBBY_MEMBER.MEMBER \
    WHERE LOBBY.ID = ?;`;
    
    let lobby = await req.conn.queryAsync(sql, [req.params.lobbyId]);
    lobby = lobby[0]
    lobby.MEMBERS = JSON.parse(lobby.MEMBERS);
    
    if (lobby) return res.jsonDb(lobby);
    return res.status(404).send();
})


/*
_________________
POST
_________________
*/
router.post('/', requireAuth, async (req, res) => {
    if(!req.body.name || !req.body.category || !req.body.description) return res.status(412).send();
    const insert = await req.conn.queryAsync("INSERT INTO LOBBY (NAME, CATEGORY, DESCRIPTION, CREATOR) VALUES (?, ?, ?, (SELECT ID FROM USER WHERE EMAIL=?));", [req.body.name, req.body.category, req.body.description, req.user.email]);

    if(insert) return res.jsonDb((await req.conn.queryAsync("SELECT * FROM LOBBY WHERE ID=LAST_INSERT_ID();"))[0]);
    return res.status(400).send();
})
router.post('/:lobbyId/join', requireAuth, async (req, res) => {
    try{
        const insert = await req.conn.queryAsync("INSERT INTO LOBBY_MEMBER (MEMBER, LOBBY) VALUES ((SELECT ID FROM USER WHERE EMAIL=?), ?)", [req.user.email, req.params.lobbyId]);
        if (insert) return res.json({"message": "Successfully joined lobby."}).status(200)
    }
    catch(e){
        return res.json({"message": "You are already a member of that lobby!", "error": e}).status(400);
    }
})
router.post('/:lobbyId/leave', requireAuth, async (req, res) => {
    const remove = await req.conn.queryAsync("DELETE FROM LOBBY_MEMBER WHERE MEMBER=(SELECT ID FROM USER WHERE EMAIL=?) AND LOBBY=?;", [req.user.email, req.params.lobbyId]);
    if (remove.affectedRows > 0) return res.json({"message": "Successfully left lobby."}).status(200)
    return res.json({"message": "You were never in that lobby!"}).status(400);
})
module.exports = router;
