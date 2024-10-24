const pool = require('../db/postgres');

const getProducts = async () => {
    try {
        const result = await pool.query('SELECT * FROM "Products"');  // Fetch products from PostgreSQL
        return result.rows;  // Return the rows containing product data
    } catch (err) {
        console.error('Error executing query', err.stack);  // Log the error for debugging
        throw new Error('Database query error');  // Throw an error, don't handle the response here
    }
}; 
 
   

const getProductDetails = async (productIds) => {
     console.log(productIds)
    try {
        const queryText = 'SELECT id, name, description, price FROM "Products" WHERE id = ANY($1)';
        const result = await pool.query(queryText, [productIds]);
        return result.rows; // Return product details
    } catch (error) {
        console.error('Error fetching product details from RDS:', error);
         throw new Error(   'Error fetching product details',error );
    }
}; 
module.exports = { getProducts,getProductDetails };
// models/productModel.js 