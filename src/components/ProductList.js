import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts, logUserAction } from '../services/api';

const ProductList = () => {
    const userId = localStorage.getItem('userId');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [products, setProducts] = useState([]); // Initialize as an empty array

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const response = await fetchProducts();
                setProducts(response || []); // Use an empty array if `response.data` is undefined
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        loadProducts();
    }, []);

    const handleProductClick = (product) => {
        logUserAction(userId, product.id, 'viewed');
        setSelectedProduct(product); // Pass the entire product object, not just `product.id`
    };

    return (
        <div>
            <h2>Product List</h2>
            
            {/* Display selected product details */}
            {selectedProduct && (
                <div className="product-details">
                    <h3>{selectedProduct.name}</h3>
                    <p>{selectedProduct.description}</p>
                    <p>Price: ${selectedProduct.price}</p>
                </div>
            )}
            
            <ul>
                {products.map(product => (
                    <li key={product.id} onClick={() => handleProductClick(product)} style={{ cursor: 'pointer' }}>
                        {product.name} - ${product.price}
                    </li>
                ))}
            </ul>
            
            <br/>
            <Link to="/recommendations">See Recommendations</Link>
            <br/>
            <Link to="/">Back to Homepage</Link>
        </div>
    );
};

export default ProductList;
