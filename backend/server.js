const dotenv = require("dotenv");
const MongoDB = require("./app/utils/mongodb.util");

dotenv.config();

async function startServer() {
    try {
        const db = await MongoDB.connect(process.env.MONGODB_URI, "BookBorrowStore");

        // Kiểm tra database đã tạo chưa bằng cách tạo collection tạm thời
        const collections = await db.listCollections().toArray();
        if (!collections.some((col) => col.name === "users")) {
            await db.createCollection("users");
            console.log("✅ Created 'users' collection");
        }

        // Tiếp tục khởi động server...
    } catch (error) {
        console.error("❌ Server startup failed:", error);
    }
}

startServer();
