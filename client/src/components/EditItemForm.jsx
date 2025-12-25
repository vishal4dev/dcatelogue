import React, { useState, useEffect } from 'react';
import { updateItem, getMediums } from '../services/api';
import StarRating from './StarRating';

const EditItemForm = ({ item, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    creator: '',
    imageUrl: '',
    rating: 0,
    description: '',
    medium: '',
    isWishlist: false
  });
  const [mediums, setMediums] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMediums, setLoadingMediums] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMediums();
  }, []);

  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title,
        creator: item.creator,
        imageUrl: item.imageUrl,
        rating: item.rating,
        description: item.description,
        medium: item.medium._id,
        isWishlist: item.isWishlist || false
      });
    }
  }, [item]);

  const fetchMediums = async () => {
    try {
      setLoadingMediums(true);
      const data = await getMediums();
      setMediums(data);
      setError(null);
    } catch (err) {
      setError('Failed to load mediums.');
      console.error(err);
    } finally {
      setLoadingMediums(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRatingChange = (rating) => {
    setFormData(prevState => ({
      ...prevState,
      rating
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.creator.trim() || !formData.imageUrl.trim() || 
        !formData.description.trim() || !formData.medium) {
      setError('All fields are required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const updatedItem = await updateItem(item._id, formData);
      if (onSuccess) {
        onSuccess(updatedItem);
      }
    } catch (err) {
      setError('Failed to update item. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loadingMediums) {
    return <div className="loading">Loading mediums...</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      
      <div className="form-group">
        <label htmlFor="medium">Medium</label>
        <select
          id="medium"
          name="medium"
          value={formData.medium}
          onChange={handleChange}
          required
        >
          <option value="">Select a medium</option>
          {mediums.map(medium => (
            <option key={medium._id} value={medium._id}>
              {medium.title}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="title">Item Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., The Thing, Dune, Inception"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="creator">Creator/Author</label>
        <input
          type="text"
          id="creator"
          name="creator"
          value={formData.creator}
          onChange={handleChange}
          placeholder="e.g., John Carpenter, Frank Herbert, Christopher Nolan"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="imageUrl">Image URL</label>
        <input
          type="url"
          id="imageUrl"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          placeholder="https://example.com/image.jpg"
          required
        />
      </div>

      <div className="form-group checkbox-group">
        <label htmlFor="isWishlist" className="checkbox-label">
          <input
            type="checkbox"
            id="isWishlist"
            name="isWishlist"
            checked={formData.isWishlist}
            onChange={handleChange}
          />
          <span>Mark as Wishlist (to consume later)</span>
        </label>
      </div>

      {!formData.isWishlist && (
        <div className="form-group">
          <label>Rating</label>
          <StarRating 
            rating={formData.rating} 
            onRatingChange={handleRatingChange}
          />
        </div>
      )}

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Write your thoughts about this item..."
          rows="4"
          required
        />
      </div>

      <div className="form-actions">
        <button 
          type="submit" 
          className="btn" 
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update Item'}
        </button>
        {onCancel && (
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default EditItemForm;
