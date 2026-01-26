import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ItemCard from '../components/ItemCard';
import Modal from '../components/Modal';
import EditItemForm from '../components/EditItemForm';
import SearchFilters from '../components/SearchFilters';
import { getMedium, getConsumedItemsByMedium, updateItem } from '../services/api';

const ConsumedDetail = () => {
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
        getConsumedItemsByMedium(id)
      ]);
      setMedium(mediumData);
      setItems(itemsData);
      setFilteredItems(itemsData);
      setError(null);
    } catch (err) {
      setError('Failed to load consumed items. Please try again.');
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
    if (updatedItem.isConsumed) {
      // Item is still consumed, update it
      setItems(items.map(item => 
        item._id === updatedItem._id ? updatedItem : item
      ));
    } else {
      // Item moved out of consumed, remove it
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
            <p style={{ color: '#00c8c8', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: '600' }}>
              CONSUMED
            </p>
            <p style={{ color: '#b0b0b0', fontSize: '1.1rem', marginBottom: '2rem' }}>
              {medium.description}
            </p>
          </div>
          <div className="medium-detail-actions">
            <button 
              className="btn" 
              onClick={() => navigate('/consumed')}
              title="Back to consumed"
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
            No consumed items in this medium yet!
          </p>
        ) : filteredItems.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666', fontSize: '1.2rem' }}>
            No items match your search or filters. Try adjusting your criteria.
          </p>
        ) : (
          <div className={viewMode === 'grid' ? 'grid' : 'list-view'}>
            {filteredItems.map((item) => (
              <div key={item._id} className="wishlist-item-wrapper">
                <ItemCard 
                  item={item} 
                  viewMode={viewMode}
                  onUpdate={handleItemUpdate}
                  onDelete={handleItemDelete}
                  isWishlist={false}
                />
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

export default ConsumedDetail;
