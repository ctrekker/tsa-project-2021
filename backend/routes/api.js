const express = require('express');
const router = new express.Router();
const {db} = require('../db');
const { requireAuth } = require('../auth');

// This will set req.db to a MySQL connection object
router.use(db);

// Note that each route is *plural* to stay RESTful
router.use('/users', require('./api/user'));
router.use('/categories', require('./api/category'));
router.use('/lobbies', requireAuth, require('./api/lobby'));
router.use('/classes', requireAuth, require('./api/class'));
router.use('/lobbies/:lobbyId/classes', requireAuth, require('./api/lobbyClass'));
router.use('/lobbies/:lobbyId/posts/', requireAuth, require('./api/post'));
router.use('/lobbies/:lobbyId/classes/:classId/comments/', requireAuth, require('./api/comment'));
router.use('/search', requireAuth, require('./api/search'));

module.exports = router;
