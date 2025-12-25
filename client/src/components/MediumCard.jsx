import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteMedium } from '../services/api';
import Modal from './Modal';
import EditMediumForm from './EditMediumForm';
import './MediumCard.css';

const MediumCard = ({ medium, onUpdate, onDelete }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEditSuccess = (updatedMedium) => {
    setIsEditModalOpen(false);
    if (onUpdate) {
      onUpdate(updatedMedium);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${medium.title}"? This will also delete all items in this medium.`)) {
      try {
        setIsDeleting(true);
        await deleteMedium(medium._id);
        if (onDelete) {
          onDelete(medium._id);
        }
      } catch (error) {
        console.error('Failed to delete medium:', error);
        alert('Failed to delete medium. Please try again.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <>
      <div className="medium-card-wrapper">
        <Link to={`/medium/${medium._id}`} className="medium-card">
          <div className="medium-image-container">
            <img src={medium.imageUrl} alt={medium.title} className="medium-image" />
            <div className="medium-overlay"></div>
          </div>
          <div className="medium-content">
            <h3 className="medium-title">{medium.title}</h3>
            <p className="medium-description">{medium.description}</p>
          </div>
        </Link>
        <div className="medium-actions">
          <button 
            className="btn-icon btn-edit" 
            onClick={() => setIsEditModalOpen(true)}
            title="Edit medium"
          >
            ✎
          </button>
          <button 
            className="btn-icon btn-delete" 
            onClick={handleDelete}
            disabled={isDeleting}
            title="Delete medium"
          >
            🗑
          </button>
        </div>
      </div>

      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Medium"
      >
        <EditMediumForm 
          medium={medium}
          onSuccess={handleEditSuccess}
          onCancel={() => setIsEditModalOpen(false)}
        />
      </Modal>
    </>
  );
};

export default MediumCard;