const express = require('express');
const router = express.Router();

const {requireAuth} = require('../../auth');
router.use(requireAuth);

router.get('/', async (req, res) => {
    
});
router.get('/:commentId/', async (req, res) => {
    
});

router.post('/', async (req, res) => {
    
});

router.put('/:commentId/', async (req, res) => {
    
});

router.delete('/:commentId/', async (req, res) => {
    
});

module.exports = router;
