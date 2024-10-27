import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import umlDiagram from '/assets/images/ai commerce-uml.jpg'; // Replace with your actual image path
import architectureDesign from '/assets/images/ai commerce-Architectual Design.jpg'; // Replace with your actual image path

const Home = () => {
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
          <Link to="/products" className="btn-project">View Project</Link>
        </div>

        <div className="project-card">
          <h3>Data Analytics Dashboard</h3>
          <p>A comprehensive dashboard offering real-time insights for data-driven decisions.</p>
          <Link to="/analytics" className="btn-project">View Project</Link>
        </div>

        <div className="project-card">
          <h3>Automated Reporting Tool</h3>
          <p>A tool that automates reporting processes, saving time and reducing errors.</p>
          <Link to="/reporting" className="btn-project">View Project</Link>
        </div>

        <div className="project-card">
          <h3>E-commerce Platform Optimization</h3>
          <p>Enhanced performance and usability for a large-scale e-commerce site.</p>
          <Link to="/ecommerce" className="btn-project">View Project</Link>
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
