import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createItem, getMediums } from '../services/api';
import StarRating from '../components/StarRating';

const CreateItem = () => {
  const navigate = useNavigate();
  const [mediums, setMediums] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    creator: '',
    imageUrl: '',
    rating: 0,
    description: '',
    medium: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMediums();
  }, []);

  const fetchMediums = async () => {
    try {
      const data = await getMediums();
      setMediums(data);
    } catch (err) {
      setError('Failed to load mediums. Please create a medium first.');
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRatingChange = (rating) => {
    setFormData({
      ...formData,
      rating
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.creator || !formData.imageUrl || 
        !formData.description || !formData.medium) {
      setError('All fields except rating are required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const newItem = await createItem(formData);
      navigate(`/medium/${newItem.medium._id}`);
    } catch (err) {
      setError('Failed to create item. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (mediums.length === 0 && !error) {
    return (
      <div className="container">
        <p style={{ textAlign: 'center', color: '#666', fontSize: '1.2rem' }}>
          Please create a medium first before adding items.
        </p>
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button className="btn" onClick={() => navigate('/create-medium')}>
            Create Medium
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {error && <div className="error">{error}</div>}

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="medium">Medium</label>
            <select
              id="medium"
              name="medium"
              value={formData.medium}
              onChange={handleChange}
            >
              <option value="">Select a medium</option>
              {mediums.map((medium) => (
                <option key={medium._id} value={medium._id}>
                  {medium.title}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., The Thing, Providence"
            />
          </div>

          <div className="form-group">
            <label htmlFor="creator">Creator</label>
            <input
              type="text"
              id="creator"
              name="creator"
              value={formData.creator}
              onChange={handleChange}
              placeholder="e.g., John Carpenter, Alan Moore"
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
            />
          </div>

          <div className="form-group">
            <label>Rating</label>
            <StarRating 
              rating={formData.rating} 
              onRatingChange={handleRatingChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Your thoughts about this item..."
            />
          </div>

          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Creating...' : 'Add Item'}
          </button>
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={() => navigate('/')}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateItem;