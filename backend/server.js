// backend/server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 
require('dotenv').config(); 
 
const userService = require('./services/userService');
const productService = require('./services/productService');
const recommendationService = require('./services/recommendationService');
 

const connectMongo = require('./db/mongo');
 
const app = express(); 
 
app.use(cors()); // Allow CORS for all routes
app.use(express.json()); // For parsing JSON request bodies

connectMongo();
app.get('/api/products', async (req, res) => {
  try {  
      const products = await productService.fetchProducts();
      res.json(products);
  } catch (err) {
      console.error('Error fetching products:', err);  // Log the error details
      res.status(500).json({ error: 'Failed to fetch products', details: err.message });
  }
});

app.post('/api/products/details', async (req, res) => {
  try {
      const  productIds   = req.body.productIds; // Expecting productIds to be an array
       
      const productDetails = await productService.fetchProductDetails(productIds);
       
      res.json(productDetails);
  } catch (err) {
      console.error('Error fetching product details:', err);
      res.status(500).json({ error: 'Failed to fetch product details', details: err.message });
  }
});

app.get('/api/recommendations/:userId', async (req, res) => {
  try {
      const   userId   = req.params.userId;
      const recommendations = await recommendationService.getRecommendations(userId);
      res.json(recommendations);
  } catch (err) {
      console.error('Error fetching recommendations:', err);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/api/user/action', async (req, res) => {
  try {
      const { operation,userId, productId, action } = req.body;
      await userService.logUserAction(operation,userId, productId, action);
      res.status(200).send('Action logged');
  } catch (err) {
      console.error('Error logging user action:', err);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/api/user/delete', async (req, res) => {
  try {
      const  {operation,userId}  = req.body;
      await userService.clearUserData(operation,userId);

      res.status(200).send('User Data Deleted ');

  } catch (err) {
      console.error('Error Deleting User Data :', err);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

