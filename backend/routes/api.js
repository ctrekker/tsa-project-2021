const express = require('express');
const router = new express.Router();
const {db} = require('../db');
const { requireAuth } = require('../auth');

// This will set req.db to a MySQL connection object
router.use(db);

// Note that each route is *plural* to stay RESTful
router.use('/users', require('./api/user'));
router.use('/categories', require('./api/category'));
router.use('/lobbies', require('./api/lobby'));
router.use('/classes', requireAuth, require('./api/class'));
router.use('/lobbies/:lobbyId/classes', requireAuth, require('./api/lobbyClass'));
router.use('/lobbies/:lobbyId/posts/', require('./api/post'));
router.use('/lobbies/:lobbyId/classes/:classId/comments/', require('./api/comment'));

module.exports = router;
