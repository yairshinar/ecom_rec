import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import './Home.css';
import umlDiagram from '../assets/images/ai-commerce-uml.jpg';
import architectureDesign from '../assets/images/ai-commerce-architecture.jpg';
import erdImage from '../assets/images/ai-commerce-erd.svg';
import githubIcon from '../assets/icons/github.svg';
import page00001 from '../assets/images/page0001.jpg';
import page00002 from '../assets/images/page0002.jpg';

const Home = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState('');

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
  <div className="modal" onClick={closeModal}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <span className="close" onClick={closeModal}>X</span>
      <TransformWrapper>
        <TransformComponent>
          <img src={currentImage} alt="Zoomed and Paned Image" className="zoomed-image" />
        </TransformComponent>
      </TransformWrapper>
    </div>
  </div>
)}

    </div>
  );
};

export default Home;
