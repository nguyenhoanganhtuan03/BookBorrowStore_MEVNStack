const express = require("express");
const router = express.Router();
const staffController = require("../controllers/staff.controller");

// Định tuyến API
router.put("/:id", staffController.updateStaff); 
router.get("/:id", staffController.getStaffById); 
router.get("/search/:name", staffController.getStaffByName); 
router.get("/", staffController.getAllStaff); 

module.exports = router;
