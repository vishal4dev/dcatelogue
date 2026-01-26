import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMediums, getInProgressItemsByMedium } from '../services/api';
import './Wishlist.css';

const InProgress = () => {
  const [mediums, setMediums] = useState([]);
  const [inProgressCounts, setInProgressCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInProgressData();
  }, []);

  const fetchInProgressData = async () => {
    try {
      setLoading(true);
      const mediumsData = await getMediums();
      setMediums(mediumsData);

      // Fetch in progress count for each medium
      const counts = {};
      for (const medium of mediumsData) {
        try {
          const inProgressItems = await getInProgressItemsByMedium(medium._id);
          counts[medium._id] = inProgressItems.length;
        } catch (err) {
          counts[medium._id] = 0;
        }
      }
      setInProgressCounts(counts);
      setError(null);
    } catch (err) {
      setError('Failed to load in progress items. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container loading">Loading in progress items...</div>;
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">{error}</div>
      </div>
    );
  }

  const mediumsWithInProgress = mediums.filter(m => inProgressCounts[m._id] > 0);

  if (mediumsWithInProgress.length === 0) {
    return (
      <div className="container">
        <div className="empty-state">
          <div className="empty-icon">⏳</div>
          <h2>No items in progress yet</h2>
          <p>Start tracking items you're currently consuming! Go to any medium and mark items as in progress.</p>
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
        <h2 className="wishlist-title">In Progress</h2>
        <div className="wishlist-stats">
          <span className="stat-badge">{mediumsWithInProgress.length} Mediums</span>
          <span className="stat-badge">
            {Object.values(inProgressCounts).reduce((a, b) => a + b, 0)} Items
          </span>
        </div>
      </div>

      <div className="wishlist-grid">
        {mediumsWithInProgress.map((medium) => (
          <Link 
            key={medium._id} 
            to={`/inprogress/${medium._id}`}
            className="wishlist-card"
          >
            <div className="wishlist-card-image">
              <img src={medium.imageUrl} alt={medium.title} />
              <div className="wishlist-overlay"></div>
              <div className="wishlist-badge">{inProgressCounts[medium._id]}</div>
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

export default InProgress;
