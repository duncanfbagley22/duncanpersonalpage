import '../../styles/Projects.css';
import React, { useState, useEffect, useRef } from 'react';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';

const BOX_SIZE = 30; // mirrors a Gen 3 Pokémon storage box (6 x 5)

const Projects = () => {
  const [projectsData, setProjectsData] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [boxPage, setBoxPage] = useState(0);
  const dataPanelRef = useRef(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'projectData'));
        const projects = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProjectsData(projects);
        setSelectedProject(projects[0] || null);
      } catch (error) {
        console.error("Error fetching projects: ", error);
      }
    };

    fetchProjects();
  }, []);

  const totalPages = Math.max(1, Math.ceil(projectsData.length / BOX_SIZE));
  const visibleProjects = projectsData.slice(boxPage * BOX_SIZE, boxPage * BOX_SIZE + BOX_SIZE);

  const handleSlotClick = (project) => {
    setSelectedProject(project);

    // On mobile the data panel sits below the box grid — bring it into view.
    if (window.innerWidth <= 768 && dataPanelRef.current) {
      requestAnimationFrame(() => {
        dataPanelRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  };

  const goToPage = (delta) => {
    setBoxPage((prev) => Math.min(totalPages - 1, Math.max(0, prev + delta)));
  };

  return (
    <div className="projects-box-page">
      {/* Left: PKMN DATA-style detail panel */}
      <div className="pdata-panel" ref={dataPanelRef}>
        <div className="pdata-label">
          <span>PROJECT DATA</span>
        </div>

        {selectedProject ? (
          <ProjectDataContent project={selectedProject} />
        ) : (
          <div className="pdata-empty">No project selected</div>
        )}
      </div>

      {/* Right: the box grid */}
      <div className="box-panel">
        <div className="box-header">
          <button
            className="box-nav-arrow"
            onClick={() => goToPage(-1)}
            disabled={boxPage === 0}
            aria-label="Previous box"
          >
            ‹
          </button>
          <span className="box-header-title">BOX {boxPage + 1}</span>
          <button
            className="box-nav-arrow"
            onClick={() => goToPage(1)}
            disabled={boxPage >= totalPages - 1}
            aria-label="Next box"
          >
            ›
          </button>
        </div>

        <div className="box-grid">
          {visibleProjects.map((project) => (
            <button
              key={project.id}
              className={`box-slot ${selectedProject?.id === project.id ? 'selected' : ''}`}
              onClick={() => handleSlotClick(project)}
              type="button"
            >
              <span className="box-slot-image-wrap">
                <img
                  src={project.projectimage}
                  alt={project.title}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </span>
              <span className="box-slot-caption">{project.title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Shared detail content for the left-hand data panel
const ProjectDataContent = ({ project }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // The main image frame doubles as the carousel: slide 1 is always the
  // project's primary image, followed by any gallery screenshots.
  const images = project.galleryimages && project.galleryimages.length > 0
    ? [project.projectimage, ...project.galleryimages]
    : [project.projectimage];

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [project]);

  const handleNext = () => {
    setCurrentImageIndex(prev => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentImageIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <>
      <div className="pdata-image-frame">
        <img
          src={images[currentImageIndex]}
          alt={`${project.title}${images.length > 1 ? ` (${currentImageIndex + 1}/${images.length})` : ''}`}
          onClick={() => window.open(images[currentImageIndex], '_blank')}
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      </div>

      {images.length > 1 && (
        <div className="pdata-image-nav">
          <button onClick={handlePrev} className="carousel-control prev" aria-label="Previous image">‹</button>
          <span className="pdata-image-count">{currentImageIndex + 1} / {images.length}</span>
          <button onClick={handleNext} className="carousel-control next" aria-label="Next image">›</button>
        </div>
      )}

      <div className="pdata-info">
        <h1 className="pdata-title">{project.title}</h1>

        <div className="pdata-status-row">
          {project.status && (
            <span className={`status-text ${project.status.toLowerCase()}`}>
              {project.status.replace(/_/g, ' ')}
            </span>
          )}
          <button
            className="project-link-btn"
            onClick={() => project.link !== "N/A" && window.open(project.link, '_blank')}
            disabled={project.link === "N/A"}
          >
            View Project
          </button>
        </div>

        <p className="pdata-description">{project.description}</p>

        {/* Coding-language markers, styled after the ribbon/marking row in the
            Pokémon summary screen */}
        <div className="pdata-markers">
          {project.codinglanguages && project.codinglanguages.map((lang, idx) => (
            <span className="pdata-marker" key={idx} title={lang}>
              <i className={`devicon-${lang.toLowerCase()}-plain`}></i>
            </span>
          ))}
        </div>
      </div>
    </>
  );
};

export default Projects;
