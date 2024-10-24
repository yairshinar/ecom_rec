const axios = require('axios');

const getRecommendations = async (userId) => {
    try {
        console.log('userd',userId);
        const response = await axios.post(process.env.API_GATEWAY_URL+"/get_recommendations", {
            userId,
        });
         

        return response.data;
    } catch (error) {
        console.error("Error fetching recommendations:", error,userId);
        throw new Error('Could not fetch recommendations');
    }
};

module.exports = { getRecommendations }; 