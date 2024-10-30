import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts, logUserAction, fetchRecommendations, clearUserLogs } from '../services/api';
import ProductDetail from './ProductDetail';
import './ProductList.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import icons from '../utils/icons';

const getCategoryIcon = (category) => {
    return icons[category] || icons['Electronics'];
};

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
                const enrichedRecommendations = response.data.recommendedProducts.map(rec => {
                    const product = products.find(p => p.product_id === rec.id);
                    return {
                        ...rec,
                        ...product,
                    };
                });
                const sortedRecommendations = enrichedRecommendations.sort((a, b) => b.score - a.score);
                setRecommendations(sortedRecommendations);
            }
        } catch (error) {
            console.error("Error fetching recommendations:", error);
        } finally {
            setLoadingRecommendations(false);
        }
    };

    const handleProductClick = (product, isRecommendation = false) => {
        const actionType = isRecommendation ? 'recommendation_viewed' : 'viewed';
        if (product && product.product_id) {
            logUserAction(userId, product.product_id, actionType);
        }
        setSelectedProduct(product);
    };

    const handleClearUserLogs = async () => {
        await clearUserLogs(userId);
        alert("All your data was cleared successfully!");
    };

    return (
        <div className="product-recommendation-container">
            <header>
                <h2>Product Store</h2>
                <p>Browse products and get tailored recommendations based on your interests.</p>
            </header>
            
            <section className="product-main">
                <div className="product-items">
                    {products.map(product => (
                        <div 
                            key={product.product_id} 
                            className="product-item" 
                            onClick={() => handleProductClick(product)}
                        >
                            <FontAwesomeIcon icon={getCategoryIcon(product.category)} className="product-icon" />
                            <h4>{product.name}</h4>
                            <p>${(Number(product.price) || 0).toFixed(0)}</p>
                        </div>
                    ))}
                </div>
                
                <div className="product-detail-area">
                    {selectedProduct && (
                        <ProductDetail product={selectedProduct} />
                    )}
                </div>
            </section>

            <section className="recommendations">
                <h3>Personalized Recommendations</h3>
                <div className="recommendation-controls">
                    <button onClick={getRecommendations} disabled={loadingRecommendations}>
                        Get Latest Recommendations
                    </button>
                    <button onClick={handleClearUserLogs}>Clear User Data</button>
                </div>
                <div className="recommendation-items">
                    {recommendations.length > 0 ? (
                        recommendations.map(rec => {
                            const collaborativeScore = rec.collaborativeContribution || 0;
                            const contentScore = rec.contentContribution || 0;
                            const finalScore = rec.score;
                            return (
                                <div 
                                    key={rec.id} 
                                    className="recommendation-item" 
                                    onClick={() => handleProductClick(rec, true)}
                                >
                                    <FontAwesomeIcon icon={getCategoryIcon(rec.category)} className="recommendation-icon" />
                                    <h4>{rec.name}</h4>
                                    <p>${(Number(rec.price) || 0).toFixed(0)}</p>
                                    <p className="score">
                                        Score: <span>{finalScore}</span>
                                        <br />
                                        (<span>{(collaborativeScore * 100).toFixed(0)} from User Views Collaboration</span> + 
                                        <span>{(contentScore* 100).toFixed(0)} from Description Similarity)</span>
                                    </p>
                                </div>
                            );
                        })
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
