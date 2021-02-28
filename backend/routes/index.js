const express = require('express');
const router = express.Router();

router.use('/api', require('./api'));
router.use('/', require('./frontendProxy'));

router.use((req, res, next) => {
    console.log('error');
})

module.exports = router;
