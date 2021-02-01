const express = require('express');
const router = new express.Router();
const {db} = require('../db');

// This will set req.db to a MySQL connection object
router.use(db);

// Note that each route is *plural* to stay RESTful
router.use('/users', require('./api/user'));
router.use('/lobbies', require('./api/lobby'));

module.exports = router;
