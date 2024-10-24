const { MongoClient } = require('mongodb');

// Replace these with your actual credentials
const username = 'yair'; // e.g., 'yair'
const password = 'Asdf!234'; // e.g., 'Ad!ssd'
const uri = `mongodb+srv://${username}:${password}@cluster0.djrmv.mongodb.net/activityDB?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const connectToMongoDB = async () => {
    try {
        console.log("Attempting to connect to MongoDB...");
        await client.connect();
        console.log("Connected to MongoDB successfully.");

        // Test a simple query
        const database = client.db("activityDB");
        const collection = database.collection("activity_logs");

        const logs = await collection.find({}).toArray();
        console.log("Activity Logs:", logs);

    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    } finally {
        await client.close();
    }
};

connectToMongoDB();
