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

        // Lấy tất cả borrow _id, tìm số lớn nhất
        const allBorrows = await db.collection("borrows").find({}, { projection: { _id: 1 } }).toArray();
        let maxId = 0;

        allBorrows.forEach(borrow => {
            const match = borrow._id.match(/^borrow_(\d+)$/); // Tìm số trong _id
            if (match) {
                const idNum = parseInt(match[1], 10);
                if (idNum > maxId) {
                    maxId = idNum;
                }
            }
        });

        const borrowId = `borrow_${maxId + 1}`; // Tạo ID tiếp theo

        // Lấy username và bookname
        const username = user.username;
        const bookname = book.bookname;

        // Tạo đơn mượn mới
        const newBorrow = new Borrow(userId, username, bookId, bookname, borrowDate, returnDate, note);

        console.log("📚 Thêm đơn mượn:", JSON.stringify({ _id: borrowId, ...newBorrow }, null, 2));

        // Lưu vào DB
        await db.collection("borrows").insertOne({ _id: borrowId, ...newBorrow });

        // Trừ quantity của sách đi 1
        await db.collection("books").updateOne(
            { _id: bookId },
            { $set: { quantity: Math.max(0, parseInt(book.quantity) - 1) } } // Đảm bảo không âm
        );

        res.status(201).json({ message: "Borrow record created successfully", borrow: { _id: borrowId, ...newBorrow } });
    } catch (error) {
        console.log("🚨 Lỗi khi tạo đơn mượn:", error);
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

        // Kiểm tra nếu note thay đổi thành "Đã trả"
        if (updateFields.note && updateFields.note === "Đã trả") {
            // Tìm đơn mượn hiện tại để lấy thông tin sách
            const borrow = await db.collection("borrows").findOne({ _id: id });
            if (!borrow) {
                return res.status(404).json({ message: "Borrow record not found" });
            }

            // Lấy thông tin sách từ bookId
            const book = await db.collection("books").findOne({ _id: borrow.bookId });
            if (!book) {
                return res.status(404).json({ message: "Book not found" });
            }

            // Cập nhật lại số lượng sách
            await db.collection("books").updateOne(
                { _id: borrow.bookId },
                { $set: { quantity: (parseInt(book.quantity) + 1) } }
            );
        }

        // Lấy thông tin username và bookname nếu chúng không có trong updateFields
        if (!updateFields.username || !updateFields.bookname) {
            const borrow = await db.collection("borrows").findOne({ _id: id });
            if (!borrow) {
                return res.status(404).json({ message: "Borrow record not found" });
            }

            // Lấy username từ bảng users
            const user = await db.collection("users").findOne({ _id: borrow.userId });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            updateFields.username = user.username;

            // Lấy bookname từ bảng books
            const book = await db.collection("books").findOne({ _id: borrow.bookId });
            if (!book) {
                return res.status(404).json({ message: "Book not found" });
            }
            updateFields.bookname = book.bookname;
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

// Lấy danh sách đơn mượn theo userId
exports.getBorrowsByUserId = async (req, res) => {
    try {
        const userId  = req.params;
        const db = MongoDB.getDatabase();

        // Tìm kiếm các đơn mượn theo userId
        const borrows = await db.collection("borrows").find(userId).toArray();

        if (borrows.length === 0) {
            return res.status(404).json({ message: "No borrow records found for this user" });
        }

        res.json({ message: "List of borrow records for user", borrows });
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve borrow records", error: error.message });
    }
};