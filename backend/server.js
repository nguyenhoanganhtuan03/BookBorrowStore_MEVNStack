const dotenv = require("dotenv");
const MongoDB = require("./app/utils/mongodb.util");
const app = require("./app");

dotenv.config();

console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('PORT:', process.env.PORT);

async function startServer() {
    try {
        const client = await MongoDB.connect(process.env.MONGODB_URI);
        const db = client.db(); // Lấy database từ client

        console.log("✅ Connected to MongoDB");

        // Chạy server
        const app = require("./app");
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    } catch (error) {
        console.error("❌ Server startup failed:", error);
    }
}

startServer();

