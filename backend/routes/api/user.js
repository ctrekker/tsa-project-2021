const express = require('express');
const db = require('../../db');

const router = new express.Router();

router.get('/', (req, res) => res.send('test'));

module.exports = router;
