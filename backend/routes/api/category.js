const express = require('express');
const router = new express.Router();

router.get('/', async (req, res) => {
    res.jsonDb(await req.conn.queryAsync('SELECT ID, NAME FROM LOBBY_CATEGORY'));
});

module.exports = router;