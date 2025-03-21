const { MongoClient } = require("mongodb");

class MongoDB {
    static client = null;

    static async connect(uri) {
        if (!this.client) {
            this.client = new MongoClient(uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            await this.client.connect(); // Kết nối MongoDB
            console.log("✅ MongoDB Connected!");
        }
        return this.client;
    }

    static getDatabase() {
        if (!this.client) {
            throw new Error("❌ MongoDB chưa kết nối!");
        }
        return this.client.db(); // Trả về database
    }
}

module.exports = MongoDB;
