import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts, logUserAction, fetchRecommendations, fetchProductDetails } from '../services/api';
import ProductDetail from './ProductDetail';
import './ProductList.css'; // Ensure your CSS file is imported

const ProductList = () => {
    const userId = localStorage.getItem('userId');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [products, setProducts] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [loadingRecommendations, setLoadingRecommendations] = useState(false); // Track loading state

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const response = await fetchProducts();
                setProducts(response || []);
                await getRecommendations(); // Call the getRecommendations function after loading products
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        loadProducts(); // Initial load of products
    }, [userId]);

    const getRecommendations = async () => {
        setLoadingRecommendations(true); // Start loading
        try {
            const response = await fetchRecommendations(userId);
            if (response && Array.isArray(response.data.recommendedProducts)) {
                const details = response.data.recommendedProducts;
                if (Array.isArray(details)) {
                    setRecommendations(details);
                } else {
                    console.error("Expected product details to be an array:", details);
                }
            } else {
                console.error("Unexpected response structure:", response);
            }
        } catch (error) {
            console.error("Error fetching recommendations:", error);
        } finally {
            setLoadingRecommendations(false); // End loading
        }
    };

    const handleProductClick = (product) => {
        logUserAction(userId, product.id, 'viewed');
        setSelectedProduct(product);
    };

    const handleRefreshRecommendations = async () => {
        await getRecommendations(); // Fetch new recommendations
    };

    return (
        <div className="product-list-container">
            <h2>Product Details</h2>
            {selectedProduct && (
                <div className="product-details">
                    <ProductDetail product={selectedProduct} />
                </div>
            )}
            <h2>Product List</h2>
            <div className="product-list">
                {products.map(product => (
                    <div 
                        key={product.id} 
                        className={`product-item ${selectedProduct && selectedProduct.id === product.id ? 'selected' : ''}`} 
                        onClick={() => handleProductClick(product)}
                    >
                        <h3>{product.name}</h3>
                        <p>Price: ${product.price}</p>
                    </div>
                ))}
            </div>
            <h2>Recommended Products</h2>
            <div className="recommendation-controls">
                <button 
                    onClick={handleRefreshRecommendations} 
                    disabled={loadingRecommendations || recommendations.length === 0}
                >
                    Refresh Recommendations
                </button>
            </div>
            <div className="recommendation-list">
                {recommendations.length > 0 ? (
                    <div className="recommendation-items">
                        {recommendations.map(rec => (
                            <div key={rec.id} className="recommendation-item">
                                <h4>{rec.name}</h4>
                                <p>Price: ${rec.price}</p>
                                <p>Score: {rec.score}</p>
                                <p>Calculation: {rec.calculation}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No recommendations available.</p>
                )}
                 
            </div>
            <div className="links">
                <Link to="/">Back to Homepage</Link>
            </div>
        </div>
    );
};

export default ProductList;
