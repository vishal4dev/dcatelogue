import React, { useState } from 'react';
import './SearchFilters.css';

const SearchFilters = ({ onSearch, onFilter, onSort }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [ratingRange, setRatingRange] = useState([0, 5]);
  const [sortBy, setSortBy] = useState('newest');
  const [dateFilter, setDateFilter] = useState('all');

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const handleRatingChange = (e) => {
    const value = parseFloat(e.target.value);
    if (e.target.name === 'ratingMin') {
      const newRange = [value, ratingRange[1]];
      setRatingRange(newRange);
      onFilter({ ratingRange: newRange, dateFilter });
    } else {
      const newRange = [ratingRange[0], value];
      setRatingRange(newRange);
      onFilter({ ratingRange: newRange, dateFilter });
    }
  };

  const handleDateFilterChange = (e) => {
    const filter = e.target.value;
    setDateFilter(filter);
    onFilter({ ratingRange, dateFilter: filter });
  };

  const handleSortChange = (e) => {
    const sort = e.target.value;
    setSortBy(sort);
    onSort(sort);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setRatingRange([0, 5]);
    setSortBy('newest');
    setDateFilter('all');
    onSearch('');
    onFilter({ ratingRange: [0, 5], dateFilter: 'all' });
    onSort('newest');
  };

  return (
    <div className="search-filters-container">
      <div className="search-section">
        <input
          type="text"
          placeholder="🔍 Search mediums, items, creators..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
        />
        <button 
          className={`filter-toggle-btn ${showFilters ? 'active' : ''}`}
          onClick={() => setShowFilters(!showFilters)}
          title="Toggle filters"
        >
          ⚙ Filters
        </button>
      </div>

      {showFilters && (
        <div className="filters-panel">
          <div className="filter-group">
            <label>Rating Range:</label>
            <div className="rating-inputs">
              <input
                type="number"
                name="ratingMin"
                min="0"
                max="5"
                step="0.5"
                value={ratingRange[0]}
                onChange={handleRatingChange}
                placeholder="Min"
                className="rating-input"
              />
              <span className="rating-separator">to</span>
              <input
                type="number"
                name="ratingMax"
                min="0"
                max="5"
                step="0.5"
                value={ratingRange[1]}
                onChange={handleRatingChange}
                placeholder="Max"
                className="rating-input"
              />
            </div>
          </div>

          <div className="filter-group">
            <label>Date Added:</label>
            <select 
              value={dateFilter}
              onChange={handleDateFilterChange}
              className="filter-select"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Sort By:</label>
            <select 
              value={sortBy}
              onChange={handleSortChange}
              className="filter-select"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="rating-high">Highest Rated</option>
              <option value="rating-low">Lowest Rated</option>
              <option value="liked">Most Liked</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>

          <button 
            className="reset-btn"
            onClick={resetFilters}
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;
