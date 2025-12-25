import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ItemCard from '../components/ItemCard';
import Modal from '../components/Modal';
import EditMediumForm from '../components/EditMediumForm';
import { getMedium, getItemsByMedium, deleteMedium } from '../services/api';

const MediumDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [medium, setMedium] = useState(null);
  const [items, setItems] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [mediumData, itemsData] = await Promise.all([
        getMedium(id),
        getItemsByMedium(id)
      ]);
      setMedium(mediumData);
      setItems(itemsData);
      setError(null);
    } catch (err) {
      setError('Failed to load data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleItemUpdate = (updatedItem) => {
    setItems(items.map(item => 
      item._id === updatedItem._id ? updatedItem : item
    ));
  };

  const handleItemDelete = (deletedItemId) => {
    setItems(items.filter(item => item._id !== deletedItemId));
  };

  const handleEditMediumSuccess = (updatedMedium) => {
    setMedium(updatedMedium);
    setIsEditModalOpen(false);
  };

  const handleDeleteMedium = async () => {
    if (window.confirm(`Are you sure you want to delete "${medium.title}"? This will also delete all items in this medium.`)) {
      try {
        setIsDeleting(true);
        await deleteMedium(medium._id);
        navigate('/');
      } catch (error) {
        console.error('Failed to delete medium:', error);
        alert('Failed to delete medium. Please try again.');
        setIsDeleting(false);
      }
    }
  };

  if (loading) {
    return <div className="container loading">Loading...</div>;
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">{error}</div>
      </div>
    );
  }

  if (!medium) {
    return <div className="container">Medium not found</div>;
  }

  return (
    <>
      <div className="container">
        <div className="medium-detail-header">
          <div>
            <p style={{ color: '#b0b0b0', fontSize: '1.1rem', marginBottom: '2rem' }}>
              {medium.description}
            </p>
          </div>
          <div className="medium-detail-actions">
            <button 
              className="btn btn-icon-text" 
              onClick={() => setIsEditModalOpen(true)}
              title="Edit medium"
            >
              ✎ Edit
            </button>
            <button 
              className="btn btn-danger" 
              onClick={handleDeleteMedium}
              disabled={isDeleting}
              title="Delete medium"
            >
              🗑 Delete
            </button>
          </div>
        </div>

        <div className="view-toggle">
          <button 
            className={viewMode === 'grid' ? 'active' : ''} 
            onClick={() => setViewMode('grid')}
          >
            Grid View
          </button>
          <button 
            className={viewMode === 'list' ? 'active' : ''} 
            onClick={() => setViewMode('list')}
          >
            List View
          </button>
        </div>

        {items.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666', fontSize: '1.2rem' }}>
            No items in this medium yet. Add your first item!
          </p>
        ) : (
          <div className={viewMode === 'grid' ? 'grid' : 'list-view'}>
            {items.map((item) => (
              <ItemCard 
                key={item._id} 
                item={item} 
                viewMode={viewMode}
                onUpdate={handleItemUpdate}
                onDelete={handleItemDelete}
              />
            ))}
          </div>
        )}
      </div>

      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Medium"
      >
        <EditMediumForm 
          medium={medium}
          onSuccess={handleEditMediumSuccess}
          onCancel={() => setIsEditModalOpen(false)}
        />
      </Modal>
    </>
  );
};

export default MediumDetail;