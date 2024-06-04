const express = require('express');
const { protect } = require('../Middleware/authMiddleware');
const { sendMessage, allMessages } = require('../controller/MessageController');
const router = express.Router();

router.post('/', protect, sendMessage);
router.get('/:chatId',protect, allMessages);

module.exports = router;