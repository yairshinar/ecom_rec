import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts, logUserAction, fetchRecommendations, clearUserLogs } from '../services/api';
import ProductDetail from './ProductDetail';
import './ProductList.css'; // Ensure your CSS file is imported

const ProductList = () => {
    const userId = localStorage.getItem('userId');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [products, setProducts] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [loadingRecommendations, setLoadingRecommendations] = useState(false);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const response = await fetchProducts();
                if (response && Array.isArray(response)) {
                    setProducts(response || []);
                    await getRecommendations();
                }
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        loadProducts();
    }, [userId]);

    const getRecommendations = async () => {
        setLoadingRecommendations(true);
        try {
            const response = await fetchRecommendations(userId);
            if (response && Array.isArray(response.data?.recommendedProducts)) {
                setRecommendations(response.data.recommendedProducts);
            }
        } catch (error) {
            console.error("Error fetching recommendations:", error);
        } finally {
            setLoadingRecommendations(false);
        }
    };

    const handleProductClick = (product) => {
        logUserAction(userId, product.id, 'viewed');
        setSelectedProduct(product);
    };

    const handleRefreshRecommendations = async () => {
        await getRecommendations();
    };

    const handleClearUserLogs = async () => {
        await clearUserLogs(userId);
        alert("User logs cleared successfully!");
    };

    return (
        <div className="product-list-container">
            <div className="product-details">
                {selectedProduct ? (
                    <>
                        <h2>Product Details</h2>
                        <ProductDetail product={selectedProduct} />
                    </>
                ) : (
                    <h2>Select a product to see details</h2>
                )}
            </div>

            <h2>Product List</h2>
            <div className="product-list">
                {products.map(product => (
                    <div 
                        key={product.id} 
                        className="product-item" 
                        onClick={() => handleProductClick(product)}
                    >
                        <h3>{product.name}</h3>
                        <p>Price: ${(Number(product.price) || 0).toFixed(2)}</p>
                    </div>
                ))}
            </div>

            <h2>Recommended Products</h2>
            <div className="recommendation-controls">
                <button 
                    onClick={handleRefreshRecommendations} 
                    disabled={loadingRecommendations}
                >
                    Refresh Recommendations
                </button>
                <button onClick={handleClearUserLogs}>Clear User Logs</button>
            </div>

            <div className="recommendation-list">
                {recommendations.length > 0 ? (
                    <div className="recommendation-items">
                        {recommendations.map(rec => (
                            <div key={rec.id} className="recommendation-item">
                                <h4>{rec.name}</h4>
                                <p>Price: ${(Number(rec.price) || 0).toFixed(2)}</p>
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
