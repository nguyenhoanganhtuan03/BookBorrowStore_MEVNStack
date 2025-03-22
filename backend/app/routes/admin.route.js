const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");

// Định tuyến API
router.post("/addStaff", adminController.addStaff);
router.post("/adminLogin", adminController.adminLogin);
router.delete("/:id", adminController.deleteStaff);

module.exports = router;
