const axios = require('axios');

const API_BASE_URL = process.env.API_GATEWAY_URL 
 


// Function to call the Lambda function that retrieves the user profile
const getUserProfile = async (userId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/user/${userId}`);
        return response.data;  // The user profile data from Lambda
    } catch (error) {
        console.error('Error fetching user profile from Lambda:', error);
        throw new Error('Error retrieving user profile');
    }
};

// Function to call the Lambda function that logs user actions
const logUserAction = async (operation,userId, productId, action) => {
    try {
        await axios.post(`${API_BASE_URL}/ActivityLogProcessor`, {
            operation: operation, 
            user_id : userId ,
            product_id:productId ,
            action,
        });
        console.log('User action logged successfully');
    } catch (error) {
        console.error('Error logging user action in Lambda:', error);
        throw new Error('Error logging user action');
    }
};

// Function to clear user data using the Lambda function
const clearUserData = async (operation,userId) => {
     
    try {
         
        await axios.post(`${API_BASE_URL}/ActivityLogProcessor`, {
            operation: operation, // Specify operation as 'clear'
            user_id: userId,
        });
        console.log('User data cleared successfully');
    } catch (error) {
        console.error('Error clearing user data in Lambda:', error);
        throw new Error('Error clearing user data');
    }
};
  
 


module.exports = { getUserProfile, logUserAction,clearUserData };
