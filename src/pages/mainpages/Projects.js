// import { Link } from 'react-router-dom';
import '../../styles/Projects.css';
import React, { useState, useEffect } from 'react';
import { db } from '../../firebase'; // Adjust the import based on your Firebase setup
import { collection, getDocs } from 'firebase/firestore';
import { getImage } from '../../utils/getProjectImage';

const Projects = () => {
  const [projectsData, setProjectsData] = useState([]); // State for projects data
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // Track the currently displayed image

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'projectData')); // Adjust collection name
        const projects = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProjectsData(projects);
        setSelectedProject(projects[0]); // Set the first project as default
      } catch (error) {
        console.error("Error fetching projects: ", error);
      }
    };

    fetchProjects();
  }, []);

  const handleCardClick = (project) => {
    setSelectedProject(project);
    setCurrentImageIndex(0); // Reset image index when a new project is selected
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % selectedProject.galleryimages.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? selectedProject.galleryimages.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="projects-page">
      {/* Left section for listing all projects */}
      <div className="projects-list" style={{ width: '25%' }}>
        {projectsData.map((project, index) => (
          <div
            key={index}
            className="project-card"
            onClick={() => handleCardClick(project)}
          >
            <img src={getImage(project.projectimage)} alt={project.title} />
            <div className="project-info">
              <h3>{project.title}</h3>
              <div className="coding-languages">
                {project.codinglanguages.map((lang, idx) => (
                  <i key={idx} className={`devicon-${lang.toLowerCase()}-plain`}></i>
                ))}
              </div>
            </div>
            <div className="arrow">→</div>
            {project.status && (
              <div className={`status-overlay ${project.status.toLowerCase()}`}>
                {project.status.replace(/_/g, ' ')}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Right section for displaying selected project details */}
      <div className="project-details" style={{ width: '75%' }}>
        {selectedProject && (
          <div>
            <h1>{selectedProject.title}</h1>
            <hr className="project-details-line" />
            <div className="project-details-header">
              <span className={`status-text ${selectedProject.status.toLowerCase()}`}>
                {selectedProject.status.replace(/_/g, ' ')}
              </span>
              <div className="separator"></div>
              <div className="project-languages">
                {selectedProject.codinglanguages.map((lang, idx) => (
                  <i key={idx} className={`devicon-${lang.toLowerCase()}-plain`}></i>
                ))}
              </div>
              <div className="separator"></div>
              <button
                className="project-link-btn"
                onClick={() => selectedProject.link !== "N/A" && window.open(selectedProject.link, '_blank')}
                disabled={selectedProject.link === "N/A"} // Disable button if link is "N/A"
              >
                View Project
              </button>
            </div>
            <p className="project-description">{selectedProject.description}</p>

            {/* Image Carousel */}
            <div className="image-carousel">
              <button onClick={handlePrevImage} className="carousel-control prev">
                ←
              </button>
              <div className="carousel-images">
                <img
                  src={getImage(selectedProject.galleryimages[currentImageIndex])}
                  alt={`${currentImageIndex + 1}`}
                  onClick={() =>
                    window.open(selectedProject.galleryimages[currentImageIndex], '_blank')
                  }
                />
              </div>
              <button onClick={handleNextImage} className="carousel-control next">
                →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
