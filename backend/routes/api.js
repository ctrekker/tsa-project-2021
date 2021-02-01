const express = require('express');
const router = new express.Router();

// Note that each route is *plural* to stay RESTful
router.use('/users', require('./api/user'));
router.use('/lobbies', require('./api/lobby'));

module.exports = router;
