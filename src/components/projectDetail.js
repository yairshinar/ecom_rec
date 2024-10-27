import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, FileText, Github } from 'lucide-react';

const ProjectDetail = ({ project }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Back Navigation */}
      <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Projects
      </Link>

      {/* Project Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
        <p className="text-xl text-gray-600 mb-6">{project.description}</p>
        
        <div className="flex gap-4">
          <a href={project.demoLink} className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Live Demo <ExternalLink className="ml-2 w-4 h-4" />
          </a>
          <a href={project.githubLink} className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Github className="w-4 h-4 mr-2" /> View Code
          </a>
        </div>
      </div>

      {/* Impact Metrics */}
      <div className="grid grid-cols-3 gap-6 mb-12">
        {project.impact.map((impact, index) => (
          <div key={index} className="bg-blue-50 p-6 rounded-lg">
            <p className="text-blue-900 font-medium">{impact}</p>
          </div>
        ))}
      </div>

      {/* Technical Documentation */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Technical Documentation</h2>
        <div className="grid grid-cols-2 gap-6">
          {project.diagrams.map((doc) => (
            <div key={doc.id} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-start mb-4">
                <FileText className="w-6 h-6 text-blue-600 mr-3" />
                <div>
                  <h3 className="font-bold mb-1">{doc.title}</h3>
                  <p className="text-sm text-gray-600">{doc.type}</p>
                </div>
              </div>
              <img 
                src={doc.thumbnail} 
                alt={doc.title}
                className="w-full h-48 object-cover rounded-md mb-4 cursor-pointer hover:opacity-75 transition-opacity"
              />
              <p className="text-sm text-gray-600">{doc.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Technologies Used */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Technologies Used</h2>
        <div className="flex gap-2 flex-wrap">
          {project.technologies.map((tech, index) => (
            <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
