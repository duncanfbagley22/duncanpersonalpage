import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Favorites.css';
import PageBanner from '../../components/PageBanner.js';

const Favorites = () => {
  return (
    <div className="favorites-page">
      <PageBanner title="Favorites" subtitle="Explore my top picks in TV, Movies, Books, Podcasts, and Food!" />
      
      <div className="card-container">
        <Link to="/tv-movies" className="card main-cards">
          <div className="pixel-icon-badge">
            <img src={`${process.env.PUBLIC_URL}/images/tvicon.png`} alt="TV and Movies" className="pixel-icon" />
          </div>
          <div className="card-content">
            <h2>TV and Movies</h2>
            <p>Discover my favorite shows and films</p>
          </div>
        </Link>

        <Link to="/books-podcasts" className="card main-cards">
          <div className="pixel-icon-badge">
            <img src={`${process.env.PUBLIC_URL}/images/bookpodcasticon.png`} alt="Books and Podcasts" className="pixel-icon" />
          </div>
          <div className="card-content">
            <h2>Books and Podcasts</h2>
            <p>Explore my go-to reads and listens</p>
          </div>
        </Link>

        <Link to="/restaurants" className="card main-cards">
          <div className="pixel-icon-badge">
            <img src={`${process.env.PUBLIC_URL}/images/foodicon.png`} alt="Food and Restaurants" className="pixel-icon" />
          </div>
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
