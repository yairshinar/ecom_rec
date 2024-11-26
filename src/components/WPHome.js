import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import './WPHome.css';
import umlDiagram from '../assets/images/ai-commerce-uml.jpg';
import architectureDesign from '../assets/images/ai-commerce-architecture.jpg';
import erdImage from '../assets/images/ai-commerce-erd.svg';
import githubIcon from '../assets/icons/github.svg';
import page00001 from '../assets/images/page0001.jpg';
import page00002 from '../assets/images/page0002.jpg';

const WPHome = () => {
  
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState('');
  // State for tracking zoom and pan
  const [scale, setScale] = useState(1); // Initial scale
  const [translate, setTranslate] = useState({ x: 0, y: 0 }); // Initial pan

  // Handle mouse drag
  const handleMouseDown = (e) => {
    const img = document.getElementById('zoomable-image');
    let startX = e.clientX;
    let startY = e.clientY;

    const mouseMoveHandler = (moveEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;

      setTranslate((prev) => ({
        x: prev.x + dx,
        y: prev.y + dy,
      }));

      startX = moveEvent.clientX;
      startY = moveEvent.clientY;
    };

    const mouseUpHandler = () => {
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  };

  // Handle zoom
  const handleZoom = (e) => {
    e.preventDefault(); // Prevent page scroll
    const zoomStep = 0.1; // Adjust zoom sensitivity
    const newScale = e.deltaY < 0 ? scale + zoomStep : scale - zoomStep;

    setScale(Math.max(1, newScale)); // Ensure minimum scale is 1
  };

  const openModal = (image) => {
    setCurrentImage(image);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentImage('');
  };

  return (
    <div className="home-container">
      <section className="projects">
        <div className="project-card">
          <h3>Product Recommendation System</h3>
          <p>AI-based system learns and suggests relevant products based on your selections.</p>
          <div className="image-gallery">
            {/* Image thumbnails with zoom and pan option */}
            {[{ src: umlDiagram, alt: 'UML Diagram', title: 'UML Diagram' },
            { src: architectureDesign, alt: 'Architecture Design', title: 'Architecture Design' },
            { src: erdImage, alt: 'ERD', title: 'ERD' },
            { src: page00001, alt: 'Algorithm Explanation 1', title: 'Algorithm Explanation 1' },
            { src: page00002, alt: 'Algorithm Explanation 2', title: 'Algorithm Explanation 2' }].map((image, index) => (
              <div key={index} className="thumbnail">
                <img src={image.src} alt={image.alt} onClick={() => openModal(image.src)} />
                <div className="image-title">{image.title}</div>
                <a href={image.src} download className="download-btn">Download</a>
              </div>
            ))}
          </div>
          <div className="project-links">
            <Link to="/products" className="btn-project">Test Project</Link>
            <a href="https://github.com/yairshinar/ecom_rec" target="_blank" rel="noopener noreferrer" className="btn-link">
              <img src={githubIcon} alt="GitHub" className="icon" /> View Code
            </a>
          </div>
        </div>
      </section>

      {isModalOpen && (
        <div
          className="modal"
          onClick={closeModal}
          style={{
            position: 'fixed',
            inset: '0',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'rgba(0, 0, 0, 0.8)',
            zIndex: 1000,
          }}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              width: '90vw',
              height: '90vh',
              background: 'white',
              overflow: 'hidden',
              borderRadius: '8px',
              cursor: 'grab', // Cursor for dragging
            }}
          >
            <span
              className="close"
              onClick={closeModal}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                fontSize: '24px',
                color: 'white',
                background: 'black',
                padding: '5px 10px',
                borderRadius: '50%',
                cursor: 'pointer',
                zIndex: 1001,
              }}
            >
              &times;
            </span>
            <img
              src={currentImage}
              alt="Zoomable Content"
              id="zoomable-image"
              style={{
                position: 'absolute', // Position absolute to enable movement
                top: `${translate.y}px`,
                left: `${translate.x}px`,
                transform: `scale(${scale})`,
                transformOrigin: 'center center', // Scale from the center
                width: '100%',
                height: '100%',
                objectFit: 'contain', // Maintain aspect ratio
                cursor: 'grab',
              }}
              draggable={false} // Prevent browser default drag behavior
              onWheel={(e) => handleZoom(e)} // Handle zoom on scroll
              onMouseDown={(e) => handleMouseDown(e)} // Handle dragging
            />

          </div>
        </div>
      )}

    </div>
  );
};

export default WPHome;
