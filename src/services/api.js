import axios from 'axios';

const API_URL = process.env.REACT_APP_API_ENDPOINT;
 

export const fetchProducts = async () => {
    const response = await axios.get(`${API_URL}/products`);
    return response.data;
};

export const fetchRecommendations = async (userId) => {
    try {
        
        const response = await axios.get(`${API_URL}/recommendations/${userId}`);
        return response; 
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        return [];
    }
};

// Fetch product details by product IDs from backend
export const fetchProductDetails = async (productIds) => {
    try {
      
        const response = await axios.post(`${API_URL}/products/details`, {
               productIds   , // Send list of product IDs
        });
        const data = await response;
        console.log('dataresponse',data)

        return data; // Assuming backend returns product name, description, price, etc.
    } catch (error) {
        console.error('Error fetching product details:', error);
        return [];
    }
};

export const logUserAction = async (userId, productId, action) => {
    try { 
        await axios.post(`${API_URL}/user/action`, {
            operation: 'log', // Specify the operation
            userId,
            productId,
            action
        });
        console.log('User action logged successfully');
    } catch (error) {
        console.error('Error logging user action in Lambda:', error);
        throw new Error('Error logging user action');
    }
};

// Function to clear all user logs
export const clearUserLogs = async (userId) => {
    try {
        console.log(userId);
        await axios.post(`${API_URL}/user/delete`, {
            operation: 'clear'  , userId
        });
        alert('All user data has been deleted');

        console.log('User logs cleared successfully');
    } catch (error) {
        console.error('Error clearing user logs in Lambda:', error);
        throw new Error('Error clearing user logs');
    }
};