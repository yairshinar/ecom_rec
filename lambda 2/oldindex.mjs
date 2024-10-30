import { MongoClient } from 'mongodb';

import pkg from 'pg';
const { Pool } = pkg;
import { SVD } from 'ml-matrix';
import cosineSimilarity from 'compute-cosine-similarity'; // Importing the cosine similarity library

// MongoDB and PostgreSQL setup
const mongoUri = `mongodb+srv://${username}:${encodeURIComponent(password)}@cluster0.djrmv.mongodb.net/activityDB?retryWrites=true&w=majority`;
const pgConfig = {
    host: process.env.PG_HOST,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DB,
    port: process.env.PG_PORT || 5432,
};

export const handler = async (event) => {
    let mongoClient;
    let pgPool;
    try {
        // MongoDB client for fetching user activities
        mongoClient = new MongoClient(mongoUri);
        await mongoClient.connect();
        const database = mongoClient.db("activityDB");
        const activityLogsCollection = database.collection('activity_logs');

        const { userId, productId } = JSON.parse(event.body);

        // Fetch user activities from MongoDB
        const userActivities = await activityLogsCollection.find({ user_id: userId }).toArray();
        await mongoClient.close();

        // Fetch additional data from PostgreSQL for collaborative filtering and content-based scoring
        pgPool = new Pool(pgConfig);
        const result = await pgPool.query('SELECT * FROM Products');
        const products = result.rows;

        // Collaborative filtering with SVD
        const productViews = products.map((product) => ({
            productId: product.product_id,
            views: userActivities.filter(activity => activity.product_id === product.product_id).length,
        }));
        const viewMatrix = productViews.map((view) => [view.views]); // Matrix for SVD

        // Apply SVD for collaborative filtering
        const { u, v } = new SVD(viewMatrix);
        const userVector = u.slice(0, 1); // Fetch user’s feature vector
        const productScores = v.multiply(userVector).to1DArray(); // Score by collaborative filtering

        // Content-based filtering using Cosine Similarity on category and description
        const categoryScores = products.map((product) => {
            const userActivityVector = userActivities.map(act => act.product_id);
            const productVector = [product.category, product.description]; // Use relevant attributes as the feature vector

            // Calculate cosine similarity
            const similarity = cosineSimilarity(userActivityVector, productVector);
            return { productId: product.product_id, score: similarity };
        });

        // Combine collaborative and content-based scores
        const finalScores = products.map((product, index) => {
            const collaborativeScore = productScores[index] || 0;
            const contentScore = categoryScores.find(item => item.productId === product.product_id)?.score || 0;

            const score = (collaborativeScore * 0.7) + (contentScore * 0.3); // Adjust weights as needed

            return {
                ...product,
                score,
                collaborativeContribution: collaborativeScore * 0.7,
                contentContribution: contentScore * 0.3,
            };
        });

        // Sort products by score and return the top recommendations
        const recommendedProducts = finalScores
            .sort((a, b) => b.score - a.score)
            .slice(0, 5)
            .map(product => ({ id: product.product_id, score: product.score, collaborativeContribution: product.collaborativeContribution, contentContribution: product.contentContribution }));

        return {
            statusCode: 200,
            body: JSON.stringify({ recommendedProducts }),
        };
    } catch (error) {
        console.error('Error generating recommendations:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error generating recommendations' }),
        };
    } finally {
        if (mongoClient) await mongoClient.close();
        if (pgPool) await pgPool.end();
    }
};
