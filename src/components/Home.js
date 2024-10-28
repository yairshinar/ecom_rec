import erdImage from '../assets/images/ai-commerce-ERD.jpg'; // Ensure ERD image is added to assets

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
            <div className="thumbnail" onClick={() => openModal(umlDiagram)}>
              <img src={umlDiagram} alt="UML Diagram" />
              <h4>UML Diagram</h4>
            </div>
            <div className="thumbnail" onClick={() => openModal(architectureDesign)}>
              <img src={architectureDesign} alt="Architecture Design" />
              <h4>Architecture Design</h4>
            </div>
            <div className="thumbnail" onClick={() => openModal(erdImage)}>
              <img src={erdImage} alt="ERD" />
              <h4>ERD</h4>
            </div>
          </div>

          <div className="project-links">
            <Link to="/products" className="btn-project">View Project</Link>
            <a href="https://github.com/yourusername/product-recommendation-system" target="_blank" rel="noopener noreferrer" className="btn-link">
              <img src={githubIcon} alt="GitHub" className="icon" /> GitHub
            </a>
          </div>
        </div>

        {/* Repeat for other projects as needed */}
      </section>

      {isModalOpen && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={closeModal}>&times;</span>
            <img src={currentImage} alt="Enlarged" style={{ width: '100%', maxWidth: '600px' }} />
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
