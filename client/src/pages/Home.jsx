import React, { useState, useEffect } from 'react';
import MediumCard from '../components/MediumCard';
import { getMediums } from '../services/api';

const Home = () => {
  const [mediums, setMediums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMediums();
  }, []);

  const fetchMediums = async () => {
    try {
      setLoading(true);
      const data = await getMediums();
      setMediums(data);
      setError(null);
    } catch (err) {
      setError('Failed to load mediums. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMediumUpdate = (updatedMedium) => {
    setMediums(mediums.map(m => m._id === updatedMedium._id ? updatedMedium : m));
  };

  const handleMediumDelete = (deletedMediumId) => {
    setMediums(mediums.filter(m => m._id !== deletedMediumId));
  };

  if (loading) {
    return <div className="container loading">Loading mediums...</div>;
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="container">
      {mediums.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666', fontSize: '1.2rem' }}>
          No mediums yet. Create your first medium to get started!
        </p>
      ) : (
        <div className="grid">
          {mediums.map((medium) => (
            <MediumCard 
              key={medium._id} 
              medium={medium}
              onUpdate={handleMediumUpdate}
              onDelete={handleMediumDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;