const express = require('express');
const router = express.Router(); 
const { protect } = require('../Middleware/authMiddleware'); 
const { accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup } = require('../controller/ChatController');

router.post('/', protect, accessChat);
router.get('/', protect, fetchChats);
router.post('/group', protect, createGroupChat);
router.put('/rename', protect, renameGroup);
router.put('/groupRemove', protect, removeFromGroup);
router.put('/groupAdd', protect, addToGroup);

module.exports = router;
