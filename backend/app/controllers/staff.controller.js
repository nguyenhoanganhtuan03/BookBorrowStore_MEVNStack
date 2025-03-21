const MongoDB = require("../utils/mongodb.util");

// 📌 Tìm nhân viên theo ID
exports.getStaffById = async (req, res) => {
    try {
        const { id } = req.params;
        const db = MongoDB.getDatabase();

        if (!/^staff_\d+$/.test(id)) {
            return res.status(400).json({ message: "Invalid staff ID format" });
        }

        const staff = await db.collection("staffs").findOne({ _id: id });

        if (!staff) {
            return res.status(404).json({ message: "Staff not found" });
        }

        res.json(staff);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch staff", error });
    }
};

// 📌 Tìm nhân viên theo tên
exports.getStaffByName = async (req, res) => {
    try {
        const { fullname } = req.query;
        const db = MongoDB.getDatabase();

        const staffs = await db.collection("staffs").find({ fullname: { $regex: fullname, $options: "i" } }).toArray();

        if (!staffs.length) {
            return res.status(404).json({ message: "No staff found" });
        }

        res.json(staffs);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch staff", error });
    }
};

// 📌 Hiển thị tất cả nhân viên
exports.getAllStaffs = async (req, res) => {
    try {
        const db = MongoDB.getDatabase();
        const staffs = await db.collection("staffs").find({}).toArray();
        res.json(staffs);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch staffs", error });
    }
};

// 📌 Cập nhật thông tin nhân viên
exports.updateStaff = async (req, res) => {
    try {
        const { id } = req.params;
        const { fullname, phone, address, position } = req.body;
        const db = MongoDB.getDatabase();

        if (!/^staff_\d+$/.test(id)) {
            return res.status(400).json({ message: "Invalid staff ID format" });
        }

        const updatedStaff = await db.collection("staffs").updateOne(
            { _id: id },
            { $set: { fullname, phone, address, position } }
        );

        if (!updatedStaff.matchedCount) {
            return res.status(404).json({ message: "Staff not found" });
        }

        res.json({ message: "Staff updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to update staff", error });
    }
};