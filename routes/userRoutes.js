const express = require('express');
const router = express.Router();
const protect = require('../middleWare/authMiddleWare')
const {registerUser, loginUser, updateUser, deleteUser}= require('../controllers/userController')
router.post('/', registerUser)
router.post('/login',protect, loginUser)
router.put('/:id',protect, updateUser)
router.delete('/:id',protect,deleteUser)

module.exports = router;