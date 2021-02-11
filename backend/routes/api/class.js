const express = require('express');
const router = express.Router({ mergeParams: true });

//handle errors
const serverErrorHandler = (err, res) => {
    console.log(err);
    res.status(400).json({ error: err.message });
}

const userErrorHandler = (msg, res) => {
    console.log('User Error: ', msg);
    res.status(400).json({ error: msg });
}

//return user's primary key based on GID
const getUserId = async (GID, conn, res) => {
    const userId = await conn.queryAsync('SELECT ID FROM USER WHERE GID = ?', GID);
    if(userId.length<1){ userErrorHandler('user does not exist', res); return; };
    return userId[0].ID;
}

//list of all user's classes
router.get('/', async (req, res) => {
    const user = req.user;

    try{
        const userId = await getUserId(user.sub, req.conn, res);
        if(!userId){ return; }

        const sql = `
        SELECT 
            M.ID AS MEMBER_ID, 
            C.ID AS CLASS_ID, 
            L.ID AS LOBBY_ID, 
            M.JOINED_AT, 
            C.NAME AS CLASS_NAME, 
            C.DESCRIPTION AS CLASS_DESCRIPTION, 
            C.MEETING_LINK, 
            C.SCHEDULED_FOR, 
            C.CREATED_AT, 
            U.NAME AS INSTRUCTOR_NAME, 
            U.EMAIL AS INSTRUCTOR_EMAIL, 
            U.PICTURE AS INSTRUCTOR_PICTURE, 
            L.NAME AS LOBBY_NAME, 
            L.CREATED_AT AS LOBBY_CREATED_AT, 
            L.DESCRIPTION AS LOBBY_DESCRIPTION, 
            L.ICON AS LOBBY_ICON, 
            LC.NAME AS LOBBY_CATEGORY, 
            L.CREATOR AS LOBBY_CREATOR_ID
        FROM CLASS_MEMBER AS M
        JOIN LOBBY_CLASS AS C ON M.CLASS = C.ID
        JOIN USER AS U ON C.INSTRUCTOR = U.ID 
        JOIN LOBBY AS L ON C.LOBBY = L.ID
        JOIN LOBBY_CATEGORY AS LC ON LC.ID = L.CATEGORY
        WHERE M.MEMBER = ?
        `;

        const classes = await req.conn.queryAsync(sql, [userId]);

        res.jsonDb(classes);
    }catch(err){
        serverErrorHandler(err, res);
    }
});

module.exports = router;
