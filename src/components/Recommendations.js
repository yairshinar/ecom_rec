import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;
const Recommendations = () => {
    const [recommendations, setRecommendations] = useState([]);

    useEffect(() => {
        // Fetch product recommendations from the recommendation API
        axios.get(`${API_ENDPOINT}/recommendations`).then(response => {
            setRecommendations(response.data);
        });
    }, []);

    return (
        <div>
            <h1>Recommended Products</h1>
            <ul>
                {recommendations.map(rec => (
                    <li key={rec.productId}>
                        Product ID: {rec.productId}, Score: {rec.score}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Recommendations;
