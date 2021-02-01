const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ some: 'json response', containing: 'info about user\'s classes, etc.' });
});

module.exports = router;
