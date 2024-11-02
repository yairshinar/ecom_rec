import { MongoClient } from 'mongodb';
import pkg from 'pg';
const { Pool } = pkg;
import numeric from 'numeric';
import natural from 'natural';

// Access environment variables
const username = process.env.MONGODB_USER;
const password = process.env.MONGODB_PASSWORD;

// MongoDB and PostgreSQL setup
const mongoUri = `mongodb+srv://${username}:${encodeURIComponent(password)}@cluster0.djrmv.mongodb.net/activityDB?retryWrites=true&w=majority`;
const pgConfig = {
    host: process.env.PG_HOST,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DB,
    port: process.env.PG_PORT || 5432,
};

// Stop words list for filtering
const stopWords = new Set(["and", "for", "with"
    // (same stop words as before)
]);

const getRecommendations = async (normalizedProductScores, products, productInteractions,recencyScores) => {

    const tfidf = new natural.TfIdf();

    products.forEach(product => tfidf.addDocument(product.description));
    const collectSimilarWords = (product) => {
        const words = product.description.split(' ').map(word => word.toLowerCase());
        const uniqueWords = [...new Set(words)];

        const filteredWords = uniqueWords
            .filter(word => !stopWords.has(word)) // Keep 'sound' even if it's a stop word
            .map(word => natural.PorterStemmer.stem(word)); // Stemming the words

        const similarProducts = products
            .filter(compProduct => compProduct.product_id !== product.product_id)
            .map(compProduct => {
                const compWords = new Set(compProduct.description.split(' ').map(word => word.toLowerCase()));
                const matchedWords = filteredWords.filter(stemmedWord => compWords.has(stemmedWord));

                const allMatchedWords = [...new Set([...matchedWords])]; // Combine matches

                // Add 'sound' to allMatchedWords if it was matched

                console.log(`Product: ${product.product_id}, Matched Words: ${allMatchedWords}`);
                return allMatchedWords.length > 0 ? { product: compProduct, matchedWords: allMatchedWords } : null;
            })
            .filter(Boolean)
            .sort((a, b) => b.matchedWords.length - a.matchedWords.length)
            .slice(0, 10);

        return similarProducts;
    };


    const finalScores = products.map((product, index) => {
        const collaborativeScore = normalizedProductScores[index] || 0;
        const similarProducts = collectSimilarWords(product);

        // Calculate content contribution based on similar words
        const matchedWordsCount = similarProducts.reduce((sum, sp) => sum + sp.matchedWords.length, 0); // Total matched words across similar products
        const uniqueWordsCount = new Set(product.description.split(' ')).size; // Unique words in product description

        const contentContribution = uniqueWordsCount > 0
            ? (matchedWordsCount / uniqueWordsCount) * 100
            : 0;

        // Weighted score based on interactions, favoring more recent activity
        const interactionWeight = productInteractions[index]?.totalInteractions || 0;
        const uniqueUsers = productInteractions[index]?.uniqueUsers || 0;

        // Adjust collaborative score based on interaction frequency
        // This is where we apply a decay factor or adjustment based on interaction frequency
        const adjustedCollaborativeScore = collaborativeScore * Math.log(interactionWeight + 1) * Math.log(uniqueUsers + 1);



        return {
            ...product,
            score: 0,
            collaborativeContribution: adjustedCollaborativeScore,
            contentContribution: contentContribution,
            uniqueUsers: uniqueUsers,
            interactions: interactionWeight,
            similarWords: [...new Set(similarProducts.flatMap(sp => sp.matchedWords))],
            productRecencyScores: recencyScores[index]
        };
    });

    // Calculate min and max for collaborative and content scores
    const minCollab = Math.min(...finalScores.map(p => p.collaborativeContribution));
    const maxCollab = Math.max(...finalScores.map(p => p.collaborativeContribution));

    const minContent = Math.min(...finalScores.map(p => p.contentContribution));
    const maxContent = Math.max(...finalScores.map(p => p.contentContribution));
    const collabRange = maxCollab - minCollab || 1;
    const contentRange = maxContent - minContent || 1;


    // Apply min-max scaling to adjust each to a range of 0-100
    finalScores.forEach(product => {
        product.collaborativeContribution = ((product.collaborativeContribution - minCollab) / collabRange) * 100;
        product.contentContribution = ((product.contentContribution - minContent) / contentRange) * 100;
        product.score = (product.collaborativeContribution * 0.7) + (product.contentContribution * 0.3);


    });

    return finalScores
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
        .map(product => ({
            id: product.product_id,
            score: product.score,
            collaborativeContribution: product.collaborativeContribution,
            contentContribution: product.contentContribution,
            uniqueUsers: product.uniqueUsers,
            interactions: product.interactions,
            name: product.name,
            price: product.price,
            description: product.description,
            category: product.category,
            createdAt: product.createdAt,
            similarWords: product.similarWords,
            matchedWordsCount: product.similarWords.length,
            uniqueWordsCount: new Set(product.description.split(' ')).size,
            productRecencyScores: product.productRecencyScores
        }));
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

        const { userId } = JSON.parse(event.body);

        // Fetch all user activities from MongoDB
        const allUserActivities = await activityLogsCollection.find({}).toArray();

        // Fetch product data from PostgreSQL
        pgPool = new Pool(pgConfig);
        const result = await pgPool.query('SELECT * FROM "Products"');
        const products = result.rows;

        console.log(`Number of products: ${products.length}`);

        if (products.length === 0) {
            return {
                statusCode: 200,
                body: JSON.stringify({ recommendedProducts: [] }), // No recommendations
            };
        }

        // Get the current date to calculate recency scores
         
        // Sort activities by timestamp (if not already sorted)
        allUserActivities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        // Total interactions
        const totalInteractions = allUserActivities.length;

        // Set scores based on order of interactions
        allUserActivities.forEach((activity, index) => {
            // Higher scores for more recent interactions
            activity.recencyScore = 1.0 - (index / totalInteractions); // Normalize score based on position
        });
        
       
  
            const productRecencyScores = products.map(product => {
            // Filter activities for the current product
            const productActivities = allUserActivities.filter(activity => activity.product_id === product.product_id);
            
            // Extract the recency scores
            const scores = productActivities.map(activity => activity.recencyScore).slice(0, 5); // Limit to max of 5 recency scores
        
            // Return scores or a default value
            return scores.length > 0 ? scores : [0];
        });
        const interactionMatrix = products.map(product => {
            const interactions = allUserActivities.filter(activity => activity.product_id === product.product_id);
            const uniqueUsers = new Set(interactions.map(interaction => interaction.user_id)).size;

            // Create a view score per user
            const viewScores = allUserActivities
                .filter(activity => activity.product_id === product.product_id)
                .reduce((acc, activity) => {
                    acc[activity.user_id] = acc[activity.user_id] || 0;
                    acc[activity.user_id] += activity.recencyScore; // Boost recent interactions
                    return acc;
                }, {});

            const totalInteractions = interactions.length; // Count total interactions for the product

            return {
                productId: product.product_id,
                viewScores,
                uniqueUsers,
                totalInteractions, // Store total interactions
            };
        });

        const userSet = new Set(allUserActivities.map(activity => activity.user_id));
        const uniqueUsersCount = userSet.size;

        const interactionMatrixArray = Array.from(userSet).map(user => {
            const userInteractions = allUserActivities.filter(activity => activity.user_id === user);
            const scores = products.map(product => {
                const productInteraction = userInteractions.find(activity => activity.product_id === product.product_id);
                return productInteraction ? (productInteraction.isRecent ? 1.5 : 1) : 0; // Boost for recent views
            });
            return scores;
        });

        // Perform SVD
        let productScores = [];
        try {
            const svd = numeric.svd(interactionMatrixArray);
            const userIndex = Array.from(userSet).indexOf(userId);
            const userVector = svd.U[userIndex] || Array(svd.V[0].length).fill(0);

            productScores = numeric.dot(svd.V, userVector);
        } catch (error) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: "Failed to generate recommendations due to SVD issue." }),
            };
        }

        // Normalizing collaborative scores and factoring in unique user counts
        const maxScore = Math.max(...productScores);
        const normalizedProductScores = productScores.map((score, index) => {
            const normalizedScore = (score / maxScore) || 0;

            // Factor in unique users by creating a multiplier based on unique user count
            const uniqueUserMultiplier = Math.log(interactionMatrix[index].uniqueUsers + 1) + 1; // Log scaling for diminishing returns
            return normalizedScore * uniqueUserMultiplier; // Apply unique user weight
        });

        const recommendedProducts = await getRecommendations(normalizedProductScores, products, interactionMatrix,productRecencyScores);

        return {
            statusCode: 200,
            body: JSON.stringify(recommendedProducts),
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
