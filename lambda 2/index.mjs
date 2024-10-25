import { MongoClient } from 'mongodb';
import { Pool } from 'pg'; // PostgreSQL client

// Access environment variables
const username = process.env.MONGODB_USER;
const password = process.env.MONGODB_PASSWORD;

const mongoUri = `mongodb+srv://${username}:${encodeURIComponent(password)}@cluster0.djrmv.mongodb.net/activityDB?retryWrites=true&w=majority`;

// PostgreSQL connection setup
const pgConfig = {
    host: process.env.PG_HOST,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DB,
    port: process.env.PG_PORT || 5432, // Default PostgreSQL port
};

export const handler = async (event) => {
    let mongoClient;
    let pgPool;
    try {
        // Connect to MongoDB to fetch user activities
        mongoClient = new MongoClient(mongoUri);
        await mongoClient.connect();
        const database = mongoClient.db("activityDB");
        const activityLogsCollection = database.collection('activity_logs');

        // Fetch user ID and product ID from the event body
        const { userId, productId } = JSON.parse(event.body); // Adjusted to receive userId and productId from the request

        // Fetch all actions performed by the user
        const userActivities = await activityLogsCollection.find({ user_id: userId }).toArray();
        await mongoClient.close();

        if (userActivities.length === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'No activity found for this user.' }),
            };
        }

        // Count the number of views for each product the user interacted with
        const productViewsCount = userActivities.reduce((acc, activity) => {
            if (activity.action === 'viewed') {
                acc[activity.product_id] = (acc[activity.product_id] || 0) + 1;
            }
            return acc;
        }, {});

        // Sort products by views count
        const sortedProductIds = Object.keys(productViewsCount)
            .sort((a, b) => productViewsCount[b] - productViewsCount[a])
            .slice(0, 5);

        // Connect to PostgreSQL to fetch product details
        pgPool = new Pool(pgConfig);
        const result = await pgPool.query('SELECT * FROM Products WHERE id = ANY($1)', [sortedProductIds]);

        // Score products based on views and other attributes
        const scoredProducts = result.rows.map(product => {
            const views = productViewsCount[product.id] || 0;
            // Example scoring logic: you can adjust weights based on your needs
            const score = views + (product.averageRating * 2) + (product.createdAt < Date.now() - 31536000000 ? 1 : 0); // Older products score less
            return { ...product, score };
        });

        // If productId is provided, add it to recommendations logic
        if (productId) {
            const selectedProduct = scoredProducts.find(product => product.id === productId);
            if (selectedProduct) {
                // You could add specific logic for the provided productId here, 
                // for example, give it a higher score or include it in recommendations
                const score = (productViewsCount[productId] || 0) + (selectedProduct.averageRating * 2);
                scoredProducts.push({ ...selectedProduct, score });
            }
        }

        // Sort scored products and return top recommendations
        const recommendedProducts = scoredProducts
            .sort((a, b) => b.score - a.score)
            .slice(0, 5) // Return top 5 products
            .map(product => product.id); // Return only product IDs

        return {
            statusCode: 200,
            body: JSON.stringify({ recommendedProductIds: recommendedProducts }),
        };
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error generating recommendations' }),
        };
    } finally {
        // Cleanup connections
        if (mongoClient) await mongoClient.close();
        if (pgPool) await pgPool.end();
    }
};
