const MongoDB = require("../utils/mongodb.util");
const Publisher = require("../models/publisher.model");

// Thêm NXB
exports.addPublisher = async (req, res) => {
    try {
        const { publisherName, address } = req.body;
        if (!publisherName || !address) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const db = MongoDB.getDatabase();

        // Tạo ID mới
        const lastPublisher = await db.collection("publishers")
            .find({})
            .sort({ _id: -1 })
            .limit(1)
            .toArray();

        let nextId = 0;
        if (lastPublisher.length > 0) {
            nextId = parseInt(lastPublisher[0]._id.split("_")[1]) + 1;
        }
        const PublisherId = `pub_${nextId}`;

        const newPublisher = new Publisher(publisherName, address);
        await db.collection("publishers").insertOne({_id: PublisherId, ...newPublisher});

        res.status(201).json({ message: "Publisher added successfully", publisher: newPublisher });
    } catch (error) {
        res.status(500).json({ message: "Failed to add publisher", error });
    }
};

// Cập nhật NXB
exports.updatePublisher = async (req, res) => {
    try {
        const { id } = req.params;
        const updateFields = req.body;
        const db = MongoDB.getDatabase();

        if (!/^pub_\d+$/.test(id)) {
            return res.status(400).json({ message: "Invalid publisher ID format" });
        }

        Object.keys(updateFields).forEach((key) => {
            if (updateFields[key] === undefined || updateFields[key] === null) {
                delete updateFields[key];
            }
        });

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ message: "No valid fields to update" });
        }

        const updatedPublisher = await db.collection("publishers").updateOne(
            { _id: id },
            { $set: updateFields }
        );

        if (!updatedPublisher.matchedCount) {
            return res.status(404).json({ message: "Publisher not found" });
        }

        res.json({ message: "Publisher updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to update publisher", error });
    }
};

// Xóa NXB
exports.deletePublisher = async (req, res) => {
    try {
        const { id } = req.params;
        const db = MongoDB.getDatabase();

        if (!/^pub_\d+$/.test(id)) {
            return res.status(400).json({ message: "Invalid publisher ID format" });
        }

        const result = await db.collection("publishers").deleteOne({ _id: id });

        if (!result.deletedCount) {
            return res.status(404).json({ message: "Publisher not found" });
        }

        res.json({ message: "Publisher deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete publisher", error });
    }
};

// Tìm kiếm NXB theo ID
exports.getPublisherById = async (req, res) => {
    try {
        const { id } = req.params;
        const db = MongoDB.getDatabase();

        if (!/^pub_\d+$/.test(id)) {
            return res.status(400).json({ message: "Invalid publisher ID format" });
        }

        const publisher = await db.collection("publishers").findOne({ _id: id });

        if (!publisher) {
            return res.status(404).json({ message: "Publisher not found" });
        }

        res.json(publisher);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch publisher", error });
    }
};

// Tìm kiếm theo tên NXB
exports.getPublisherByName = async (req, res) => {
    try {
        const { name } = req.params;
        const db = MongoDB.getDatabase();

        const publishers = await db.collection("publishers").find({ publisherName: { $regex: name, $options: "i" } }).toArray();

        if (publishers.length === 0) {
            return res.status(404).json({ message: "No publishers found" });
        }

        res.json(publishers);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch publishers", error });
    }
};

// Hiển thị tất cả NXB
exports.getAllPublishers = async (req, res) => {
    try {
        const db = MongoDB.getDatabase();
        const publishers = await db.collection("publishers").find({}).toArray();
        res.json(publishers);
    } catch (error) {
        console.error("🚨 Error fetching publishers:", error);
        res.status(500).json({ message: "Failed to fetch publishers" });
    }
};
