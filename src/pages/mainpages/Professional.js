import React, { useState, useEffect, useRef } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '../../firebase.js'; // Import your Firebase app configuration
import '../../styles/Professional.css';
import PageBanner from '../../components/PageBanner.js';
import headShot from '../../favorites-images/other-images/headshot.jpeg';
import resume from '../../favorites-images/files/Bagley.D.032026.RESUME.pdf';

const Professional = () => {
  const [timelineData, setTimelineData] = useState([]); // State to store timeline data
  const [selected, setSelected] = useState(null); // To store the selected timeline item
  const [progress, setProgress] = useState(0);

  const db = getFirestore(app); // Initialize Firestore
  const timelineScrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollFades = () => {
    const el = timelineScrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
  };

  // Fetch timeline data from Firestore
  useEffect(() => {
    const fetchTimelineData = async () => {
      try {
        const timelineCollection = collection(db, 'timelineData');
        const timelineSnapshot = await getDocs(timelineCollection);
        const timelineList = timelineSnapshot.docs.map(doc => doc.data());
        
        setTimelineData(timelineList);
        setSelected(timelineList[0]); // Default to the first timeline item after data is fetched
      } catch (error) {
        console.error("Error fetching timeline data: ", error);
      }
    };

    fetchTimelineData();
  }, [db]);

  // Set the progress based on the selected item's position
  useEffect(() => {
    if (selected && selected.position !== undefined) { // Ensure selected is valid
      const positionOfSelection = selected.position;
      setProgress(positionOfSelection); // Set progress only if position exists
    }
  }, [selected]);

  // Recompute scroll-fade visibility once timeline data renders, and on resize
  useEffect(() => {
    updateScrollFades();
    window.addEventListener('resize', updateScrollFades);
    return () => window.removeEventListener('resize', updateScrollFades);
  }, [timelineData]);

  const handleSelect = (item) => {
    setSelected(item);
  };

  return (
    <div className="professional-container">
      <PageBanner title="Professional" subtitle="Career background and experience" />
      {/* Summary Section */}
      <div className="summary-section">
        <img src={headShot} alt="Headshot" className="headshot" />
        <div className="summary-text">
          <h1>Duncan Bagley</h1>
          <h3>Manager - Connor Group</h3>
          <div className="button-container">
            <a href="https://www.linkedin.com/in/duncan-bagley/" target="_blank" rel="noopener noreferrer">
              <button className="icon-button">
                <i className="devicon-linkedin-plain"></i>
                LinkedIn
              </button>
            </a>
            <a href={resume} target="_blank" rel="noopener noreferrer">
              <button className="icon-button">
                <i className="fa-solid fa-file-pdf"></i>
                Resume
              </button>
            </a>
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="timeline-container">
        <h2>Professional Timeline</h2>
        <p className="timeline-scroll-hint">&larr; scroll &rarr;</p>
        <div className="timeline-scroll-wrap">
          <div className="timeline-scroll" ref={timelineScrollRef} onScroll={updateScrollFades}>
            <div className="timeline" style={{ '--progress': progress }}>
      {timelineData
        .slice() // Create a copy to avoid mutating the original array
        .sort((a, b) => a.position - b.position) // Sort by position
        .map((item, index) => (
          <div
            key={index}
            className={`timeline-notch ${item.type} ${selected === item ? 'selected' : ''}`}
            style={{ left: `${item.position}%` }} // Position the notch
            onClick={() => handleSelect(item)}
          >
            {/* Alternate the label position based on the sorted index */}
            <span className={`date-label ${index % 2 === 0 ? 'date-above' : 'date-below'}`}>
              {item.date}
            </span>
          </div>
        ))}
    </div>
          </div>
          {canScrollLeft && <div className="timeline-scroll-fade timeline-scroll-fade-left" aria-hidden="true"></div>}
          {canScrollRight && <div className="timeline-scroll-fade timeline-scroll-fade-right" aria-hidden="true"></div>}
        </div>
      </div>

      {/* Dynamic Details Section */}
      <div className="details-section">
        {selected ? (
          <>
            <h3>{selected.jobTitle}</h3>
            <h4>{selected.company}</h4>
            <p className='job-location-duration'>{selected.duration} / {selected.location}</p>
            <div className="job-details">
              {selected.details ? (
                selected.details.replace(/\\n/g, '\n').split('\n').map((paragraph, idx) => (
                  <div key={idx} style={{ marginBottom: '1em' }}>{paragraph}</div>
                ))
              ) : (
                <p>Details not available.</p>
              )}
            </div>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default Professional;
