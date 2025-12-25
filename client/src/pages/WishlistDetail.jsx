import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ItemCard from '../components/ItemCard';
import Modal from '../components/Modal';
import EditItemForm from '../components/EditItemForm';
import { getMedium, getWishlistItemsByMedium, updateItem } from '../services/api';

const WishlistDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [medium, setMedium] = useState(null);
  const [items, setItems] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [mediumData, itemsData] = await Promise.all([
        getMedium(id),
        getWishlistItemsByMedium(id)
      ]);
      setMedium(mediumData);
      setItems(itemsData);
      setError(null);
    } catch (err) {
      setError('Failed to load wishlist items. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleItemUpdate = (updatedItem) => {
    if (updatedItem.isWishlist) {
      // Item is still in wishlist, update it
      setItems(items.map(item => 
        item._id === updatedItem._id ? updatedItem : item
      ));
    } else {
      // Item moved out of wishlist, remove it
      setItems(items.filter(item => item._id !== updatedItem._id));
    }
  };

  const handleItemDelete = (deletedItemId) => {
    setItems(items.filter(item => item._id !== deletedItemId));
  };

  const handleConsumeItem = async (itemId) => {
    try {
      const updatedItem = await updateItem(itemId, { isWishlist: false });
      handleItemUpdate(updatedItem);
    } catch (error) {
      console.error('Failed to move item to consumed:', error);
      alert('Failed to move item to consumed');
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
            <p style={{ color: '#ffd700', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: '600' }}>
              WISHLIST
            </p>
            <p style={{ color: '#b0b0b0', fontSize: '1.1rem', marginBottom: '2rem' }}>
              {medium.description}
            </p>
          </div>
          <div className="medium-detail-actions">
            <button 
              className="btn" 
              onClick={() => navigate('/wishlist')}
              title="Back to wishlist"
            >
              ← Back
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
            No items in this wishlist yet!
          </p>
        ) : (
          <div className={viewMode === 'grid' ? 'grid' : 'list-view'}>
            {items.map((item) => (
              <div key={item._id} className="wishlist-item-wrapper">
                <ItemCard 
                  item={item} 
                  viewMode={viewMode}
                  onUpdate={handleItemUpdate}
                  onDelete={handleItemDelete}
                  isWishlist={true}
                />
                <button 
                  className="btn btn-consume"
                  onClick={() => handleConsumeItem(item._id)}
                  title="Move to consumed"
                >
                  ✓ Consumed
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedItem && (
        <Modal 
          isOpen={isEditModalOpen} 
          onClose={() => setIsEditModalOpen(false)}
          title="Edit Item"
        >
          <EditItemForm 
            item={selectedItem}
            onSuccess={(updatedItem) => {
              handleItemUpdate(updatedItem);
              setIsEditModalOpen(false);
            }}
            onCancel={() => setIsEditModalOpen(false)}
          />
        </Modal>
      )}
    </>
  );
};

export default WishlistDetail;
