const express = require("express");
const router = express.Router();
const staffController = require("../controllers/staff.controller");

// Định tuyến API
router.post('/login', staffController.login);
router.put("/:id", staffController.updateStaff); 
router.get("/:id", staffController.getStaffById); 
router.get("/search/:username", staffController.getStaffByName); 
router.get("/", staffController.getAllStaffs); 

module.exports = router;
