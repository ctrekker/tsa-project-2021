const { query } = require('express');
const express = require('express');
const router = express.Router({mergeParams: true});

const {requireAuth} = require('../../auth');
router.use(requireAuth);

//get all posts from lobby
router.get('/', async (req, res) => {
    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || 100;

    res.jsonDb(await req.conn.queryAsync(`
    SELECT
        LP.ID, U.NAME AS AUTHOR_NAME, U.ID AS AUTHOR_ID, U.PICTURE AS AUTHOR_PICTURE, LP.CONTENT, LP.CREATED_AT,
        (SELECT COUNT(*) FROM LOBBY_POST_LIKE WHERE POST = LP.ID) AS LIKES,
        (SELECT COUNT(*) FROM LOBBY_POST WHERE PARENT = LP.ID) AS REPLY_COUNT
    FROM
        LOBBY_POST AS LP
            LEFT JOIN
        USER AS U
    ON LP.AUTHOR = U.ID
    WHERE LP.LOBBY = ? AND LP.PARENT IS NULL 
    ORDER BY LP.CREATED_AT DESC 
    LIMIT ?, ?
    `, [req.params.lobbyId, offset, limit]));
});

//get post by id
router.get('/:postId/', async (req, res) => {
    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || 100;

    const sql = `
    SELECT
        LP.ID, U.NAME AS AUTHOR_NAME, U.ID AS AUTHOR_ID, U.PICTURE AS AUTHOR_PICTURE, LP.CONTENT, LP.CREATED_AT,
        (SELECT COUNT(*) FROM LOBBY_POST_LIKE WHERE POST = LP.ID) AS LIKES,
        (SELECT COUNT(*) FROM LOBBY_POST WHERE PARENT = LP.ID) AS REPLY_COUNT
    FROM
        LOBBY_POST AS LP
            LEFT JOIN
        USER AS U
    ON LP.AUTHOR = U.ID
    WHERE LP.LOBBY = ? AND LP.ID = ?
    `;
    const post = await req.conn.queryAsync(sql, [req.params.lobbyId, req.params.postId]);

    const subpostSql = `
    SELECT 
        LP.ID, 
        U.NAME AS AUTHOR_NAME, 
        U.PICTURE AUTHOR_PICTURE, 
        U.ID AS AUTHOR_ID, 
        LP.CLASS AS CLASS_ID, 
        LP.CONTENT, 
        LP.CREATED_AT
    FROM LOBBY_POST AS LP 
    JOIN USER AS U ON LP.AUTHOR = U.ID
    WHERE LP.PARENT = ? 
    ORDER BY LP.CREATED_AT 
    LIMIT ?, ?
    `;
    const subposts = await req.conn.queryAsync(subpostSql, [post[0].ID, offset, limit]);
    res.jsonDb({ ...post[0], subposts: subposts.map(x => res.objDb(x)) });
});

//Creates a post and returns the new post json object
router.post('/', async (req, res) => {
    const sql = `INSERT INTO LOBBY_POST (AUTHOR, LOBBY, PARENT, CLASS, CONTENT) 
    VALUES ((SELECT ID FROM USER WHERE EMAIL=?), ?, ?, ?, ?);`;
    const post = await req.conn.queryAsync(sql, [req.user.email, req.params.lobbyId, (req.body.parent || null), (req.body.class || null), req.body.content]);

    const fetchLastPost = `
        SELECT 
            P.ID AS POST_ID, 
            U.ID AS AUTHOR_ID, 
            U.NAME AS AUTHOR_NAME, 
            U.EMAIL AS AUTHOR_EMAIL, 
            U.PICTURE AS AUTHOR_PICTURE,
            P.LOBBY AS LOBBY_ID, 
            P.PARENT, 
            P.CLASS, 
            P.CONTENT, 
            P.CREATED_AT
        FROM LOBBY_POST AS P LEFT JOIN USER AS U ON P.AUTHOR=U.ID 
        WHERE P.ID=LAST_INSERT_ID();`
    const lastPost = await req.conn.queryAsync(fetchLastPost);

    res.jsonDb(lastPost);
});

//like a post
router.post('/:postId/like/', async (req, res) => {
    try {
        const like = await req.conn.queryAsync(`INSERT INTO LOBBY_POST_LIKE (USER, POST) VALUES ((SELECT ID FROM USER WHERE EMAIL=?), ?)`, [req.user.email, req.params.postId]);
        if(like) res.jsonDb(like)
    } catch(e) {
        res.status(400).json({ message: 'cannot like a post more than once' });
    }
});

//edit a post
router.put('/:postId/', async (req, res) => {
    const queryAuthor = `
        SELECT 
            U.GID
        FROM
            LOBBY_POST AS P
        LEFT JOIN USER AS U
            ON P.AUTHOR=U.ID
        WHERE 
            P.ID=?`
    const author = await req.conn.queryAsync(queryAuthor, [req.params.postId]);
    console.log(author[0].GID)
    if(author[0].GID != req.user.sub) return res.status(403).json({err: "You are not the author of this post!"});
    
    if(!(req.body.content || req.body.class)) return res.status(400).json({err: "No contents provided to change."});

    const UpdateContentAndClass = `
        UPDATE 
            LOBBY_POST
        SET 
            CONTENT=?,
            CLASS=?
        WHERE 
            ID=?`
    const UpdateContent = `
    UPDATE 
        LOBBY_POST
    SET 
        CONTENT=?
    WHERE 
        ID=?`
    const UpdateClass = `
    UPDATE 
        LOBBY_POST
    SET 
        CLASS=?
    WHERE 
        ID=?`
    
    let update;
    if(req.body.content & req.body.class) update = await req.conn.queryAsync(UpdateContentAndClass, [req.body.content, req.body.class, parseInt(req.params.postId)]);
    else if(req.body.content) update = await req.conn.queryAsync(UpdateContent, [req.body.content, parseInt(req.params.postId)]);
    else update = await req.conn.queryAsync(UpdateClass, [req.body.class, parseInt(req.params.postId)]);
    
    const checkField = await req.conn.queryAsync(`SELECT * FROM LOBBY_POST WHERE ID=?`, [parseInt(req.params.postId)])
    console.log(checkField)
    if(req.body.content && req.body.content != checkField[0].CONTENT) return res.status(500).json({err: "Server failed to update content."})
    if(req.body.class && req.body.class != checkField[0].CLASS) return res.status(500).json({err: "Server failed to update class."})

    res.jsonDb(checkField[0]);

});

//delete post if author
router.delete('/:postId/', async (req, res) => {
    const queryAuthor = `
        SELECT 
            U.GID
        FROM
            LOBBY_POST AS P
        LEFT JOIN USER AS U
            ON P.AUTHOR=U.ID
        WHERE 
            P.ID=?`
    const author = await req.conn.queryAsync(queryAuthor, [req.params.postId]);
    console.log(author[0].GID)
    if(author[0].GID != req.user.sub) return res.status(403).json({err: "You are not the author of this post!"});

    const deleteLike = await req.conn.queryAsync(`DELETE FROM LOBBY_POST_LIKE WHERE POST=?;`, [parseInt(req.params.postId)]);
    const deletePost = await req.conn.queryAsync(`DELETE FROM LOBBY_POST WHERE ID=?`, [parseInt(req.params.postId)])
    res.jsonDb(deletePost)
});

module.exports = router;
