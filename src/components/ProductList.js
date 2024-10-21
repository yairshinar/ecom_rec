import React, { useState, useEffect } from 'react';
import axios from 'axios';


const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

 
function ProductList() {
    
const [products, setProducts] = useState([]);
const [error, setError] = useState(null); 
        
  useEffect(() => { // Define error state
    console.log('ProductList Component Rendered'); 
        const fetchProducts = async () => {
            try {
                console.log(`Fetching products from ${API_ENDPOINT}/products`); // Log the endpoint being called
                const response = await axios.get(`${API_ENDPOINT}/products`);
                console.log('Response data:', response.data); // Log the response data
                setProducts(response.data);
            } catch (err) {
                console.error('Error fetching products:', err); // Log the error if it occurs
                setError(err);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div>
            <h1>Products</h1>
            <ul>
                {products.map(product => (
                    <li key={product.id}>{product.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default ProductList;
   