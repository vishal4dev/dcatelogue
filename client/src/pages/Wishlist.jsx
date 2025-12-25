import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMediums, getWishlistItemsByMedium } from '../services/api';
import './Wishlist.css';

const Wishlist = () => {
  const [mediums, setMediums] = useState([]);
  const [wishlistCounts, setWishlistCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWishlistData();
  }, []);

  const fetchWishlistData = async () => {
    try {
      setLoading(true);
      const mediumsData = await getMediums();
      setMediums(mediumsData);

      // Fetch wishlist count for each medium
      const counts = {};
      for (const medium of mediumsData) {
        try {
          const wishlistItems = await getWishlistItemsByMedium(medium._id);
          counts[medium._id] = wishlistItems.length;
        } catch (err) {
          counts[medium._id] = 0;
        }
      }
      setWishlistCounts(counts);
      setError(null);
    } catch (err) {
      setError('Failed to load wishlist. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container loading">Loading wishlist...</div>;
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">{error}</div>
      </div>
    );
  }

  const mediumsWithWishlist = mediums.filter(m => wishlistCounts[m._id] > 0);

  if (mediumsWithWishlist.length === 0) {
    return (
      <div className="container">
        <div className="empty-state">
          <div className="empty-icon">🎯</div>
          <h2>Your wishlist is empty</h2>
          <p>Start adding items to your wishlist! Go to "Add Item" and check the wishlist checkbox for items you want to consume later.</p>
          <Link to="/create-item" className="btn">
            Add Item to Wishlist
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="wishlist-header">
        <h2 className="wishlist-title">Wishlist</h2>
        <div className="wishlist-stats">
          <span className="stat-badge">{mediumsWithWishlist.length} Mediums</span>
          <span className="stat-badge">
            {Object.values(wishlistCounts).reduce((a, b) => a + b, 0)} Items
          </span>
        </div>
      </div>

      <div className="wishlist-grid">
        {mediumsWithWishlist.map((medium) => (
          <Link 
            key={medium._id} 
            to={`/wishlist/${medium._id}`} 
            className="wishlist-card"
          >
            <div className="wishlist-card-image">
              <img src={medium.imageUrl} alt={medium.title} />
              <div className="wishlist-overlay"></div>
              <div className="wishlist-badge">{wishlistCounts[medium._id]}</div>
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

export default Wishlist;
