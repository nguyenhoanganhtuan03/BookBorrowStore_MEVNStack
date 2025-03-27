const MongoDB = require('../utils/mongodb.util');
const User = require("../models/user.model");


// Đăng ký
exports.register = async (req, res) => {
    try {
        console.log("📥 Dữ liệu nhận được:", req.body);

        const { username, password, fullname, phone, email, address, gender, dob } = req.body;
        if (!username || !password) {
            console.log("🚨 Thiếu username hoặc password!");
            return res.status(400).json({ message: "Username and password are required" });
        }

        const db = MongoDB.getDatabase();

        // Kiểm tra xem username đã tồn tại chưa
        const existingUser = await db.collection("users").findOne({ username: username });
        if (existingUser) {
            console.log("🚨 Username đã tồn tại!");
            return res.status(400).json({ message: "Username already exists" });
        }

        // Lấy tất cả user _id, tìm số lớn nhất
        const allUsers = await db.collection("users").find({}, { projection: { _id: 1 } }).toArray();
        let maxId = 0;

        allUsers.forEach(user => {
            const match = user._id.match(/^user_(\d+)$/); // Tìm số trong _id
            if (match) {
                const idNum = parseInt(match[1], 10);
                if (idNum > maxId) {
                    maxId = idNum;
                }
            }
        });

        const userId = `user_${maxId + 1}`; // Tạo ID tiếp theo

        // Tạo người dùng mới
        const newUser = new User(username, password, fullname, phone, email, address, gender, dob);

        console.log("👤 Thêm người dùng:", JSON.stringify({ _id: userId, ...newUser }, null, 2));

        await db.collection("users").insertOne({ _id: userId, ...newUser });

        res.status(201).json({ message: "User registered successfully", user: { _id: userId, username } });
    } catch (error) {
        console.error("🚨 Lỗi khi đăng ký:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Đăng nhập
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const db = MongoDB.getDatabase();
        if (!db) {
            return res.status(500).json({ message: "Database connection error" });
        }

        const user = await db.collection("users").findOne({ username });
        if (!user || user.password !== password) {  // So sánh trực tiếp password
            return res.status(401).json({ message: "Invalid credentials" });
        }

        res.json({ message: "Login successful", user });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Tìm kiếm người dùng theo tên
exports.findUser = async (req, res) => {
    try {
        const { username } = req.params;
        const db = MongoDB.getDatabase();
        
        const users = await db.collection("users").find({
            username: { $regex: username, $options: 'i' }
        }).toArray();

        if (users.length === 0) {
            return res.status(404).json({ message: "No matching users found" });
        }

        res.json(users);
    } catch (error) {
        console.error("Error finding user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Cập nhật thông tin người dùng
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        let updateData = req.body;
        const db = MongoDB.getDatabase();

        // Xóa _id nếu có trong updateData để tránh lỗi immutable field
        delete updateData._id;

        const result = await db.collection("users").updateOne(
            { _id: id },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User updated successfully" });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Xóa người dùng theo ID
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const db = MongoDB.getDatabase();

        const result = await db.collection("users").deleteOne({ _id: id });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Hiển thị tất cả người dùng
exports.getAllUsers = async (req, res) => {
    try {
        const db = MongoDB.getDatabase();
        const users = await db.collection("users").find({}).toArray();
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Lấy thông tin người dùng theo ID
exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const db = MongoDB.getDatabase();

        // Tìm người dùng theo _id
        const user = await db.collection("users").findOne({ _id: id });

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found',
                data: null
            });
        }

        // Trả về dữ liệu người dùng với cấu trúc có status và message
        res.json({
            status: 'success',
            message: 'User retrieved successfully',
            data: user
        });
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error',
            data: null
        });
    }
};

