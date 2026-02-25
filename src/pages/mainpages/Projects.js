// import { Link } from 'react-router-dom';
import '../../styles/Projects.css';
import React, { useState, useEffect } from 'react';
import { db } from '../../firebase'; // Adjust the import based on your Firebase setup
import { collection, getDocs } from 'firebase/firestore';
import { getImage } from '../../utils/getProjectImage';

const Projects = () => {
  const [projectsData, setProjectsData] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [expandedProjectId, setExpandedProjectId] = useState(null); // For mobile accordion
console.log(currentImageIndex)
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'projectData'));
        const projects = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProjectsData(projects);
        setSelectedProject(projects[0]);
      } catch (error) {
        console.error("Error fetching projects: ", error);
      }
    };

    fetchProjects();
  }, []);

  const handleCardClick = (project) => {
    // Desktop behavior
    setSelectedProject(project);
    setCurrentImageIndex(0);

    // Mobile accordion behavior
    setExpandedProjectId(prev => {
      if (prev === project.id) return null; // collapse if already open
      return project.id;
    });
  };

  // const handleNextImage = (images, index, setIndex) => {
  //   setIndex((prevIndex) => (prevIndex + 1) % images.length);
  // };

  // const handlePrevImage = (images, index, setIndex) => {
  //   setIndex((prevIndex) =>
  //     prevIndex === 0 ? images.length - 1 : prevIndex - 1
  //   );
  // };

  return (
    <div className="projects-page">
      {/* Left section for listing all projects */}
      <div className="projects-list" style={{ width: '25%' }}>
        {projectsData.map((project, index) => (
          <div key={index}>
            <div
              className={`project-card ${expandedProjectId === project.id ? 'expanded' : ''}`}
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

            {/* Mobile-only expandable detail panel */}
            {expandedProjectId === project.id && (
              <MobileProjectDetail project={project} />
            )}
          </div>
        ))}
      </div>

      {/* Right section for displaying selected project details (desktop only) */}
      <div className="project-details" style={{ width: '75%' }}>
        {selectedProject && (
          <ProjectDetailContent project={selectedProject} />
        )}
      </div>
    </div>
  );
};

// Shared detail content used in both desktop panel and mobile accordion
const ProjectDetailContent = ({ project }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNext = () => {
    setCurrentImageIndex(prev => (prev + 1) % project.galleryimages.length);
  };

  const handlePrev = () => {
    setCurrentImageIndex(prev =>
      prev === 0 ? project.galleryimages.length - 1 : prev - 1
    );
  };

  return (
    <div>
      <h1>{project.title}</h1>
      <hr className="project-details-line" />
      <div className="project-details-header">
        <span className={`status-text ${project.status.toLowerCase()}`}>
          {project.status.replace(/_/g, ' ')}
        </span>
        <div className="separator"></div>
        <div className="project-languages">
          {project.codinglanguages.map((lang, idx) => (
            <i key={idx} className={`devicon-${lang.toLowerCase()}-plain`}></i>
          ))}
        </div>
        <div className="separator"></div>
        <button
          className="project-link-btn"
          onClick={() => project.link !== "N/A" && window.open(project.link, '_blank')}
          disabled={project.link === "N/A"}
        >
          View Project
        </button>
      </div>
      <p className="project-description">{project.description}</p>

      <div className="image-carousel">
        <button onClick={handlePrev} className="carousel-control prev">←</button>
        <div className="carousel-images">
          <img
            src={getImage(project.galleryimages[currentImageIndex])}
            alt={`${currentImageIndex + 1}`}
            onClick={() => window.open(project.galleryimages[currentImageIndex], '_blank')}
          />
        </div>
        <button onClick={handleNext} className="carousel-control next">→</button>
      </div>
    </div>
  );
};

// Mobile accordion wrapper with its own image index state
const MobileProjectDetail = ({ project }) => {
  return (
    <div className="mobile-project-detail">
      <ProjectDetailContent project={project} />
    </div>
  );
};

export default Projects;