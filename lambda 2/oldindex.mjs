import { MongoClient } from 'mongodb';

// Access environment variables
const username = process.env.MONGODB_USER;
const password = process.env.MONGODB_PASSWORD;

const uri = `mongodb+srv://${username}:${encodeURIComponent(password)}@cluster0.djrmv.mongodb.net/activityDB?retryWrites=true&w=majority`;

let client;

export const handler = async (event) => {
    try {
        // Ensure MongoDB connection string exists
        if (!uri) {
            throw new Error("MongoDB connection string is missing");
        }

        let requestBody;
        
        try {
            requestBody = JSON.parse(event.body);  // Extract the JSON from the event body
        } catch (error) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Invalid request body' }),
            };
        }

        event = requestBody;


        client = new MongoClient(uri);
        await client.connect();
 
        const database = client.db("activityDB");
        const activityLog = database.collection("activity_logs");

        if (event.operation == 'log') {
            // Validate required parameters for logging
            if (!event.user_id || !event.product_id || !event.action) {
                throw new Error('Missing parameters for logging activity');
            }

            const newLog = {
                user_id: event.user_id,
                product_id: event.product_id,
                action: event.action,
                timestamp: new Date()
            };

            await activityLog.insertOne(newLog);
            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'Activity logged successfully' }),
            };
        } else if (event.operation == 'clear') {
           

            // Clear logs for a specific user
            const result = await activityLog.deleteMany({ user_id: event.user_id });
            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'User logs cleared successfully', deletedCount: result.deletedCount }),
            };
        } else {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Invalid operation' })
            };
        }
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error processing request', error: error.message }),
        };
    } finally {
        // Close MongoDB connection
        if (client) {
            await client.close();
        }
    }
};
