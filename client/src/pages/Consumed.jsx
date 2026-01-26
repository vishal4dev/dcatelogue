import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMediums, getConsumedItemsByMedium } from '../services/api';
import './Wishlist.css';

const Consumed = () => {
  const [mediums, setMediums] = useState([]);
  const [consumedCounts, setConsumedCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchConsumedData();
  }, []);

  const fetchConsumedData = async () => {
    try {
      setLoading(true);
      const mediumsData = await getMediums();
      setMediums(mediumsData);

      // Fetch consumed count for each medium
      const counts = {};
      for (const medium of mediumsData) {
        try {
          const consumedItems = await getConsumedItemsByMedium(medium._id);
          counts[medium._id] = consumedItems.length;
        } catch (err) {
          counts[medium._id] = 0;
        }
      }
      setConsumedCounts(counts);
      setError(null);
    } catch (err) {
      setError('Failed to load consumed items. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container loading">Loading consumed items...</div>;
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">{error}</div>
      </div>
    );
  }

  const mediumsWithConsumed = mediums.filter(m => consumedCounts[m._id] > 0);

  if (mediumsWithConsumed.length === 0) {
    return (
      <div className="container">
        <div className="empty-state">
          <div className="empty-icon">✅</div>
          <h2>No consumed items yet</h2>
          <p>Start marking items as consumed! Go to any medium and mark items you've watched or read as consumed.</p>
          <Link to="/" className="btn">
            Browse Mediums
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="wishlist-header">
        <h2 className="wishlist-title">Consumed</h2>
        <div className="wishlist-stats">
          <span className="stat-badge">{mediumsWithConsumed.length} Mediums</span>
          <span className="stat-badge">
            {Object.values(consumedCounts).reduce((a, b) => a + b, 0)} Items
          </span>
        </div>
      </div>

      <div className="wishlist-grid">
        {mediumsWithConsumed.map((medium) => (
          <Link 
            key={medium._id} 
            to={`/consumed/${medium._id}`} 
            className="wishlist-card"
          >
            <div className="wishlist-card-image">
              <img src={medium.imageUrl} alt={medium.title} />
              <div className="wishlist-overlay"></div>
              <div className="wishlist-badge">{consumedCounts[medium._id]}</div>
            </div>
            <div className="wishlist-card-content">
              <h3 className="wishlist-card-title">{medium.title}</h3>
              <p className="wishlist-card-description">{medium.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Consumed;
