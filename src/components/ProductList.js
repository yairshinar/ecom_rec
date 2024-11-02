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
                <div className="calculation-details">
                    <h5>Calculation Details</h5>
                    <div className="calc-row">
                        <div className="calc-item">
                            <strong>Collaborative Contribution</strong>
                            <p>
                                <em>How:</em> Collaborative scores are generated using Singular Value Decomposition (SVD) on the user-product interaction matrix. This technique helps to uncover latent factors that explain the observed ratings and interactions among users and products.
                                The interaction scores are weighted based on user activity, with a particular focus on the sequence of interactions:
                                <ul>
                                    <li>The most recent interactions receive a higher recency score, which is determined by their order in the interaction list. This means that recent interactions have a more significant influence on the final score while still allowing older interactions to contribute to the overall score.</li>
                                    <li>Unique users for each product are calculated to prevent overestimating popularity based on repeated interactions.</li>
                                </ul>
                                The formula applied is:
                                <br />
                                <code>30% Adjusted Collaborative Score = Collaborative Score * log(Unique Users + 1) * (0.3)</code>
                            </p>
                        </div>
                        <div className="calc-item">
                            <strong>Content Contribution</strong>
                            <p>
                                <em>How:</em> Content scores are derived from the term frequency-inverse document frequency (TF-IDF) of product descriptions. The scoring includes:
                                <ul>
                                    <li>Matched words from similar products are counted to determine the content relevance.</li>
                                    <li>Recency is integrated by giving more weight to products with recent user interactions, where the weight is calculated based on the order of interactions to ensure that the score reflects the importance of each interaction in context.</li>
                                </ul>
                                The calculation is as follows:
                                <br />
                                <code>70% Content Contribution = (Matched Words Count / Unique Words Count) * 100 * (0.7)</code>
                            </p>
                        </div>
                    </div>
                </div>





                <div className="recommendation-items">
                    {recommendations.length > 0 ? (
                        recommendations.map(rec => {
                            const collaborativeScore = rec.collaborativeContribution || 0;
                            const contentScore = rec.contentContribution || 0;
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
                                    <p>${(Number(rec.price) || 0).toFixed(0)}</p>
                                    <p className="score">
                                        <strong> Score:</strong> <span>{finalScore.toFixed(1)}</span>
                                        <br />
                                        <strong>Details:</strong>
                                        <br />
                                        <span>Collaborative: {collaborativeScore.toFixed(0)}%
                                            <span className="raw-data"> (Unique Users: {uniqueUsers}, Total Interactions: {interactions})</span>
                                        </span>
                                        <br />
                                        <span>Content Similarity: {contentScore.toFixed(0)}%
                                            {rec.similarWords && rec.similarWords.length > 0 && (
                                                <span className="raw-data"> (Similar Words: {rec.similarWords.join(', ')})</span>
                                            )}
                                        </span>
                                        <br />
                                        <span>Matched Words Count: {rec.matchedWordsCount}</span>
                                        <br />
                                        <span>Unique Words Count: {rec.uniqueWordsCount}</span>
                                        <br/>
                                        <strong>Recency Scores:</strong> <span>{Array.from(new Set(rec.productRecencyScores)).slice(0, 5).join(', ')}</span>

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
