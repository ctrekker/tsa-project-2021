const express = require('express');
const router = new express.Router();

router.get('/', async (req, res) => {
    res.jsonDb(await req.conn.queryAsync(`
        SELECT
            ID,
            NAME,
            (SELECT COUNT(*) FROM LOBBY WHERE LOBBY.CATEGORY = LOBBY_CATEGORY.ID) AS LOBBY_COUNT
        FROM LOBBY_CATEGORY
    `));
});

module.exports = router;