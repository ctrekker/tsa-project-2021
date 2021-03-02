const express = require('express');
const mysql = require('mysql');
const router = new express.Router();

router.get('/', async (req, res) => {
    const q = req.query.q;

    const lobbies = await req.conn.queryAsync(`
    SELECT LOBBY.ID AS ID,
        LOBBY.NAME AS NAME,
        LOBBY_CATEGORY.NAME AS CATEGORY,
        LOBBY.CREATOR,
        LOBBY.CREATED_AT,
        LOBBY.DESCRIPTION,
        (SELECT COUNT(*) FROM LOBBY_MEMBER AS LM WHERE LM.LOBBY = LOBBY.ID AND LM.MEMBER = ${mysql.escape(req.user.id)}) AS IS_MEMBER,
        (SELECT COUNT(*) FROM LOBBY_MEMBER WHERE LOBBY_MEMBER.LOBBY = LOBBY.ID) AS MEMBER_COUNT,
        (SELECT COUNT(*) FROM LOBBY_POST WHERE LOBBY_POST.LOBBY = LOBBY.ID) AS POST_COUNT,
        (SELECT COUNT(*) FROM LOBBY_CLASS WHERE LOBBY_CLASS.LOBBY = LOBBY.ID) AS CLASS_COUNT
    FROM LOBBY
        LEFT JOIN LOBBY_CATEGORY
            ON LOBBY.CATEGORY=LOBBY_CATEGORY.ID
    WHERE LOBBY.NAME LIKE CONCAT('%', ?, '%') OR LOBBY.DESCRIPTION LIKE CONCAT('%', ?, '%') ORDER BY LOCATE(?, LOBBY.NAME) LIMIT 25`, [q, q, q]);
    const classes = await req.conn.queryAsync(`
    SELECT 
        C.ID, 
        C.NAME, 
        C.DESCRIPTION, 
        (SELECT AVG(R.RATING) FROM CLASS_RATING AS R WHERE R.CLASS = C.ID) AS RATING, 
        (SELECT COUNT(*) FROM CLASS_MEMBER AS CM WHERE CM.CLASS = C.ID AND CM.MEMBER = ?) AS IS_MEMBER, 
        C.MEETING_LINK, 
        C.SCHEDULED_FOR, 
        C.CREATED_AT, 
        C.INSTRUCTOR AS INSTRUCTOR_ID, 
        U.NAME AS INSTRUCTOR_NAME, 
        U.EMAIL AS INSTRUCTOR_EMAIL 
    FROM LOBBY_CLASS AS C 
        LEFT JOIN USER AS U ON C.INSTRUCTOR = U.ID
    WHERE C.NAME LIKE CONCAT('%', ?, '%') OR C.DESCRIPTION LIKE CONCAT('%', ?, '%') ORDER BY LOCATE(?, C.NAME) LIMIT 25`, [req.user.id, q, q, q]);
    const posts = await req.conn.queryAsync(`
    SELECT
        LP.ID, U.NAME AS AUTHOR_NAME, U.ID AS AUTHOR_ID, U.PICTURE AS AUTHOR_PICTURE, LP.CONTENT, LP.CREATED_AT,
        (SELECT COUNT(*) FROM LOBBY_POST_LIKE WHERE POST = LP.ID) AS LIKES,
        (SELECT COUNT(*) FROM LOBBY_POST WHERE PARENT = LP.ID) AS REPLY_COUNT
    FROM
        LOBBY_POST AS LP
            LEFT JOIN
        USER AS U
    ON LP.AUTHOR = U.ID WHERE LP.CONTENT LIKE CONCAT('%', ?, '%') ORDER BY LOCATE(?, LP.CONTENT) LIMIT 25`, [q, q]);
    const comments = await req.conn.queryAsync(`
    SELECT 
        M.ID AS MESSAGE_ID, 
        U.ID AS USER_ID, 
        U.NAME, 
        U.EMAIL, 
        U.PICTURE, 
        M.CONTENT, 
        M.HIGHLIGHTED, 
        M.CREATED_AT 
    FROM CLASS_MESSAGE AS M 
        LEFT JOIN USER AS U 
            ON M.AUTHOR = U.ID
    WHERE M.CONTENT LIKE CONCAT('%', ?, '%') ORDER BY LOCATE(?, M.CONTENT) LIMIT 25`, [q, q]);
    const users = await req.conn.queryAsync(`
    SELECT ID, GID, NAME, PICTURE
    FROM USER
    WHERE NAME LIKE CONCAT('%', ?, '%') ORDER BY LOCATE(?, NAME) LIMIT 5`, [q, q]);

    const o = (x) => x.map(y => res.objDb(y));
    res.json({
        lobbies: o(lobbies),
        classes: o(classes),
        posts: o(posts),
        comments: o(comments),
        users: o(users)
    });
});

module.exports = router;