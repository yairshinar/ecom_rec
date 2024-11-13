import React, { useState, useEffect } from 'react';
import { fetchProducts, logUserAction, fetchRecommendations, clearUserLogs } from '../services/api';
import ProductDetail from './ProductDetail';
import './ProductList.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import icons from '../utils/icons';
import { Link } from 'react-router-dom';

const getCategoryIcon = (category) => {
    return icons[category] || icons['Electronics'];
};

const highlightSimilarWords = (text, similarWords) => {
    if (!similarWords || similarWords.length === 0) return text;

    const regex = new RegExp(`(${similarWords.join('|')})`, 'gi');
    return text.split(regex).map((part, index) =>
        similarWords.some(word => word.toLowerCase() === part.toLowerCase()) ? (
            <span key={index} style={{ backgroundColor: 'yellow' }}>{part}</span>
        ) : part
    );
};

const ProductList = () => {
    const userId = localStorage.getItem('userId');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [products, setProducts] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [loadingRecommendations, setLoadingRecommendations] = useState(false);

    const [interactions, setInteractions] = useState({});

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
        // Reset interactions when recommendations are fetched
        resetInteractions();

        setLoadingRecommendations(true);
        try {
            const response = await fetchRecommendations(userId);
            if (response && Array.isArray(response.data)) {
                const enrichedRecommendations = response.data.map(rec => {
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

        // Increment interaction count with animation
        const productId = product.product_id || product.id;
        setInteractions(prevState => ({
            ...prevState,
            [productId]: (prevState[productId] || 0) + 1
        }));
    };

    // Function to reset the interactions
    const resetInteractions = () => {
        setInteractions({});
    };

    const handleClearUserLogs = async () => {
        await clearUserLogs(userId);
        alert("All your data was cleared successfully!");
    };

    return (
        <div className="product-recommendation-container">
            <span className="return-button-container">
                <Link to="/" className="return-button">
                    <button>Return to All Projects</button>
                </Link>
            </span>
            <header>
                <h2>Product Store</h2>
                <p>Browse products and press Get Recommendations to get tailored recommendations based on your Clicks Count, Recency and Similar Products</p>
            </header>

            <section className="product-main">
                {/* Product Detail Section */}
                <div className="product-detail-container">
                    <h3>Product Details</h3>
                    <ProductDetail product={selectedProduct || {}} />
                </div>

                {/* Product List Section */}
                <div className="products-container">
                    <h3>Products</h3>
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
                                <p className="interaction-count">
                                    Interactions: {interactions[product.product_id] || 0}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Recommendations Section */}
            <section className="recommendations-container">
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
                            const uniqueUsers = rec.uniqueUsers || 0;
                            const interactions = rec.interactions || 0;

                            return (
                                <div
                                    key={rec.id}
                                    className="recommendation-item"
                                    onClick={() => handleProductClick(rec, true)}
                                >
                                    <FontAwesomeIcon icon={getCategoryIcon(rec.category)} className="recommendation-icon" />
                                    <h4>{highlightSimilarWords(rec.name, rec.similarWords)}</h4>
                                    <p>${(Number(rec.price) || 0).toFixed(0)}</p>
                                    <p className="score">
                                        <strong> Score:</strong> <span>{finalScore.toFixed(1)}</span>
                                        <br />
                                        <strong>Details:</strong>
                                        <br />
                                        <span className="collaborative">
                                            Collaborative: {collaborativeScore.toFixed(0)}%
                                            <span className="raw-data"> (Unique Users: {uniqueUsers}, Total Interactions: {interactions})</span>
                                        </span>
                                        <br />
                                        <span className="content-similarity">
                                            Content Similarity: {contentScore.toFixed(0)}%
                                            {rec.similarWords && rec.similarWords.length > 0 && (
                                                <span className="raw-data"> (Similar Words: {rec.similarWords.join(', ')})</span>
                                            )}
                                        </span>
                                        <br />
                                        <span>Matched Words Count: {rec.matchedWordsCount}</span>
                                        <br />
                                        <span>Unique Words Count: {rec.uniqueWordsCount}</span>
                                        <br />
                                        <strong>Recency Scores:</strong> <span>{Array.from(new Set(rec.productRecencyScores)).slice(0, 5).join(', ')}</span>
                                    </p>
                                </div>
                            );
                        })
                    ) : (
                        <p>No recommendations available.</p>
                    )}
                </div>
            </section>
            
        </div>
    );
};

export default ProductList;
