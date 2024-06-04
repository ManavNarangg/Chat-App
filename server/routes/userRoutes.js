const express = require('express');
const { registerUser, authUser, searchUser } = require('../controller/userController');
const { protect } = require('../Middleware/authMiddleware');
const router = express.Router();

router.post('/', registerUser);
router.post('/login', authUser);
router.get('/', protect, searchUser);

module.exports = router;