import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios'; 
import { Link } from 'react-router-dom';

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;
 
const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
 
    useEffect(() => {
        // Fetch product details based on the product ID
        axios.get(`${API_ENDPOINT}/product/${id}`).then(response => {
            setProduct(response.data);
        });
    }, [id]);

    if (!product) return <div>Loading...</div>;

    return (
        <div>
            <h1>{product.name}</h1>
            <p>{product.description}</p>
            <p>Price: ${product.price}</p>
             {/* Link back to Home */}
          <Link to="/">Back to Homepage</Link>
        </div>
    );
};

export default ProductDetail;
