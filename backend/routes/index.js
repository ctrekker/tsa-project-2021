const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('TSA Software Development Backend v1.0.0');
});

module.exports = router;
