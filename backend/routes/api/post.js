const express = require('express');
const router = express.Router();

const {requireAuth} = require('../../auth');
router.use(requireAuth);

router.get('/', async (req, res) => {
    res.jsonDb(await req.conn.queryAsync('SELECT * FROM LOBBY_POST WHERE LOBBY = ?', [req.params.lobbyId]));
});
router.get('/:postId/', async (req, res) => {
    const sql = ```
    SELECT
        LP.ID, U.NAME, U.PICTURE, LP.CONTENT, LP.CREATED_AT,
        (SELECT COUNT(*) FROM LOBBY_POST_LIKE WHERE POST = LOBBY_POST.ID) AS LIKES
    FROM
        LOBBY_POST AS LP
            LEFT JOIN
        USER AS U
    ON LP.AUTHOR = U.ID
    WHERE LP.LOBBY = ? AND LP.ID = ?
    ```;
    const post = await req.conn.queryAsync(sql, [req.params.lobbyId, req.params.postId]);
    post.subposts = await req.conn.queryAsync('SELECT * FROM LOBBY_POST WHERE PARENT = ?', [post.ID]);
    res.jsonDb(post);
});

router.post('/', async (req, res) => {

});
router.post('/:postId/like/', async (req, res) => {

});

router.put('/:postId/', async (req, res) => {

});

router.delete('/:postId/', async (req, res) => {

});

module.exports = router;
