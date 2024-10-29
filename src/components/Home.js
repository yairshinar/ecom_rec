import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import umlDiagram from '../assets/images/ai-commerce-uml.jpg';
import architectureDesign from '../assets/images/ai-commerce-architecture.jpg';
import erdImage from '../assets/images/ai-commerce-erd.svg';
import githubIcon from '../assets/icons/github.svg';

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
        {/* Project Card 1 */}
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
          </div>
          <div className="project-links">
            <Link to="/products" className="btn-project">Test Project</Link>
            <a href="https://github.com/yourusername/product-recommendation-system" target="_blank" rel="noopener noreferrer" className="btn-link">
              <img src={githubIcon} alt="GitHub" className="icon" /> View Code
            </a>
          </div>
        </div>

        {/* Project Card 2 */}
        <div className="project-card">
          <h3>Weather Tracker</h3>
          <p>Get real-time weather data and insights for any location globally.</p>
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
          </div>
          <div className="project-links">
            <Link to="/weather-tracker" className="btn-project">Test Project</Link>
            <a href="https://github.com/yourusername/weather-tracker" target="_blank" rel="noopener noreferrer" className="btn-link">
              <img src={githubIcon} alt="GitHub" className="icon" /> View Code
            </a>
          </div>
        </div>

        {/* Project Card 3 */}
        <div className="project-card">
          <h3>Expense Manager</h3>
          <p>Track and manage your expenses effortlessly to stay within budget.</p>
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
          </div>
          <div className="project-links">
            <Link to="/expense-manager" className="btn-project">Test Project</Link>
            <a href="https://github.com/yourusername/expense-manager" target="_blank" rel="noopener noreferrer" className="btn-link">
              <img src={githubIcon} alt="GitHub" className="icon" /> View Code
            </a>
          </div>
        </div>

        {/* Project Card 4 */}
        <div className="project-card">
          <h3>Smart Home Automation</h3>
          <p>Control and monitor your smart home devices from one seamless interface.</p>
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
          </div>
          <div className="project-links">
            <Link to="/smart-home-automation" className="btn-project">Test Project</Link>
            <a href="https://github.com/yourusername/smart-home-automation" target="_blank" rel="noopener noreferrer" className="btn-link">
              <img src={githubIcon} alt="GitHub" className="icon" /> View Code
            </a>
          </div>
        </div>
      </section>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <img src={currentImage} alt="Enlarged" style={{ maxWidth: '80%', maxHeight: '80%' }} />
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
