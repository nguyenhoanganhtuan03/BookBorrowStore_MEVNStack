const express = require("express");
const router = express.Router();
const bookController = require("../controllers/book.controller");

// Định tuyến API
router.post("/add", bookController.addBook); // Thêm sách mới
router.get("/", bookController.getBooks); // Lấy danh sách sách
router.get("/:id", bookController.getBookById); // Lấy thông tin sách theo ID
router.put("/:id", bookController.updateBook); // Cập nhật thông tin sách
router.delete("/:id", bookController.deleteBook); // Xóa sách
router.get("/search/:bookname", bookController.getBookByName); /// Lấy thông tin sách theo tên

module.exports = router;
