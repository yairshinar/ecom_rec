export const handler = async (event) => {
    try {
        const client = await connectToDatabase();
        const db = client.db('your_database_name');
        
        // Example: Fetch documents from a collection
        const collection = db.collection('your_collection_name');
        const documents = await collection.find({}).limit(10).toArray();
        
        return {
            statusCode: 200,
            body: JSON.stringify(documents)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error connecting to database',
                error: error.message
            })
        };
    }
};
