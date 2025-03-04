import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '../../firebase'; // Make sure Firebase is initialized here
import '../../styles/Favorites.css';

const MediaPage = () => {
  const [restaurantsData, setRestaurantsData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);

  const db = getFirestore(app); // Initialize Firestore

  useEffect(() => {
    // Fetch restaurant data from Firestore
    const fetchRestaurantData = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, 'restaurantData'));
        const restaurantList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRestaurantsData(restaurantList);
      } catch (error) {
        console.error('Error fetching restaurant data: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantData();
  }, [db]);

  const handleCardClick = (item) => {
    setSelectedItem(item);
  };

  const closePopup = () => {
    setSelectedItem(null);
  };

  return (
    <div className="media-page">
      <section className="media-section restaurants-section">
        <h2>Restaurants</h2>
        <h3>Great places I've eaten at</h3>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="restaurant-grid">
            {restaurantsData.map((restaurant) => (
              <div
                key={restaurant.id}
                className="restaurant-card"
                onClick={() => handleCardClick(restaurant)}
              >
                <img src={restaurant.image} alt={restaurant.name} />
                <h3>{restaurant.name}</h3>
                <p>{restaurant.location}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {selectedItem && (
        <div className="favorites-popup" onClick={closePopup}>
          <div className="favorites-popup-content" onClick={(e) => e.stopPropagation()}>
            <div className="favorites-popup-header">
              <img
                src={selectedItem.image}
                alt={selectedItem.name}
                className="favorites-popup-image"
              />
              <div className="favorites-popup-titles">
                <h2 className="favorites-popup-title">{selectedItem.name}</h2>
                <h4 className="favorites-popup-subtitle">
                  {selectedItem.typeoffood} - {selectedItem.location}
                </h4>
                <div className="links">
                  <a
                    href={selectedItem.externallink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="favorites-popup-link"
                  >
                    Website
                  </a>
                  <div className="favorites-popup-link">-</div>
                  <a
                    href={selectedItem.maplink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="favorites-popup-link second-link"
                  >
                    View on Google Maps
                  </a>
                </div>
              </div>
            </div>

            <div className="favorites-popup-description">
              <p>{selectedItem.details}</p>
            </div>
            <button className="close-button" onClick={closePopup}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaPage;
