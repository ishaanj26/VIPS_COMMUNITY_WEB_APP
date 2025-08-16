import React, { useState, useEffect } from 'react';
import { Search, Filter, X, MapPin, Tag, DollarSign, Star } from 'lucide-react';

const EnhancedSearchBar = ({ onSearch, onFilter }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [trendingTags, setTrendingTags] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    condition: '',
    location: {
      campus: '',
      hostel: '',
      block: ''
    },
    tags: [],
    negotiable: false,
    urgentSale: false,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'books', label: 'Books' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'furniture', label: 'Furniture' },
    { value: 'sports', label: 'Sports' },
    { value: 'vehicles', label: 'Vehicles' },
    { value: 'other', label: 'Other' }
  ];

  const conditions = [
    { value: '', label: 'Any Condition' },
    { value: 'new', label: 'Brand New' },
    { value: 'like-new', label: 'Like New' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'poor', label: 'Poor' }
  ];

  const sortOptions = [
    { value: 'createdAt', label: 'Latest First' },
    { value: 'price', label: 'Price' },
    { value: 'views', label: 'Most Viewed' },
    { value: 'featured', label: 'Featured' }
  ];

  useEffect(() => {
    fetchTrendingTags();
  }, []);

  const fetchTrendingTags = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/marketplace/trending-tags?limit=20`);
      const data = await response.json();
      if (data.success) {
        setTrendingTags(data.tags);
      }
    } catch (error) {
      console.error('Error fetching trending tags:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm, filters);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters };
    
    if (key.includes('.')) {
      const [parent, child] = key.split('.');
      newFilters[parent] = { ...newFilters[parent], [child]: value };
    } else {
      newFilters[key] = value;
    }
    
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const handleTagToggle = (tag) => {
    const currentTags = filters.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    
    handleFilterChange('tags', newTags);
  };

  const clearFilters = () => {
    const clearedFilters = {
      category: '',
      minPrice: '',
      maxPrice: '',
      condition: '',
      location: { campus: '', hostel: '', block: '' },
      tags: [],
      negotiable: false,
      urgentSale: false,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    };
    
    setFilters(clearedFilters);
    onFilter(clearedFilters);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.category) count++;
    if (filters.minPrice || filters.maxPrice) count++;
    if (filters.condition) count++;
    if (filters.location.campus || filters.location.hostel || filters.location.block) count++;
    if (filters.tags && filters.tags.length > 0) count++;
    if (filters.negotiable) count++;
    if (filters.urgentSale) count++;
    return count;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-3 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search items by title, description, or tags..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-2 border rounded-lg flex items-center gap-2 transition-colors ${
            showFilters 
              ? 'bg-blue-600 text-white border-blue-600' 
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Filter size={20} />
          Filters
          {getActiveFilterCount() > 0 && (
            <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {getActiveFilterCount()}
            </span>
          )}
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Search
        </button>
      </form>

      {/* Trending Tags Quick Access */}
      {trendingTags.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Tag size={16} className="text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Trending Tags:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {trendingTags.slice(0, 10).map((tagData) => (
              <button
                key={tagData.tag}
                onClick={() => handleTagToggle(tagData.tag)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  filters.tags && filters.tags.includes(tagData.tag)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                #{tagData.tag} ({tagData.count})
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Advanced Filters */}
      {showFilters && (
        <div className="border-t border-gray-200 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            {/* Condition */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
              <select
                value={filters.condition}
                onChange={(e) => handleFilterChange('condition', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {conditions.map(condition => (
                  <option key={condition.value} value={condition.value}>{condition.label}</option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <div className="flex gap-2">
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <select
                  value={filters.sortOrder}
                  onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="desc">High to Low</option>
                  <option value="asc">Low to High</option>
                </select>
              </div>
            </div>
          </div>

          {/* Price Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <DollarSign size={16} />
                Price Range (₹)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  placeholder="Min"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="py-2">-</span>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  placeholder="Max"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Location Filters */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <MapPin size={16} />
                Location
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={filters.location.campus}
                  onChange={(e) => handleFilterChange('location.campus', e.target.value)}
                  placeholder="Campus"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  value={filters.location.hostel}
                  onChange={(e) => handleFilterChange('location.hostel', e.target.value)}
                  placeholder="Hostel"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  value={filters.location.block}
                  onChange={(e) => handleFilterChange('location.block', e.target.value)}
                  placeholder="Block"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Selected Tags */}
          {filters.tags && filters.tags.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Selected Tags:</label>
              <div className="flex flex-wrap gap-2">
                {filters.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    #{tag}
                    <button
                      onClick={() => handleTagToggle(tag)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Checkboxes */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.negotiable}
                onChange={(e) => handleFilterChange('negotiable', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Negotiable Price</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.urgentSale}
                onChange={(e) => handleFilterChange('urgentSale', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Urgent Sale</span>
            </label>
          </div>

          {/* Filter Actions */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <X size={16} />
              Clear All Filters
            </button>
            
            <div className="text-sm text-gray-500">
              {getActiveFilterCount()} filter{getActiveFilterCount() !== 1 ? 's' : ''} applied
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedSearchBar;
