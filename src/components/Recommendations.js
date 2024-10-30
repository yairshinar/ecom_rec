import React, { useEffect, useState } from 'react';
import { fetchRecommendations, fetchProductDetails } from '../services/api'; // Adjust the import path as necessary
import { Link } from 'react-router-dom';

const Recommendations = () => {
    const [productDetails, setProductDetails] = useState([]);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const getRecommendations = async () => {
            try {
                const response = await fetchRecommendations(userId);
                
                // Make sure the response is in the expected format
                if (response && Array.isArray(response.data.recommendedProductIds)) {
                    const productIds = response.data.recommendedProductIds; // Extract product IDs
                    const details = await fetchProductDetails(productIds); // Fetch product details
                    // Check if details is an array
                    if (Array.isArray(details.data)) {
                        setProductDetails(details.data);
                    } else {
                        console.error("Expected product details to be an array:", details);
                    }
                } else {
                    console.error("Unexpected response structure:", response);
                }
            } catch (error) {
                console.error("Error fetching recommendations:", error);
            }
        };

        getRecommendations();
    }, [userId]);

    return (
        <div>
            <h2>Recommended Products</h2>
            <ul>
                {productDetails.length > 0 ? (
                    productDetails.map(product => (
                        <li key={product.product_id}> {/* Adjust the key based on your data structure */}
                            {product.name} - Price: ${product.price} {/* Adjust according to your data structure */}
                        </li>
                    ))
                ) : (
                    <li>No recommendations available.</li>
                )}
            </ul>
            <Link to="/">Back to Homepage</Link>
        </div>
    );
};

export default Recommendations;
