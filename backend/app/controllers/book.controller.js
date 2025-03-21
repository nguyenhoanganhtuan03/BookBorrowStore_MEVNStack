const MongoDB = require("../utils/mongodb.util");
const { ObjectId } = require("mongodb");

// Thêm sách mới
exports.addBook = async (req, res) => {
    try {
        const { bookname, author, price, quantity, year, publisherId, category, image } = req.body;
        if (!bookname || !author || !price || !quantity) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const db = MongoDB.getDatabase();

        // Lấy ID sách lớn nhất hiện có
        const lastBook = await db.collection("books")
            .find({})
            .sort({ _id: -1 })
            .limit(1)
            .toArray();

        let nextId = 0;
        if (lastBook.length > 0) {
            nextId = parseInt(lastBook[0]._id.split("_")[1]) + 1;
        }
        const bookId = `book_${nextId}`;

        const newBook = { 
            _id: bookId,
            bookname, 
            author, 
            price: Number(price), 
            quantity: Number(quantity),
            year: year || null,
            publisherId: publisherId || null,
            category: category || null,
            image: image || null
        };

        await db.collection("books").insertOne(newBook);
        res.status(201).json({ message: "Book added successfully", bookId });
    } catch (error) {
        console.error("🚨 Error adding book:", error);
        res.status(500).json({ message: "Failed to add book", error: error.message });
    }
};

// Lấy danh sách tất cả sách
exports.getBooks = async (req, res) => {
    try {
        const client = await MongoDB.connect(process.env.MONGODB_URI);
        const db = MongoDB.getDatabase(); 
        const books = await db.collection("books").find().toArray();
        res.json(books);
    } catch (error) {
        console.error("🚨 Error get book:", error);
        res.status(500).json({ message: "Failed to fetch books", error });
    }
};

// Lấy thông tin sách theo ID
exports.getBookById = async (req, res) => {
    try {
        const { id } = req.params;
        const db = MongoDB.getDatabase(); 

        // Kiểm tra nếu ID không đúng định dạng
        if (!/^book_\d+$/.test(id)) {
            return res.status(400).json({ message: "Invalid book ID format" });
        }

        const book = await db.collection("books").findOne({ _id: id });

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.json(book);
    } catch (error) {
        console.error("🚨 Error fetching book:", error);
        res.status(500).json({ message: "Failed to fetch book", error: error.message });
    }
};


// Lấy thông tin sách theo tên
exports.getBookByName = async (req, res) => {
    try {
        const { bookname } = req.params; // Lấy từ khóa tìm kiếm từ request
        const client = await MongoDB.connect(process.env.MONGODB_URI);
        const db = MongoDB.getDatabase(); 

        // Sử dụng biểu thức chính quy để tìm kiếm tên sách có chứa từ khóa (không phân biệt hoa thường)
        const books = await db.collection("books").find({ bookname: { $regex: bookname, $options: "i" } }).toArray();

        if (books.length === 0) {
            return res.status(404).json({ message: "No books found" });
        }

        res.json(books);
    } catch (error) {
        console.error("🚨 Error fetching books:", error);
        res.status(500).json({ message: "Failed to fetch books", error: error.message });
    }
};

// Cập nhật sách
exports.updateBook = async (req, res) => {
    try {
        const { id } = req.params;
        const updateFields = req.body;
        const db = MongoDB.getDatabase();

        // Kiểm tra định dạng ID
        if (!/^book_\d+$/.test(id)) {
            return res.status(400).json({ message: "Invalid book ID format" });
        }

        // Loại bỏ các giá trị undefined/null khỏi updateFields
        Object.keys(updateFields).forEach((key) => {
            if (updateFields[key] === undefined || updateFields[key] === null) {
                delete updateFields[key];
            }
        });

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ message: "No valid fields to update" });
        }

        const updatedBook = await db.collection("books").updateOne(
            { _id: id },
            { $set: updateFields }
        );

        if (!updatedBook.matchedCount) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.json({ message: "Book updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to update book", error });
    }
};


// Xóa sách
exports.deleteBook = async (req, res) => {
    try {
        const { id } = req.params;
        const db = MongoDB.getDatabase(); 

        // Kiểm tra định dạng ID
        if (!/^book_\d+$/.test(id)) {
            return res.status(400).json({ message: "Invalid book ID format" });
        }

        const result = await db.collection("books").deleteOne({ _id: id });

        if (!result.deletedCount) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.json({ message: "Book deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete book", error });
    }
};

