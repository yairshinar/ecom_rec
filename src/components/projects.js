import umlDiagram from '../assets/images/ai commerce-uml.jpg';
import architectureDesign from '../assets/images/ai commerce-Architectual Design.jpg';

export const projectsData = [
  {
    id: 1,
    title: "Product Recommendation System",
    description: "An AI-powered system that suggests products based on user behavior and preferences.",
    link: "/products",
    demoLink: "#",
    githubLink: "#",
    impact: [
      "Increased conversion rate by 32%",
      "Improved user engagement by 45%",
      "Reduced cart abandonment by 28%"
    ],
    technologies: ["Python", "TensorFlow", "React", "AWS"],
    diagrams: [
      {
        id: 1,
        thumbnail: umlDiagram,
        title: "System UML Diagram",
        type: "UML Diagram",
        description: "Comprehensive UML diagram showing the system's class relationships and interactions"
      },
      {
        id: 2,
        thumbnail: architectureDesign,
        title: "Architecture Design",
        type: "Architecture Diagram",
        description: "High-level architectural design showcasing system components and their interactions"
      }
    ]
  },
  // Add more projects here...
];