const MongoDB = require("../utils/mongodb.util"); 
const Borrow = require("../models/borrow.model");

// 📌 Tạo đơn mượn sách
exports.createBorrow = async (req, res) => {
    try {
        const { userId, bookId, borrowDate, returnDate, note } = req.body;
        if (!userId || !bookId || !borrowDate || !returnDate) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const db = MongoDB.getDatabase();

        // Kiểm tra userId có tồn tại không
        const user = await db.collection("users").findOne({ _id: userId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Kiểm tra bookId có tồn tại không
        const book = await db.collection("books").findOne({ _id: bookId });
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        // Lấy borrowId tiếp theo
        const lastBorrow = await db.collection("borrows")
            .find({})
            .sort({ _id: -1 })
            .limit(1)
            .toArray();
        let nextId = 0;
        if (lastBorrow.length > 0) {
            nextId = parseInt(lastBorrow[0]._id.split("_")[1]) + 1;
        }
        const borrowId = `borrow_${nextId}`;

        // Tạo đơn mượn mới
        const newBorrow = new Borrow(userId, bookId, borrowDate, returnDate, note);
        await db.collection("borrows").insertOne({ _id: borrowId, ...newBorrow });

        res.status(201).json({ message: "Borrow record created successfully", borrow: { _id: borrowId, ...newBorrow } });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Failed to create borrow record", error: error.message });
    }
};


// Cập nhật đơn mượn sách
exports.updateBorrow = async (req, res) => {
    try {
        const { id } = req.params;
        const updateFields = req.body;
        const db = MongoDB.getDatabase();

        if (!/^borrow_\d+$/.test(id)) {
            return res.status(400).json({ message: "Invalid borrow ID format" });
        }

        const updatedBorrow = await db.collection("borrows").updateOne(
            { _id: id },
            { $set: updateFields }
        );

        if (!updatedBorrow.matchedCount) {
            return res.status(404).json({ message: "Borrow record not found" });
        }

        res.json({ message: "Borrow record updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to update borrow record", error: error.message });
    }
};

// Tìm kiếm đơn mượn sách theo ID
exports.getBorrowById = async (req, res) => {
    try {
        const { id } = req.params;
        const db = MongoDB.getDatabase();
        const borrow = await db.collection("borrows").findOne({ _id: id });

        if (!borrow) {
            return res.status(404).json({ message: "Borrow record not found" });
        }

        res.json(borrow);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch borrow record", error: error.message });
    }
};

// Hiển thị tất cả đơn
exports.getAllBorrows = async (req, res) => {
    try {
        const db = MongoDB.getDatabase();
        const borrows = await db.collection("borrows").find().toArray();

        if (borrows.length === 0) {
            return res.status(404).json({ message: "No borrow records found" });
        }

        res.json({ message: "List of all borrow records", borrows });
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve borrow records", error: error.message });
    }
};
