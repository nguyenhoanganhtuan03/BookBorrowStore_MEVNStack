const express = require('express');
const dotenv = require('dotenv');
const userRoutes = require('./app/routes/user.route');
const borrowRoutes = require('./app/routes/borrow.route');

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/borrow', borrowRoutes);

app.get("/", (req, res) => {
    res.json({ message: "Welcome to Book Borrow Store."});
});

app.use((req, res, next) => {
    return next(new ApiError(404, "Resource not found"));
});

app.use((err, req, res, next) => {
    return res.status(err.statusCode || 500).json({
        message: err.message || "Internal Server Error",
    });
});

module.exports = app;