import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
      <header className="hero">
        <h1>Explore My Projects</h1>
        <p>Discover innovative solutions and insights.</p>
      </header>

      <section className="projects">
        {/* Project Cards */}
        {/* Repeat for each project */}
        <div className="project-card">
          <h3>Product Recommendation System</h3>
          <p>AI-based system learns and suggests relevant products based on your selections.</p>
          <div className="image-gallery">
            <div className="thumbnail" onClick={() => openModal(umlDiagram)}>
              <img src={umlDiagram} alt="UML Diagram" />
              <div className="image-title">UML Diagram</div>
            </div>
            <div className="thumbnail" onClick={() => openModal(architectureDesign)}>
              <img src={architectureDesign} alt="Architecture Design" />
              <div className="image-title">Architecture Design</div>
            </div>
            <div className="thumbnail" onClick={() => openModal(erdImage)}>
              <img src={erdImage} alt="ERD" />
              <div className="image-title">ERD</div>
            </div>
            <div className="thumbnail" onClick={() => openModal(page00001)}>
              <img src={page00001} alt="Recommendation Algorithm Explanation 1" />
              <div className="image-title">Algorithm Explanation 1</div>
            </div>
            <div className="thumbnail" onClick={() => openModal(page00002)}>
              <img src={page00002} alt="Recommendation Algorithm Explanation 2" />
              <div className="image-title">Algorithm Explanation 2</div>
            </div>
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
            <img src={currentImage} alt="Enlarged" />
          </div>
        </div>
      )}

      <footer>
        <p>Contact me for consultancy or collaboration!</p>
      </footer>
    </div>
  );
};

export default Home;
