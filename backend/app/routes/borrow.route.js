const express = require('express');
const router = express.Router();
const borrowController = require('../controllers/borrow.controller');

router.post('/borrow', borrowController.createBorrow);
router.get('/:id', borrowController.getBorrowById);
router.put('/:id', borrowController.updateBorrow);
router.get('/', borrowController.getAllBorrows);

module.exports = router;