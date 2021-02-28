const express = require('express');
const router = express.Router({ mergeParams: true });
const COMMENT_LIMIT = 2000;

const messageSQL = `
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
`;

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

//check if a comment exists
const checkForComment = async (commentId, conn, res) => {
    const checkComment = await conn.queryAsync('SELECT * FROM CLASS_MESSAGE WHERE ID = ?', [commentId]);
    if(checkComment.length<1){ userErrorHandler('commentId is not valid', res); return; }
    return checkComment;
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

        let where = `WHERE M.CLASS = ? `;
        if(highlighted === 'true'){
            where = `WHERE M.CLASS = ? AND M.HIGHLIGHTED = 1 `;
        }

        const sql = messageSQL + where + `ORDER BY M.CREATED_AT DESC LIMIT ?, ?`;

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

        const sql = messageSQL + `WHERE M.ID = ?`;

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
    const classId = req.params.classId;
    const message = req.body.content;
    if(message.length>COMMENT_LIMIT){ userErrorHandler('message exceeds character limit ('+COMMENT_LIMIT+')', res); return; }
    const highlighted = req.body.highlighted;
    const user = req.user;

    try{
        const userId = await getUserId(user.sub, req.conn, res);
        if(!userId){ return; }
        const checkClass = await checkClassId(classId, req.conn, res);
        if(!checkClass){ return; }

        let highlightedBool = false;
        if(userId === checkClass[0].INSTRUCTOR && highlighted === 'true'){ highlightedBool = true; }

        const sql = `INSERT INTO CLASS_MESSAGE (AUTHOR, CLASS, CONTENT, HIGHLIGHTED) VALUES (?, ?, ?, ?)`;

        const okPacket = await req.conn.queryAsync(sql, [userId, classId, message, highlightedBool]);

        const verifyAddition = await req.conn.queryAsync('SELECT * FROM CLASS_MESSAGE WHERE ID = ?', [okPacket.insertId]);
        if(verifyAddition.length<1){ throw Error('created message not found'); }

        res.jsonDb(verifyAddition[0]);
    }catch(err){
        serverErrorHandler(err, res);
    }
});

//
//
//  PUT
//
//
//modify given comment
router.put('/:commentId/', async (req, res) => {
    const classId = req.params.classId;
    const commentId = req.params.commentId;
    const message = req.body.content;
    if(message.length>COMMENT_LIMIT){ userErrorHandler('message exceeds character limit ('+COMMENT_LIMIT+')', res); return; }
    const highlighted = req.body.highlighted;
    const user = req.user;

    try{
        const userId = await getUserId(user.sub, req.conn, res);
        if(!userId){ return; }
        const checkClass = await checkClassId(classId, req.conn, res);
        if(!checkClass){ return; }
        const checkComment = await checkForComment(commentId, req.conn, res);
        if(!checkComment){ return; }
        if(checkComment[0].AUTHOR != userId){ userErrorHandler('only the author can edit their comment', res); return; }

        let highlightedBool = checkComment[0].HIGHLIGHTED;
        if(userId === checkClass[0].INSTRUCTOR){
            if(highlighted === 'true'){ highlightedBool = true; }
            else if(highlighted === 'false'){ highlightedBool = false; }
        }

        const sql = `UPDATE CLASS_MESSAGE SET CONTENT = ?, HIGHLIGHTED = ? WHERE ID = ?`;
        const okPacket = await req.conn.queryAsync(sql, [message || checkComment[0].CONTENT, highlightedBool, commentId]);

        const newComment = await req.conn.queryAsync('SELECT * FROM CLASS_MESSAGE WHERE ID = ?', [commentId]);
        if(newComment.length<1){ throw Error('unable to confirm changes to comment'); }

        res.jsonDb(newComment[0]);
    }catch(err){
        serverErrorHandler(err, res);
    }
});

//
//
//  DELETE
//
//
//modify given comment
router.delete('/:commentId/', async (req, res) => {
    const commentId = req.params.commentId;
    const user = req.user;

    try{
        const userId = await getUserId(user.sub, req.conn, res);
        if(!userId){ return; }
        const checkComment = await checkForComment(commentId, req.conn, res);
        if(!checkComment){ return; }
        if(checkComment[0].AUTHOR != userId){ userErrorHandler('only the author can delete their comment', res); return; }

        const sql = `DELETE FROM CLASS_MESSAGE WHERE ID = ?`;
        const okPacket = await req.conn.queryAsync(sql, [commentId]);

        res.json({ success: 'comment has been deleted'} );
    }catch(err){
        serverErrorHandler(err, res);
    }
});

module.exports = router;
