const { getDB } = require('../utils/mongodb.util');
exports.borrowBook = async (req, res) => {
    const { userId, bookTitle } = req.body;
    const db = getDB();
    const borrowDate = new Date();
    await db.collection('borrows').insertOne({ userId, bookTitle, borrowDate });
    res.json({ message: 'Book borrowed successfully' });
};

exports.getUserBorrows = async (req, res) => {
    const { userId } = req.params;
    const db = getDB();
    const borrows = await db.collection('borrows').find({ userId }).toArray();
    res.json(borrows);
};
