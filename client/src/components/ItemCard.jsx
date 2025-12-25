import React, { useState } from 'react';
import StarRating from './StarRating';
import { updateItem, deleteItem } from '../services/api';
import Modal from './Modal';
import EditItemForm from './EditItemForm';
import './ItemCard.css';

const ItemCard = ({ item, viewMode = 'grid', onUpdate, onDelete, isWishlist = false }) => {
  const [rating, setRating] = useState(item.rating);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleRatingChange = async (newRating) => {
    setIsUpdating(true);
    try {
      const updatedItem = await updateItem(item._id, { rating: newRating });
      setRating(newRating);
      if (onUpdate) {
        onUpdate(updatedItem);
      }
    } catch (error) {
      console.error('Error updating rating:', error);
      alert('Failed to update rating');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleWishlistToggle = async () => {
    try {
      const updatedItem = await updateItem(item._id, { isWishlist: !item.isWishlist });
      if (onUpdate) {
        onUpdate(updatedItem);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      alert('Failed to update wishlist status');
    }
  };

  const handleEditSuccess = (updatedItem) => {
    setIsEditModalOpen(false);
    setRating(updatedItem.rating);
    if (onUpdate) {
      onUpdate(updatedItem);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${item.title}"?`)) {
      try {
        setIsDeleting(true);
        await deleteItem(item._id);
        if (onDelete) {
          onDelete(item._id);
        }
      } catch (error) {
        console.error('Failed to delete item:', error);
        alert('Failed to delete item. Please try again.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  if (viewMode === 'list') {
    return (
      <>
        <div className="item-card list-mode">
          <div className="item-image-container-list">
            <img src={item.imageUrl} alt={item.title} className="item-image" />
          </div>
          <div className="item-content-list">
            <h3 className="item-title">{item.title}</h3>
            <p className="item-creator">by {item.creator}</p>
            <p className="item-description">{item.description}</p>
            <div className="item-rating">
              <StarRating 
                rating={rating} 
                onRatingChange={handleRatingChange}
                readonly={isUpdating}
              />
            </div>
          </div>
          <div className="item-actions">
            <button 
              className={`btn-icon btn-wishlist ${item.isWishlist ? 'active' : ''}`}
              onClick={handleWishlistToggle}
              title={item.isWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              ♡
            </button>
            <button 
              className="btn-icon btn-edit" 
              onClick={() => setIsEditModalOpen(true)}
              title="Edit item"
            >
              ✎
            </button>
            <button 
              className="btn-icon btn-delete" 
              onClick={handleDelete}
              disabled={isDeleting}
              title="Delete item"
            >
              🗑
            </button>
          </div>
        </div>

        <Modal 
          isOpen={isEditModalOpen} 
          onClose={() => setIsEditModalOpen(false)}
          title="Edit Item"
        >
          <EditItemForm 
            item={item}
            onSuccess={handleEditSuccess}
            onCancel={() => setIsEditModalOpen(false)}
          />
        </Modal>
      </>
    );
  }

  return (
    <>
      <div className="item-card-wrapper">
        <div className="item-card grid-mode">
          <div className="item-image-container">
            <img src={item.imageUrl} alt={item.title} className="item-image" />
            <div className="item-overlay"></div>
          </div>
          <div className="item-content">
            <h3 className="item-title">{item.title}</h3>
            <p className="item-creator">by {item.creator}</p>
            <div className="item-rating">
              <StarRating 
                rating={rating} 
                onRatingChange={handleRatingChange}
                readonly={isUpdating}
              />
            </div>
            <p className="item-description">{item.description}</p>
          </div>
        </div>
        <div className="item-actions">
          <button 
            className={`btn-icon btn-wishlist ${item.isWishlist ? 'active' : ''}`}
            onClick={handleWishlistToggle}
            title={item.isWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            ♡
          </button>
          <button 
            className="btn-icon btn-edit" 
            onClick={() => setIsEditModalOpen(true)}
            title="Edit item"
          >
            ✎
          </button>
          <button 
            className="btn-icon btn-delete" 
            onClick={handleDelete}
            disabled={isDeleting}
            title="Delete item"
            >
            🗑
          </button>
        </div>
      </div>

      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Item"
      >
        <EditItemForm 
          item={item}
          onSuccess={handleEditSuccess}
          onCancel={() => setIsEditModalOpen(false)}
        />
      </Modal>
    </>
  );
};

export default ItemCard;