import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Favorites.css';

const Favorites = () => {
  return (
    <div className="favorites-page">
      <h1>Favorites</h1>
      <h3>Explore my top picks in TV, Movies, Books, Podcasts, and Food!</h3>
      
      <div className="card-container">
        <Link to="/tv-movies" className="card main-cards">
          <img src={`${process.env.PUBLIC_URL}/images/tvicon.png`} alt="TV and Movies" />
          <div className="card-content">
            <h2>TV and Movies</h2>
            <p>Discover my favorite shows and films</p>
          </div>
        </Link>

        <Link to="/books-podcasts" className="card main-cards">
          <img src={`${process.env.PUBLIC_URL}/images/bookpodcasticon.png`} alt="Books and Podcasts" />
          <div className="card-content">
            <h2>Books and Podcasts</h2>
            <p>Explore my go-to reads and listens</p>
          </div>
        </Link>

        <Link to="/restaurants" className="card main-cards">
          <img src={`${process.env.PUBLIC_URL}/images/foodicon.png`} alt="Food and Restaurants" />
          <div className="card-content">
            <h2>Restaurants</h2>
            <p>Check out my favorite restaurants</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Favorites;
