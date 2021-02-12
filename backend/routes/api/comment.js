const express = require('express');
const router = express.Router({ mergeParams: true });

//handle errors
const serverErrorHandler = (err, res) => {
    console.log(err);
    res.status(500).json({ error: err.message });
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

//check for a valid classId and return userLength to check membership
const checkClassId = async (classId, conn, res) => {
    const checkClass = await conn.queryAsync('SELECT * FROM LOBBY_CLASS WHERE ID = ?', [classId]);
    if(checkClass.length<1){ userErrorHandler('classId is not valid', res); return; }
    return checkClass;
}

//check if a user is a member of a given class
const checkUserInClass = async (classId, userId, conn) => {
    const checkUser = await conn.queryAsync('SELECT ID FROM CLASS_MEMBER WHERE CLASS = ? AND MEMBER = ?', [classId, userId]);
    return checkUser.length;
}

//
//
//  GET
//
//
//get all comments with certain query params
router.get('/', async (req, res) => {
    const highlighted = req.query.highlighted;
    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || 100;
    const classId = req.params.classId;
    if(limit<1 || limit>1000){ userErrorHandler('invalid limit range, (1-1000)', res); return; }

    try{
        const checkClass = await checkClassId(classId, req.conn, res);
        if(!checkClass){ return; }

        let where = `WHERE M.CLASS = ?`;
        if(highlighted === true){
            where = `WHERE M.CLASS = ? AND M.HIGHLIGHTED = 1`;
        }

        const sql = `
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
        LEFT JOIN USER AS U ON M.AUTHOR = U.ID
        `+
        where
        +`
        LIMIT ?, ?
        `;
        console.log(sql);

        const comments = await req.conn.queryAsync(sql, [classId, offset, limit]);

        res.jsonDb(comments);
    }catch(err){
        serverErrorHandler(err, res);
    }
});

//get specific comment
router.get('/:commentId/', async (req, res) => {
    const classId = req.params.classId;
    const commentId = req.params.commentId;

    try{
        const checkClass = await checkClassId(classId, req.conn, res);
        if(!checkClass){ return; }

        const sql = `
        SELECT *
        FROM CLASS_MESSAGE
        WHERE ID = ?
        `;

        const message = await req.conn.queryAsync(sql, [commentId]);
        if(message.length<1){ userErrorHandler('invalid comment id', res); return; }

        res.jsonDb(message[0]);
    }catch(err){
        serverErrorHandler(err, res);
    }
});

//
//
//  POST
//
//
//add comment to a class
router.post('/', async (req, res) => {
    
});

//
//
//  PUT
//
//
//modify given comment
router.put('/:commentId/', async (req, res) => {
    
});

//
//
//  DELETE
//
//
//modify given comment
router.delete('/:commentId/', async (req, res) => {
    
});

module.exports = router;
