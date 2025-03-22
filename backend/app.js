const express = require('express');
const dotenv = require('dotenv');
const userRoutes = require('./app/routes/user.route');
const borrowRoutes = require('./app/routes/borrow.route');
const bookRoutes = require("./app/routes/book.route");
const publisherRoutes = require("./app/routes/publisher.route");
const adminRoutes = require("./app/routes/admin.route");
const staffRoutes = require("./app/routes/staff.route");

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/borrows', borrowRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/publishers", publisherRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/staffs", staffRoutes);

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