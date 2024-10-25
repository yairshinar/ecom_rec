import React from 'react';
import { Link } from 'react-router-dom';

const ProductDetail = ({ product }) => {
    return (
        <div className="product-detail">
            <h1>{product.name}</h1>
            <p>{product.description}</p>
            <p>Price: ${product.price}</p>
            <p>Category: {product.category}</p>
            <p>Created At: {new Date(product.createdAt).toLocaleDateString()}</p>
            <Link to="/">Back to Products</Link>
        </div>
    );
};

export default ProductDetail;
