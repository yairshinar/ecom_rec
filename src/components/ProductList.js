import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts, logUserAction, fetchRecommendations, clearUserLogs } from '../services/api';
import ProductDetail from './ProductDetail';
import './ProductList.css';

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
                    setProducts(response);
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
        <div className="product-recommendation-container">
            <h2>Product Recommendation System</h2>
            <p>Select a product to see details and receive personalized recommendations based on your preferences.</p>
            
            <div className="product-main">
                <section className="product-list">
                    <h3>Products</h3>
                    <div className="product-items">
                        {products.map(product => (
                            <div 
                                key={product.id} 
                                className="product-item" 
                                onClick={() => handleProductClick(product)}
                            >
                                <h4>{product.name}</h4>
                                <p>${(Number(product.price) || 0).toFixed(2)}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="product-details">
                    {selectedProduct ? (
                        <>
                            <h3>Product Details</h3>
                            <ProductDetail product={selectedProduct} />
                        </>
                    ) : (
                        <h3>Select a product to view details</h3>
                    )}
                </section>
            </div>

            <section className="recommendations">
                <h3>Recommended for You</h3>
                <div className="recommendation-controls">
                    <button onClick={handleRefreshRecommendations} disabled={loadingRecommendations}>
                        Refresh
                    </button>
                    <button onClick={handleClearUserLogs}>Clear Logs</button>
                </div>
                <div className="recommendation-items">
                    {recommendations.length > 0 ? (
                        recommendations.map(rec => (
                            <div key={rec.id} className="recommendation-item">
                                <h4>{rec.name}</h4>
                                <p>${(Number(rec.price) || 0).toFixed(2)}</p>
                                <p>Score: {rec.score}</p>
                            </div>
                        ))
                    ) : (
                        <p>No recommendations available.</p>
                    )}
                </div>
            </section>

            <footer>
                <Link to="/">Back to Homepage</Link>
            </footer>
        </div>
    );
};

export default ProductList;
