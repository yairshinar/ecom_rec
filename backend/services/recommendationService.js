const axios = require('axios');

const getRecommendations = async (userId) => {
    try {
        const response = await axios.post(process.env.API_GATEWAY_URL+"/get_recommendations", {
            userId,
        });
        
        return response ;
    } catch (error) {
        console.error("Error fetching recommendations from lambda:", error,userId);
        throw new Error('Could not fetch recommendations from lambda');
    }
};

module.exports = { getRecommendations }; 