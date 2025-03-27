const MongoDB = require("../utils/mongodb.util");
const Staff = require("../models/staff.model");

const adminRole = process.env.ADMIN_ROLE
const userRole = process.env.USER_ROLE

// Thêm NV
exports.addStaff = async (req, res) => {
    try {
        const { username, password, fullname, position, phone, address } = req.body;

        if (!username || !password || !position) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const db = MongoDB.getDatabase();

        // Kiểm tra username đã tồn tại chưa
        const existingStaff = await db.collection("staffs").findOne({ username: username });
        if (existingStaff) {
            return res.status(400).json({ message: "Username already exists" });
        }

        // Lấy tất cả _id, lọc và tìm số lớn nhất
        const allStaffs = await db.collection("staffs").find({}, { projection: { _id: 1 } }).toArray();
        let maxId = 0;

        allStaffs.forEach(staff => {
            const match = staff._id.match(/^staff_(\d+)$/); // Tìm số trong _id
            if (match) {
                const idNum = parseInt(match[1], 10);
                if (idNum > maxId) {
                    maxId = idNum;
                }
            }
        });

        const staffId = `staff_${maxId + 1}`; // Tạo ID tiếp theo

        // Tạo nhân viên mới
        const newStaff = new Staff(username, password, fullname, phone, address, position);
        
        console.log("👤 Thêm nhân viên mới:", JSON.stringify({ _id: staffId, ...newStaff }, null, 2));

        // Lưu vào DB
        await db.collection("staffs").insertOne({ _id: staffId, ...newStaff });

        res.status(201).json({ message: "Staff added successfully", staffId });
    } catch (error) {
        console.error("🚨 Lỗi khi thêm nhân viên:", error);
        res.status(500).json({ message: "Failed to add staff", error: error.message });
    }
};

// Xóa NV
exports.deleteStaff = async (req, res) => {
    try {
        const { id } = req.params;
        const db = MongoDB.getDatabase(); 

        // Kiểm tra định dạng ID
        if (!/^staff_\d+$/.test(id)) {
            return res.status(400).json({ message: "Invalid Staff ID format" });
        }

        const result = await db.collection("staffs").deleteOne({ _id: id });

        if (!result.deletedCount) {
            return res.status(404).json({ message: "Staff not found" });
        }

        res.json({ message: "Staff deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete Staff", error });
    }
};

// Đăng nhập tài khoản Admin
exports.adminLogin = async (req, res) => {
    try {
        const { username, password } = req.body;

        const db = MongoDB.getDatabase();
        if (!db) {
            return res.status(500).json({ message: "Database connection error" });
        }

        const user = await db.collection("staffs").findOne({ username });

        if (!user || user.password !== password) {  
            return res.status(401).json({ message: "Invalid credentials" });
        }

        if (user.position !== adminRole) {
            return res.status(403).json({ message: "Access denied. Admin only." });
        }

        res.json({ message: "Admin login successful", user });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
