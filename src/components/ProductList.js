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
            console.log(response.data)
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
                <div class="calculation-details">
                    <h5>Calculation Details</h5>
                    <div class="calc-row">
                        <div class="calc-item">
                            <strong>Collaborative Contribution</strong>
                            <p><em>How:</em> Uses Singular Value Decomposition (SVD) on the interaction matrix to calculate a score from 0-100. This score reflects product popularity by identifying user preference patterns and normalizing scores across diverse users.</p>
                            <p><em>Why:</em> Highlights products appealing to a broad user base, ensuring that recommendations resonate with new and returning customers.</p>
                        </div>
                        <div class="calc-item">
                            <strong>Content Contribution</strong>
                            <p><em>How:</em> Applies TF-IDF (Term Frequency-Inverse Document Frequency) to evaluate keyword relevance in product descriptions. By comparing the frequency of significant terms against a corpus of popular items, we calculate a content score (0-100) that emphasizes descriptions with high matching terms relative to total unique words.</p>
                            <p><em>Why:</em> Enhances discoverability by recommending products with relevant features reflected in descriptions, aiding users in finding similar items quickly.</p>
                        </div>
                    </div>
                </div>


                <div className="recommendation-items">
                    {recommendations.length > 0 ? (
                        recommendations.map(rec => {
                            const collaborativeScore = rec.collaborativeContribution * 100 || 0;
                            const contentScore = rec.contentContribution * 100 || 0;
                            const finalScore = rec.score;
                            const uniqueUsers = rec.uniqueUsers || 0; // Unique user count
                            const interactions = rec.interactions || 0; // Total interactions

                            return (
                                <div
                                    key={rec.id}
                                    className="recommendation-item"
                                    onClick={() => handleProductClick(rec, true)}
                                >
                                    <FontAwesomeIcon icon={getCategoryIcon(rec.category)} className="recommendation-icon" />
                                    <h4>{highlightSimilarWords(rec.name, rec.similarWords)}</h4>
                                    <p>${(Number(rec.price) || 0).toFixed(2)}</p>
                                    <p className="score">
                                        Score: <span>{finalScore.toFixed(2)}</span>
                                        <br />
                                        (<span>{(collaborativeScore).toFixed(0)}% from User Views Collaboration</span> +
                                        <span>{(contentScore).toFixed(0)}% from Description Similarity</span>)
                                        <br />
                                        <span>Unique Users: {uniqueUsers}</span> |
                                        <span>Total Interactions: {interactions}</span> {/* Updated label */}
                                        <br />
                                        {/* Display similar words if available */}
                                        {rec.similarWords && rec.similarWords.length > 0 && (
                                            <span>Similar Words: {rec.similarWords.join(', ')}</span>
                                        )}
                                    </p>
                                </div>
                            );
                        })
                    ) : (
                        <p>No recommendations available.</p>
                    )}
                </div>


            </section >

            <footer>
                <Link to="/">Back to Homepage</Link>
            </footer>
        </div >
    );
};

export default ProductList;
