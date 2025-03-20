const MongoDB = require('../utils/mongodb.util');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { username, password } = req.body;
    const db = MongoDB;
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.collection('users').insertOne({ username, password: hashedPassword });
    res.status(201).json({ message: 'User registered successfully' });
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    const db = getDB();
    const user = await db.collection('users').findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
};