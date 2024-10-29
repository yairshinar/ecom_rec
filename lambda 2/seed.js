require('dotenv').config({ path: '../.env' }); // Adjust the path accordingly
const { MongoClient } = require('mongodb');
const { faker } = require('@faker-js/faker'); // Ensure to install @faker-js/faker

// Access environment variables
const username = process.env.MONGODB_USER;
const password = process.env.MONGODB_PASSWORD;
const mongoUri = `mongodb+srv://${username}:${encodeURIComponent(password)}@cluster0.djrmv.mongodb.net/activityDB?retryWrites=true&w=majority`;
const numberOfUsersToCreate = 100; // Change this value for more or fewer users

const seedDatabase = async () => {
    const client = new MongoClient(mongoUri);
    try {
        await client.connect();
        const database = client.db('activityDB');
        const activityLogsCollection = database.collection('activity_logs');

        const activities = [];
        for (let i = 0; i < numberOfUsersToCreate; i++) {
            const userId = faker.string.uuid();
            ; // Generate a random user ID
            const productId = faker.number.int({ min: 1, max: 10 }); // Random product ID between 1 and 10
            const action = faker.helpers.arrayElement(['viewed', 'liked', 'purchased']); // Random action

            activities.push({
                user_id: userId,
                product_id: productId,
                action: action,
                timestamp: new Date(),
            });
        }

        // Insert the generated activities into MongoDB
        const result = await activityLogsCollection.insertMany(activities);
        console.log(`${result.insertedCount} user activities inserted successfully.`);
    } catch (error) {
        console.error('Error inserting user activities:', error);
    } finally {
        await client.close();
    }
};

seedDatabase();
