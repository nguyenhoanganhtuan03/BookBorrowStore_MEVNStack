const MongoDB = require("../utils/mongodb.util");

const adminRole = process.env.ADMIN_ROLE
const userRole = process.env.USER_ROLE

// Thêm NV
exports.addStaff = async (req, res) => {
    try {
        const { username, password, fullname, position, phone, address } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        
        const db = MongoDB.getDatabase();

        const lastStaff = await db.collection("staffs").find().sort({ _id: -1 }).limit(1).toArray();
        let nextId = 0;
        if (lastStaff.length > 0) {
            nextId = parseInt(lastStaff[0]._id.split("_")[1]) + 1;
        }
        const StaffId = `staff_${nextId}`;
        
        const newStaff = { _id: StaffId, 
                        username, 
                        password, 
                        fullname: fullname || null, 
                        position: position,
                        phone: phone || null, 
                        address: address || null    
                    };
        
        await db.collection("staffs").insertOne(newStaff);
        res.status(201).json({ message: "Staff added successfully", staff: newStaff });
    } catch (error) {
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

        if (user.position !== process.env.ADMIN_ROLE) {
            return res.status(403).json({ message: "Access denied. Admin only." });
        }

        res.json({ message: "Admin login successful", user });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
