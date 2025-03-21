const express = require("express");
const router = express.Router();
const publisherController = require("../controllers/publisher.controller");

// Định tuyến API
router.post("/add", publisherController.addPublisher); // Thêm publisher
router.put("/:id", publisherController.updatePublisher); // Cập nhật publisher
router.delete("/:id", publisherController.deletePublisher); // Xóa publisher
router.get("/:id", publisherController.getPublisherById); // Tìm publisher theo ID
router.get("/search/:name", publisherController.getPublisherByName); // Tìm publisher theo tên
router.get("/", publisherController.getAllPublishers); // Hiển thị tất cả NXB

module.exports = router;
