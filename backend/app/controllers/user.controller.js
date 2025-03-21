const MongoDB = require('../utils/mongodb.util');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ObjectId = require('mongodb').ObjectId;


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
        let userCount = await db.collection("users").countDocuments();
        let userId;
        
        while (true) {
            userId = `user_${userCount}`;
            const existingUser = await db.collection("users").findOne({ _id: userId });
            if (!existingUser) break;
            userCount++;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await db.collection("users").insertOne({ 
            _id: userId,
            username, 
            password: hashedPassword, 
            fullname, 
            phone, 
            email, 
            address, 
            gender, 
            dob
        });

        console.log("✅ Kết quả insert:", result);
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("🚨 Lỗi khi đăng ký:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
// Đăng nhập
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Kết nối với MongoDB
        const db = MongoDB.getDatabase();
        if (!db) {
            return res.status(500).json({ message: "Database connection error" });
        }

        // Tìm user theo username
        const user = await db.collection("users").findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Đăng nhập thành công, không cần tạo token
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

        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }

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