import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import  icons   from '../utils/icons';
import './ProductDetail.css';
const getCategoryIcon = (category) => {
    return icons[category] || icons['Electronics'];
};

const ProductDetail = ({ product, onClose }) => {
    return (
        <div className="product-detail-overlay">
            <div className="product-detail">
                <h1>{product.name}</h1>
                <FontAwesomeIcon icon={getCategoryIcon(product.category)} className="product-detail-icon" />
                <p>{product.description}</p>
                <p>Price: <span>${(Number(product.price) || 0).toFixed(2)}</span></p>
                <p>Category: <span>{product.category}</span></p>
                <p>Created At: <span>{new Date(product.createdAt).toLocaleDateString()}</span></p>
            </div>
        </div>
    );
};

export default ProductDetail;
