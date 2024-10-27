// 1. First, create a new Modal component
// src/components/ImageModal.jsx
import React from 'react';
import { X } from 'lucide-react';

const ImageModal = ({ image, onClose }) => {
  if (!image) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="relative max-w-7xl w-full bg-white rounded-lg shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1 rounded-full bg-white shadow-lg hover:bg-gray-100"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="p-6">
          <h3 className="text-2xl font-bold mb-2">{image.title}</h3>
          <p className="text-gray-600 mb-4">{image.description}</p>
          
          <div className="relative">
            <img
              src={image.thumbnail}
              alt={image.title}
              className="w-full rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
 