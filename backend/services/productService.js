const { getProducts , getProductDetails} = require('../models/productModel');

const fetchProducts = async () => {
    const products = await getProducts();
    return products;
};



// Fetch product details by product IDs
const fetchProductDetails = async (productIds) => {
    const productDetails = await getProductDetails(productIds); // Pass productIds to get details
    return productDetails;
};

module.exports = { fetchProducts,fetchProductDetails };

