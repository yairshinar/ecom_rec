import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ZoomIn } from 'lucide-react';
import ImageModal from './imageModal';

const ProjectCard = ({ project }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
        {/* Project Header */}
        <h3 className="text-2xl font-bold mb-3">{project.title}</h3>
        <p className="text-gray-600 mb-4">{project.description}</p>

        {/* Technical Diagrams Section */}
        <div className="mb-4">
          <h4 className="text-lg font-semibold mb-2">Technical Documentation</h4>
          <div className="grid grid-cols-2 gap-4">
            {project.diagrams.map((diagram) => (
              <div 
                key={diagram.id} 
                className="relative group cursor-pointer"
                onClick={() => setSelectedImage(diagram)}
              >
                <img
                  src={diagram.thumbnail}
                  alt={diagram.title}
                  className="w-full h-48 object-cover rounded-md transition-all duration-300 group-hover:brightness-75"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn className="w-8 h-8 text-white" />
                </div>
                <p className="mt-1 text-sm font-medium text-gray-700">{diagram.title}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Link 
            to={project.link} 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            View Project <ExternalLink className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Modal */}
      <ImageModal 
        image={selectedImage} 
        onClose={() => setSelectedImage(null)} 
      />
    </>
  );
};

export default ProjectCard;