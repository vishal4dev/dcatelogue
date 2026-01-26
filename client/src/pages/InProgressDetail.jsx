import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ItemCard from '../components/ItemCard';
import Modal from '../components/Modal';
import EditItemForm from '../components/EditItemForm';
import SearchFilters from '../components/SearchFilters';
import { getMedium, getInProgressItemsByMedium, updateItem } from '../services/api';
import './InProgressDetail.css';

const InProgressDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [medium, setMedium] = useState(null);
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [viewMode, setViewMode] = useState('list');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ ratingRange: [0, 5], dateFilter: 'all' });
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchData();
  }, [id]);

  useEffect(() => {
    applySearchAndFilters();
  }, [searchQuery, filters, sortBy, items]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [mediumData, itemsData] = await Promise.all([
        getMedium(id),
        getInProgressItemsByMedium(id)
      ]);
      setMedium(mediumData);
      setItems(itemsData);
      setFilteredItems(itemsData);
      setError(null);
    } catch (err) {
      setError('Failed to load in progress items. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const applySearchAndFilters = () => {
    let filtered = [...items];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.creator.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
      );
    }

    // Rating filter
    filtered = filtered.filter(item =>
      item.rating >= filters.ratingRange[0] && item.rating <= filters.ratingRange[1]
    );

    // Date filter
    if (filters.dateFilter !== 'all') {
      filtered = filterByDate(filtered, filters.dateFilter);
    }

    // Sort
    filtered = applySort(filtered, sortBy);

    setFilteredItems(filtered);
  };

  const applySort = (itemsToSort, sort) => {
    const sorted = [...itemsToSort];
    switch (sort) {
      case 'oldest':
        sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'rating-high':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'rating-low':
        sorted.sort((a, b) => a.rating - b.rating);
        break;
      case 'name':
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'liked':
        sorted.sort((a, b) => (b.isLiked ? 1 : 0) - (a.isLiked ? 1 : 0));
        break;
      case 'newest':
      default:
        sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }
    return sorted;
  };

  const filterByDate = (itemsToFilter, dateFilter) => {
    const now = new Date();
    let startDate;

    switch (dateFilter) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        return itemsToFilter;
    }

    return itemsToFilter.filter(item => new Date(item.createdAt) >= startDate);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSort = (sort) => {
    setSortBy(sort);
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

  const handleItemUpdate = (updatedItem) => {
    if (updatedItem.isInProgress) {
      // Item is still in progress, update it
      setItems(items.map(item => 
        item._id === updatedItem._id ? updatedItem : item
      ));
    } else {
      // Item moved out of in progress, remove it
      setItems(items.filter(item => item._id !== updatedItem._id));
    }
  };

  const handleItemDelete = (deletedItemId) => {
    setItems(items.filter(item => item._id !== deletedItemId));
  };

  return (
    <>
      <div className="container">
        <div className="medium-detail-header">
          <div>
            <p style={{ color: '#ff6b35', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: '600' }}>
              IN PROGRESS
            </p>
            <p style={{ color: '#b0b0b0', fontSize: '1.1rem', marginBottom: '2rem' }}>
              {medium.description}
            </p>
          </div>
          <div className="medium-detail-actions">
            <button 
              className="btn" 
              onClick={() => navigate('/inprogress')}
              title="Back to in progress"
            >
              ← Back
            </button>
          </div>
        </div>

        <SearchFilters 
          onSearch={handleSearch}
          onFilter={handleFilter}
          onSort={handleSort}
        />

        <div className="view-toggle">
          <button 
            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            title="Grid view"
          >
            ⊞ Grid
          </button>
          <button 
            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
            title="List view"
          >
            ☰ List
          </button>
        </div>

        {filteredItems.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666', fontSize: '1.2rem' }}>
            No items in progress in this medium
          </p>
        ) : (
          <div className={viewMode === 'grid' ? 'grid' : 'list-view'}>
            {filteredItems.map((item) => (
              <ItemCard 
                key={item._id}
                item={item} 
                viewMode={viewMode}
                onUpdate={handleItemUpdate}
                onDelete={handleItemDelete}
                isWishlist={false}
              />
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
            onSuccess={() => {
              setIsEditModalOpen(false);
              fetchData();
            }}
            onCancel={() => setIsEditModalOpen(false)}
          />
        </Modal>
      )}
    </>
  );
};

export default InProgressDetail;
