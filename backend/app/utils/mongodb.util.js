const { MongoClient } = require("mongodb");

class MongoDB {
    static client;

    static async connect(uri, dbName) {
        if (this.client) return this.client.db(dbName);

        try {
            this.client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
            console.log("✅ Connected to MongoDB");

            const db = this.client.db(dbName);
            console.log(`✅ Using database: ${dbName}`);

            return db;
        } catch (error) {
            console.error("❌ Failed to connect to MongoDB:", error);
            process.exit(1);
        }
    }
}

module.exports = MongoDB;