const MongoDB = require("../utils/mongodb.util"); // Import MongoDB helper

// 📌 API mượn sách
exports.borrowBook = async (req, res) => {
    try {
        const { userId, bookTitle } = req.body;

        // Kiểm tra thông tin đầu vào
        if (!userId || !bookTitle) {
            return res.status(400).json({ message: "User ID and Book Title are required" });
        }

        // Kết nối với MongoDB
        const db = MongoDB.getDatabase();
        if (!db) {
            return res.status(500).json({ message: "Database connection error" });
        }

        // Ghi nhận thông tin mượn sách
        const borrowDate = new Date();
        await db.collection("borrows").insertOne({ userId, bookTitle, borrowDate });

        res.json({ message: "Book borrowed successfully" });
    } catch (error) {
        console.error("BorrowBook error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// 📌 API lấy danh sách sách đã mượn của user
exports.getUserBorrows = async (req, res) => {
    try {
        const { userId } = req.params;

        // Kiểm tra userId
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // Kết nối với MongoDB
        const db = MongoDB.getDatabase();
        if (!db) {
            return res.status(500).json({ message: "Database connection error" });
        }

        // Truy vấn danh sách sách đã mượn
        const borrows = await db.collection("borrows").find({ userId }).toArray();

        res.json(borrows);
    } catch (error) {
        console.error("GetUserBorrows error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
