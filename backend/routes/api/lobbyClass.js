const express = require('express');
const router = express.Router({ mergeParams: true });
const LIMIT_RANGE = [1, 1000];
const RATING_RANGE = [1, 5];

const classQuery = `
SELECT 
    C.ID, 
    C.NAME, 
    C.DESCRIPTION, 
    (SELECT AVG(R.RATING) FROM CLASS_RATING AS R WHERE R.CLASS = C.ID) AS RATING, 
    C.MEETING_LINK, 
    C.SCHEDULED_FOR, 
    C.CREATED_AT, 
    C.INSTRUCTOR AS INSTRUCTOR_ID, 
    U.NAME AS INSTRUCTOR_NAME, 
    U.EMAIL AS INSTRUCTOR_EMAIL 
FROM LOBBY_CLASS AS C 
LEFT JOIN USER AS U ON C.INSTRUCTOR = U.ID 
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

//check if a user is a member of a given class
const checkUserInClass = async (classId, userId, conn) => {
    const checkUser = await conn.queryAsync('SELECT ID FROM CLASS_MEMBER WHERE CLASS = ? AND MEMBER = ?', [classId, userId]);
    return checkUser.length;
}

//check existance of a specific rating
const checkForRating = async (userId, classId, conn) => {
    const checkRating = await conn.queryAsync('SELECT * FROM CLASS_RATING WHERE USER = ? AND CLASS = ?', [userId, classId]);
    return checkRating;
}

//check for existance of a lobby
const checkForLobby = async (lobbyId, conn) => {
    const checkLobby = await conn.queryAsync('SELECT NAME FROM LOBBY WHERE ID = ?', [lobbyId]);
    return checkLobby;
}

//
//
//  GET
//
//
//get limited list with given lobby's classes
router.get('/', async (req, res) => {
    const lobbyId = req.params.lobbyId;
    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || 100;
    if(limit<LIMIT_RANGE[0] || limit>LIMIT_RANGE[1]){ userErrorHandler('invalid limit range, ('+LIMIT_RANGE[0]+'-'+LIMIT_RANGE[1]+')', res); return; }

    try{
        const checkLobby = await checkForLobby(lobbyId, req.conn);
        if(checkLobby.length<1){ userErrorHandler('invalid lobby id', res); return; }

        const sql = classQuery + `WHERE C.LOBBY = ? LIMIT ?, ?`;
        const classArray = await req.conn.queryAsync(sql, [lobbyId, offset, limit]);

        res.jsonDb(classArray);
    }catch(err){
        serverErrorHandler(err, res);
    }
});

//get specific class by its id
router.get('/:classId/', async (req, res) => {
    const classId = req.params.classId;

    try{
        const sqlClass = classQuery + 'WHERE C.ID = ?';
        const classRes = await req.conn.queryAsync(sqlClass, [classId]);
        if(classRes.length<1){ userErrorHandler('invalid class id', res); return; }

        const sqlMembers = `
        SELECT 
            M.ID AS MEMBER_ID, 
            M.JOINED_AT, 
            U.ID AS USER_ID, 
            U.NAME, 
            U.EMAIL,
            U.PICTURE
        FROM CLASS_MEMBER AS M 
        LEFT JOIN USER AS U ON U.ID = M.MEMBER 
        WHERE M.CLASS = ?
        `;
        const members = await req.conn.queryAsync(sqlMembers, [classId]);

        res.jsonDb({ ...classRes[0], members: members.map(x => res.objDb(x)) });
    }catch(err){
        serverErrorHandler(err, res);
    }
});

//get class ratings by its id
router.get('/:classId/ratings/', async (req, res) => {
    const classId = req.params.classId;

    try{
        const classRes = await req.conn.queryAsync('SELECT ID FROM LOBBY_CLASS WHERE ID = ?', [classId]);
        if(classRes.length<1){ userErrorHandler('invalid class id', res); return; }

        const sql = `
        SELECT 
            R.RATING, 
            R.CREATED_AT, 
            U.ID AS USER_ID, 
            U.NAME, 
            U.EMAIL, 
            U.PICTURE 
        FROM CLASS_RATING AS R 
        LEFT JOIN USER AS U ON U.ID = R.USER 
        WHERE R.CLASS = ?
        `;
        const ratings = await req.conn.queryAsync(sql, [classId]);

        res.jsonDb(ratings);
    }catch(err){
        serverErrorHandler(err, res);
    }
});

//
//
//  POST
//
//
//add a class to a lobby
router.post('/', async (req, res) => {
    const lobbyId = req.params.lobbyId;
    const userInput = req.body;
    const user = req.user;

    try{
        const userId = await getUserId(user.sub, req.conn, res);
        if(!userId){ return; }
        const checkLobby = await checkForLobby(lobbyId, req.conn);
        if(checkLobby.length<1){ userErrorHandler('invalid lobby id', res); return; }

        let sch_for = new Date(userInput.scheduled_for);

        const sql = 'INSERT INTO LOBBY_CLASS (NAME, DESCRIPTION, INSTRUCTOR, LOBBY, MEETING_LINK, SCHEDULED_FOR) VALUES (?, ?, ?, ?, ?, ?)';
        const okPacket = await req.conn.queryAsync(sql, [userInput.name, userInput.description, userId, lobbyId, userInput.meeting_link, sch_for]);

        await req.conn.queryAsync('INSERT INTO CLASS_MEMBER (MEMBER, CLASS) VALUES (?, ?)', [userId, okPacket.insertId]);
        
        const newClass = await req.conn.queryAsync('SELECT * FROM LOBBY_CLASS WHERE ID = ?', okPacket.insertId);
        if(newClass.length<1){ throw Error('created class not found'); }

        res.jsonDb(newClass[0]);
    }catch(err){
        serverErrorHandler(err, res);
    }
});

//join a specific class
router.post('/:classId/join/', async (req, res) => {
    const classId = req.params.classId;
    const user = req.user;

    try{
        const userId = await getUserId(user.sub, req.conn, res);
        if(!userId){ return; }
        const checkClass = await checkClassId(classId, req.conn, res);
        if(!checkClass){ return; }
        if(checkClass[0].INSTRUCTOR === userId){ userErrorHandler('instructor cannot join their own class', res); return; }
        const userLength = await checkUserInClass(classId, userId, req.conn);
        if(userLength>0){ userErrorHandler('user is already a member of this class', res); return; }

        const sql = 'INSERT INTO CLASS_MEMBER (MEMBER, CLASS) VALUES (?, ?)';
        const okPacket = await req.conn.queryAsync(sql, [userId, classId]);

        res.jsonDb(checkClass[0]);
    }catch(err){
        serverErrorHandler(err, res);
    }
});

//leave a specific class
router.post('/:classId/leave/', async (req, res) => {
    const classId = req.params.classId;
    const user = req.user;

    try{
        const userId = await getUserId(user.sub, req.conn, res);
        if(!userId){ return; }
        const checkClass = await checkClassId(classId, req.conn, res);
        if(!checkClass){ return; }
        const userLength = await checkUserInClass(classId, userId, req.conn);
        if(userLength<1){ userErrorHandler('user is not a member of this class', res); return; }

        const sql = 'DELETE FROM CLASS_MEMBER WHERE CLASS = ? AND MEMBER = ?';
        const okPacket = await req.conn.queryAsync(sql, [classId, userId]);

        res.jsonDb(checkClass[0]);
    }catch(err){
        serverErrorHandler(err, res);
    }
});

//add a class rating
router.post('/:classId/ratings/', async (req, res) => {
    const classId = req.params.classId;
    const rating = parseFloat(req.body.rating);
    if(!rating || (rating<RATING_RANGE[0] || rating>RATING_RANGE[1])){ userErrorHandler('invalid rating type, please enter a valid float point value ('+RATING_RANGE[0]+'-'+RATING_RANGE[1]+')', res); return; }
    const user = req.user;
    
    try{
        const userId = await getUserId(user.sub, req.conn, res);
        if(!userId){ return; }
        const checkClass = await checkClassId(classId, req.conn, res);
        if(!checkClass){ return; }
        const checkRating = await checkForRating(userId, classId, req.conn);
        if(checkRating.length>0){ userErrorHandler('user has already left a review for this class', res); return; }
        if(checkClass[0].INSTRUCTOR === userId){ userErrorHandler('instructor cannot review their own class', res); return; }

        const sql = 'INSERT INTO CLASS_RATING (USER, CLASS, RATING) VALUES (?, ?, ?)';
        const okPacket = await req.conn.queryAsync(sql, [userId, classId, rating]);
        const verifiedRating = await req.conn.queryAsync('SELECT * FROM CLASS_RATING WHERE ID = ?', [okPacket.insertId]);
        if(verifiedRating.length<1){ throw Error('could not confirm rating addition'); }

        res.jsonDb(verifiedRating[0]);
    }catch(err){
        serverErrorHandler(err, res);
    }
});

//
//
//  PUT
//
//
//modify specific class
router.put('/:classId/', async (req, res) => {
    const userInput = req.body;
    if(userInput.length<1){ userErrorHandler('please send some values to modify', res); return; }
    const classId = req.params.classId;
    const user = req.user;

    try{
        const userId = await getUserId(user.sub, req.conn, res);
        if(!userId){ return; }
        const checkClass = await checkClassId(classId, req.conn, res);
        if(!checkClass){ return; }
        if(checkClass[0].INSTRUCTOR != userId){ userErrorHandler('only the instructor can modify a class', res); return; }
        let sch_for;
        if(userInput.scheduled_for){
            userInput.scheduled_for = parseFloat(userInput.scheduled_for);
            sch_for = new Date(0);
            sch_for.setUTCSeconds(userInput.scheduled_for);
        }

        const sql = 'UPDATE LOBBY_CLASS SET NAME = ?, DESCRIPTION = ?, MEETING_LINK = ?, SCHEDULED_FOR = ? WHERE ID = ?';
        const okPacket = await req.conn.queryAsync(sql, [
            userInput.name || checkClass[0].NAME,
            userInput.description || checkClass[0].DESCRIPTION,
            userInput.meeting_link || checkClass[0].MEETING_LINK,
            sch_for || checkClass[0].SCHEDULED_FOR,
            classId
        ]);
        
        const newClass = await req.conn.queryAsync('SELECT * FROM LOBBY_CLASS WHERE ID = ?', [classId]);
        if(newClass.length<1){ throw Error('unable to find updated class'); }
        
        res.jsonDb(newClass[0]);
    }catch(err){
        serverErrorHandler(err, res);
    }
});

//modify a specific rating
router.put('/:classId/ratings/', async (req, res) => {
    const classId = req.params.classId;
    const user = req.user;
    const rating = parseFloat(req.body.rating);
    if(!rating || (rating<RATING_RANGE[0] || rating>RATING_RANGE[1])){ userErrorHandler('please enter a valid rating in the body ('+RATING_RANGE[0]+'-'+RATING_RANGE[1]+')', res); return; }

    try{
        const userId = await getUserId(user.sub, req.conn, res);
        if(!userId){ return; }
        const checkClass = await checkClassId(classId, req.conn, res);
        if(!checkClass){ return; }
        const oldRating = await checkForRating(userId, classId, req.conn);
        if(oldRating.length<1){ userErrorHandler('user rating does not exist for this class', res); return; }

        const sql = 'UPDATE CLASS_RATING SET RATING = ? WHERE ID = ?';
        const okPacket = await req.conn.queryAsync(sql, [rating, oldRating[0].ID]);

        const newRating = await req.conn.queryAsync('SELECT * FROM CLASS_RATING WHERE ID = ?', [oldRating[0].ID]);
        if(newRating.length<1){ throw Error('unable to confirm changes to rating'); }
        
        res.jsonDb(newRating[0]);
    }catch(err){
        serverErrorHandler(err, res);
    }
});

//
//
//  DELETE
//
//
//delete a class, only by creator
router.delete('/:classId', async (req, res) => {
    const classId = req.params.classId;
    const user = req.user;

    try{
        const userId = await getUserId(user.sub, req.conn, res);
        if(!userId){ return; }
        const checkClass = await checkClassId(classId, req.conn, res);
        if(!checkClass){ return; }
        if(checkClass[0].INSTRUCTOR != userId){ userErrorHandler('only the instructor can delete a class', res); return; }

        const sqlArr = [
            'DELETE FROM CLASS_MESSAGE WHERE CLASS = ?',
            'DELETE FROM CLASS_RATING WHERE CLASS = ?',
            'DELETE FROM CLASS_MEMBER WHERE CLASS = ?',
            'DELETE FROM LOBBY_CLASS WHERE ID = ?'
        ];
        let okPacketArr = [];
        for(let i = 0;i<sqlArr.length;i++){
            okPacketArr.push(await req.conn.queryAsync(sqlArr[i], [checkClass[0].ID]));
        }
        
        res.json({ success: 'class has been deleted' });
    }catch(err){
        serverErrorHandler(err, res);
    }
});

//delete a review, only by creator
router.delete('/:classId/ratings/', async (req, res) => {
    const classId = req.params.classId;
    const user = req.user;

    try{
        const userId = await getUserId(user.sub, req.conn, res);
        if(!userId){ return; }
        const oldRating = await checkForRating(userId, classId, req.conn);
        if(oldRating[0].USER != userId){ userErrorHandler('only the creator can delete a review', res); return; }

        const sql = 'DELETE FROM CLASS_RATING WHERE ID = ?';
        const okPacket = await req.conn.queryAsync(sql, [oldRating[0].ID]);
        
        res.json({ success: 'review has been deleted' });
    }catch(err){
        serverErrorHandler(err, res);
    }
});

module.exports = router;
