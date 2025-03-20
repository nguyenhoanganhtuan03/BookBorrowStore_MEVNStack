const express = require('express');
const router = express.Router();
const borrowController = require('../controllers/borrow.controller');

router.post('/borrow', borrowController.borrowBook);
router.get('/:userId', borrowController.getUserBorrows);

module.exports = router;