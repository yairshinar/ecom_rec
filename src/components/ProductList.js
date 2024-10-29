import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts, logUserAction, fetchRecommendations, clearUserLogs } from '../services/api';
import ProductDetail from './ProductDetail';
import './ProductList.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeadphones, faMobileAlt, faLaptop, faGamepad, faDesktop, faChargingStation, faHeartbeat, faBriefcase, faHdd, faClock } from '@fortawesome/free-solid-svg-icons';

const getCategoryIcon = (category) => {
    switch (category) {
        case 'Electronics':
            return faMobileAlt; // Icon for electronics
        case 'Wearables':
            return faClock; // Icon for wearables
        case 'Audio':
            return faHeadphones; // Icon for audio devices
        case 'Gaming':
            return faGamepad; // Icon for gaming
        case 'Computers':
            return faDesktop; // Icon for computers
        case 'Accessories':
            return faChargingStation; // Icon for chargers
        case 'Health':
            return faHeartbeat; // Icon for health devices
        case 'Office':
            return faBriefcase; // Icon for office supplies
        case 'Storage':
            return faHdd; // Icon for storage devices
        default:
            return faMobileAlt; // Default icon
    }
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
                const sortedRecommendations = response.data.recommendedProducts.sort((a, b) => b.score - a.score);
                setRecommendations(sortedRecommendations);
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
                            key={product.id} 
                            className="product-item" 
                            onClick={() => handleProductClick(product)}
                        >
                            <FontAwesomeIcon icon={getCategoryIcon(product.category)} className="product-icon" />
                            <h4>{product.name}</h4>
                            <p>${(Number(product.price) || 0).toFixed(0)}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="recommendations">
                <h3>Personalized Recommendations</h3>
                <p>Refresh recommendations to get the latest personalized suggestions.</p>
                <div className="recommendation-controls">
                    <button onClick={handleRefreshRecommendations} disabled={loadingRecommendations}>
                        Get Latest Recommendations
                    </button>
                    <button onClick={handleClearUserLogs}>Clear User Data</button>
                </div>
                <div className="recommendation-items">
                    {recommendations.length > 0 ? (
                        recommendations.map(rec => {
                            const collaborativeScore = (Number(rec.collaborativeContribution) || 0);
                            const contentScore = (Number(rec.contentContribution) || 0);
                            const finalScore = (collaborativeScore * 0.7 + contentScore * 0.3).toFixed(0); // Combined calculation

                            return (
                                <div key={rec.id} className="recommendation-item">
                                    <FontAwesomeIcon icon={getCategoryIcon(rec.category)} className="recommendation-icon" />
                                    <h4>{rec.name}</h4>
                                    <p>${(Number(rec.price) || 0).toFixed(0)}</p>
                                    <p className="score">
                                        Score: <span>{finalScore}</span>
                                        <br />
                                        (<span>{(collaborativeScore * 0.7).toFixed(0)} From 0.7* Collaboration</span> + 
                                        <span>{(contentScore * 0.3).toFixed(0)} From 0.3* Content)</span>
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
