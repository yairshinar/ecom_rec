import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import umlDiagram from '../assets/images/ai-commerce-uml.jpg';
import architectureDesign from '../assets/images/ai-commerce-Architectual Design.jpg';
import erdImage from '../assets/images/ai-commerce-ERD.svg'; // Add ERD image path
import githubIcon from '../assets/icons/github.svg'; // GitHub icon

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
        <p>Discover solutions I've built to enhance user experience and drive growth.</p>
      </header>

      <section className="projects">
        <div className="project-card">
          <h3>Product Recommendation System</h3>
          <p>An AI-powered system that suggests products based on user behavior and preferences.</p>
          
          <div className="image-gallery">
            {/* UML Image */}
            <div className="thumbnail" onClick={() => openModal(umlDiagram)}>
              <img src={umlDiagram} alt="UML Diagram" />
              <h4>UML Diagram</h4>
            </div>
            {/* Architecture Image */}
            <div className="thumbnail" onClick={() => openModal(architectureDesign)}>
              <img src={architectureDesign} alt="Architecture Design" />
              <h4>Architecture Design</h4>
            </div>
            {/* ERD Image */}
            <div className="thumbnail" onClick={() => openModal(erdImage)}>
              <img src={erdImage} alt="ERD" />
              <h4>ERD</h4>
            </div>
          </div>

          {/* Project Links */}
          <div className="project-links">
            <Link to="/products" className="btn-project">View Project</Link>
            <a href="https://github.com/yairshinar/ecom_rec" target="_blank" rel="noopener noreferrer" className="btn-link">
              <img src={githubIcon} alt="GitHub" className="icon" /> GitHub
            </a>
          </div>
        </div>

        {/* Repeat project card structure as needed for other projects */}
        <div className="project-card">
          <h3>Data Analytics Dashboard</h3>
          <p>A comprehensive dashboard offering real-time insights for data-driven decisions.</p>
          <div className="project-links">
            <Link to="/analytics" className="btn-project">View Project</Link>
            <a href="https://github.com/yourusername/data-analytics-dashboard" target="_blank" rel="noopener noreferrer" className="btn-link">
              <img src={githubIcon} alt="GitHub" className="icon" /> GitHub
            </a>
          </div>
        </div>

        <div className="project-card">
          <h3>Automated Reporting Tool</h3>
          <p>A tool that automates reporting processes, saving time and reducing errors.</p>
          <div className="project-links">
            <Link to="/reporting" className="btn-project">View Project</Link>
            <a href="https://github.com/yourusername/automated-reporting-tool" target="_blank" rel="noopener noreferrer" className="btn-link">
              <img src={githubIcon} alt="GitHub" className="icon" /> GitHub
            </a>
          </div>
        </div>

        <div className="project-card">
          <h3>E-commerce Platform Optimization</h3>
          <p>Enhanced performance and usability for a large-scale e-commerce site.</p>
          <div className="project-links">
            <Link to="/ecommerce" className="btn-project">View Project</Link>
            <a href="https://github.com/yourusername/ecommerce-optimization" target="_blank" rel="noopener noreferrer" className="btn-link">
              <img src={githubIcon} alt="GitHub" className="icon" /> GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Modal for viewing enlarged images */}
      {isModalOpen && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={closeModal}>&times;</span>
            <img src={currentImage} alt="Enlarged view" style={{ width: '100%', maxWidth: '600px' }} />
          </div>
        </div>
      )}

      <footer>
        <p>Contact me for consultancy or collaboration opportunities!</p>
      </footer>
    </div>
  );
};

export default Home;
