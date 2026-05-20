const express = require('express');
const router = express.Router();
const { getContent, saveResult } = require('../controllers/practiceController');
const { optionalAuth } = require('../middleware/authMiddleware');

// Public to get content
router.get('/content', getContent);

router.post('/results', optionalAuth, saveResult);

module.exports = router;
