import React, { useState, useEffect, useCallback } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import '../../styles/Favorites.css';
import { app } from '../../firebase'; // Ensure Firebase is initialized
import { getImage } from '../../utils/getTvMovieImage';

const MediaPage = () => {
  const db = getFirestore(app);
  const [tvData, setTvData] = useState([]);
  const [moviesData, setMoviesData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch TV Show data from Firestore
const fetchTvShows = useCallback(async () => {
  const tvshowCollection = collection(db, 'tvshowData');
  const tvSnapshot = await getDocs(tvshowCollection);
  const tvList = tvSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  setTvData(tvList);
}, [db]);

  // Fetch Movies data from Firestore
const fetchMovies = useCallback(async () => {
  const movieCollection = collection(db, 'movieData');
  const movieSnapshot = await getDocs(movieCollection);
  const movieList = movieSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  setMoviesData(movieList);
}, [db]);

  // Fetch data when the component mounts
useEffect(() => {
  const fetchData = async () => {
    await Promise.all([fetchTvShows(), fetchMovies()]);
    setLoading(false);
  };
  fetchData();
}, [fetchTvShows, fetchMovies]);

  const handleCardClick = (item) => {
    setSelectedItem(item);
  };

  const closePopup = () => {
    setSelectedItem(null);
  };

  if (loading) {
    return <div>Loading...</div>; // You can add a better loading spinner here
  }

  return (
    <div className="media-page">
      <section className="media-section tv-section">
        <h2>TV Shows</h2>
        <h3>Some of my favorite TV shows</h3>
        <div className="scrollable-cards">
          {tvData.map((tv) => (
            <div key={tv.id} className="card" onClick={() => handleCardClick(tv)}>
              <img src={getImage(tv.image)} alt={tv.title} />
              <div className="card-content">
                <h3>{tv.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="media-section movies-section">
        <h2>Movies</h2>
        <h3>A few movies I've enjoyed recently</h3>
        <div className="scrollable-cards">
          {moviesData.map((movie) => (
            <div key={movie.id} className="card" onClick={() => handleCardClick(movie)}>
              <img src={getImage(movie.image)} alt={movie.title} />
              <h3>{movie.title}</h3>
              <p>{movie.author}</p>
            </div>
          ))}
        </div>
      </section>

      {selectedItem && (
        <div className="favorites-popup" onClick={closePopup}>
          <div className="favorites-popup-content" onClick={(e) => e.stopPropagation()}>
            <div className="favorites-popup-header">
              <img src={getImage(selectedItem.image)} alt={selectedItem.title} className="favorites-popup-image" />
              <div className="favorites-popup-titles">
                <h2 className="favorites-popup-title">{selectedItem.title}</h2>
                {selectedItem.years && <h4 className="favorites-popup-subtitle">{selectedItem.years}</h4>}
                <a href={selectedItem.externallink} target="_blank" rel="noopener noreferrer" className="favorites-popup-link">
                  {selectedItem.datatype.includes("tv") ? `Watch on ${selectedItem.streamingplatform}` : `Watch on ${selectedItem.streamingplatform}`}
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
