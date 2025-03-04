import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '../../firebase.js'; // Import your Firebase app configuration
import '../../styles/Professional.css';

const Professional = () => {
  const [timelineData, setTimelineData] = useState([]); // State to store timeline data
  const [selected, setSelected] = useState(null); // To store the selected timeline item
  const [progress, setProgress] = useState(0);

  const db = getFirestore(app); // Initialize Firestore

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

  const handleSelect = (item) => {
    setSelected(item);
  };

  return (
    <div className="professional-container">
      {/* Summary Section */}
      <div className="summary-section">
        <img src="https://firebasestorage.googleapis.com/v0/b/duncan-personal-page.appspot.com/o/otherimagesandfiles%2Fheadshot.jpeg?alt=media&token=12b347f2-f654-4060-86e1-b7d5231ad053" alt="Headshot" className="headshot" />
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
            <a href="https://firebasestorage.googleapis.com/v0/b/duncan-personal-page.appspot.com/o/otherimagesandfiles%2FBagley.D.102024.RESUME.pdf?alt=media&token=d3349f3f-7727-41f5-848c-446affb6d6e4" target="_blank" rel="noopener noreferrer">
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
