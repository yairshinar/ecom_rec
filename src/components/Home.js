import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import umlDiagram from './assets/images/ai commerce-uml.jpg'; // Replace with your actual image path
import architectureDesign from './assets/images/ai commerce-Architectual Design.jpg'; // Replace with your actual image path

const Home = () => {
  return (
    <div className="home-container">
      <header className="hero">
        <h1>Welcome to My Professional Portfolio</h1>
        <p>Your expert in tech solutions, systems architecture, and AI-driven development.</p>
        <Link to="/products" className="btn-main">Explore Product Recommendations</Link>
      </header>

      <section className="about">
        <h2>About Me</h2>
        <p>With extensive experience in project management, software architecture, and machine learning, I build tailored solutions to drive business innovation and success.</p>
      </section>

      <section className="skills">
        <h2>Skills & Expertise</h2>
        <ul>
          <li>Systems Architecture</li>
          <li>Cloud Development & Deployment</li>
          <li>Product Recommendation Systems</li>
          <li>Data Analytics & AI</li>
        </ul>
      </section>

      <section className="portfolio">
        <h2>Projects</h2>
        <div className="portfolio-item">
          <h3>Product Recommendation System</h3>
          <p>Utilizing React, AWS, and MongoDB to deliver an optimized and scalable recommendation platform.</p>
          <Link to="/products" className="btn-secondary">View Project</Link>
        </div>
      </section>

      <section className="designs">
        <h2>Architectural Design & UML Diagrams</h2>
        <div className="design-images">
          <img src={umlDiagram} alt="UML Diagram" style={{ width: '100%', maxWidth: '600px', marginBottom: '20px' }} />
          <img src={architectureDesign} alt="Architecture Design" style={{ width: '100%', maxWidth: '600px' }} />
        </div>
      </section>

      <footer>
        <p>Contact me for consultancy or collaboration opportunities!</p>
      </footer>
    </div>
  );
};

export default Home;
