const express = require('express');
const router = express.Router();
const protect = require('../middleWare/authMiddleWare');
const  {createData, getData, updateData, deleteData} = require('../controllers/dataController')


router.route('/').post(protect, createData).get(protect,getData)
router.route('/:id').put(protect, updateData).delete(protect, deleteData)



module.exports = router;