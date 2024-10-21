// backend/server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express(); 
 
app.use(cors()); // Allow CORS for all routes
app.use(express.json()); // For parsing JSON request bodies


const port = process.env.PORT || 5000;
  

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: false, // Add this line to disable SSL certificate verification
    },
});




// API endpoint for products
app.get('/api/products', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM "Products"');
        res.json(result.rows);
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.status(500).json({ error: 'Database query error' });
    }
}); 
// Endpoint for fetching a product by ID
app.get('/api/product/:id', async (req, res) => {
  const productId = req.params.id;

  try {
    const product = await pool.query('SELECT * FROM "Products" WHERE "id" = $1', [productId]);

    if (product.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product.rows[0]);
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint for fetching product recommendations
app.get('/api/recommendations', async (req, res) => {
  try {
    // Logic for fetching recommendations, e.g., similar products in the same category
    const recommendations = await pool.query('SELECT * FROM "Products" ORDER BY RANDOM() LIMIT 5'); // Just an example query
    
    res.json(recommendations.rows);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});




async function listTables() {
    try {
        const result = await pool.query('SELECT * FROM "Products" WHERE "id" = 1');
        console.log('Tables in the database:', result.rows);
    } catch (err) {
        console.error('Error executing query', err.stack);
    } 
}

listTables();
