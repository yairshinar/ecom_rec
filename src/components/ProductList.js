import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

 
import { fetchProducts, logUserAction } from '../services/api';

const ProductList = () => {
    const userId = localStorage.getItem('userId');

    const [products, setProducts] = useState([]);

    useEffect(() => {
        
        const userId = localStorage.getItem('userId');
             
        const getProducts = async () => {
            const data = await fetchProducts();
            setProducts(data);
        };
        getProducts();
    }, []);

    const handleProductClick = (productId) => {
        console.log(userId, productId,)
        logUserAction(userId, productId, 'viewed');
    };

    return (
        <div>
            <h2>Product List</h2>
            <ul>
                {products.map(product => (
                    <li key={product.id} onClick={() => handleProductClick(product.id)}>
                        {product.name} - {product.price}
                    </li>
                ))}
            </ul>
            
            <br/> 
            <Link to="/recommendations">See Recommendations</Link>
            <br/> 

             {/* Link back to Home */}
          <Link to="/">Back to Homepage</Link>
        </div>
    );
};

export default ProductList;
   