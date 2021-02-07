const express = require('express');
const router = express.Router({ mergeParams: true });

//temp user variable
const user = { sub: 'sampleGID' };

//handle errors
const serverErrorHandler = (err, res) => {
    console.log(err);
    res.status(400).json({ error: err.message });
}

const userErrorHandler = (msg, res) => {
    console.log('User Error: ', msg);
    res.status(400).json({ error: msg });
}

//list of all user's classes
router.get('/', (req, res) => {
    const user = req.user;

    try{

    }catch(err){
        serverErrorHandler(err, res);
    }
});

module.exports = router;
