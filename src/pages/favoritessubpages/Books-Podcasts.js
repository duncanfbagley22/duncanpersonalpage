import React, { useState, useEffect } from 'react';
import '../../styles/Favorites.css';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '../../firebase'; // Make sure Firebase is initialized here

const MediaPage = () => {
  const [podcastsData, setPodcastsData] = useState([]);
  const [bookdata, setbookdata] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  
  const db = getFirestore(app); // Initialize Firestore

  // Fetch podcasts from Firestore
  useEffect(() => {
    const fetchPodcasts = async () => {
      const podcastSnapshot = await getDocs(collection(db, 'podcastData'));
      const podcastList = podcastSnapshot.docs.map(doc => doc.data());
      setPodcastsData(podcastList);
    };

    const fetchBooks = async () => {
      const booksSnapshot = await getDocs(collection(db, 'bookData')); // Assuming your books collection is named 'bookdata'
      const booksList = booksSnapshot.docs.map(doc => doc.data());
      setbookdata(booksList);
    };

    fetchPodcasts();
    fetchBooks();
  }, [db]);

  // Handle card click to open the popup
  const handleCardClick = (item) => {
    setSelectedItem(item);
  };

  // Close the popup
  const closePopup = () => {
    setSelectedItem(null);
  };

  return (
    <div className="media-page">
      {/* Podcasts Section */}
      <section className="media-section podcasts-section">
        <h2>Podcasts</h2>
        <h3>Some podcasts that I frequently listen to</h3>
        <div className="scrollable-cards">
          {podcastsData.map((podcast) => (
            <div key={podcast.id} className="card" onClick={() => handleCardClick(podcast)}>
              <img src={podcast.image} alt={podcast.title} />
              <div className="card-content">
                <h3>{podcast.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Books Section */}
      <section className="media-section books-section">
        <h2>Books</h2>
        <h3>A few books I've recently read</h3>
        <div className="scrollable-cards">
          {bookdata.map((book) => (
            <div key={book.id} className="card" onClick={() => handleCardClick(book)}>
              <img src={book.image} alt={book.title} />
              <h3>{book.title}</h3>
              <p>{book.author}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Popup for selected item */}
      {selectedItem && (
        <div className="favorites-popup" onClick={closePopup}>
          <div className="favorites-popup-content" onClick={(e) => e.stopPropagation()}>
            <div className="favorites-popup-header">
              <img src={selectedItem.image} alt={selectedItem.title} className="favorites-popup-image" />
              <div className="favorites-popup-titles">
                <h2 className="favorites-popup-title">{selectedItem.title}</h2>
                {selectedItem.author && <h4 className="favorites-popup-subtitle">{selectedItem.author}</h4>}
                <a href={selectedItem.externallink} target="_blank" rel="noopener noreferrer" className="favorites-popup-link">
                  {selectedItem.datatype === "podcast" ? "Listen on Spotify" : "View on Goodreads"}
                </a>
              </div>
            </div>
            <div className="favorites-popup-description">
              <p>{selectedItem.details}</p>
            </div>
            <button className="close-button" onClick={closePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaPage;
