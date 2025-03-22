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
        let userId;
        
        const lastUser = await db.collection("users")
            .find({})
            .sort({ _id: -1 })
            .limit(1)
            .toArray();

        let nextId = 0;
        if (lastUser.length > 0) {
            nextId = parseInt(lastUser[0]._id.split("_")[1]) + 1;
        }
        const UserId = `user_${nextId}`;

        const newUser = new User(username, password, fullname, phone, email, address, gender, dob);
        await db.collection("users").insertOne({_id: UserId, ...newUser});

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