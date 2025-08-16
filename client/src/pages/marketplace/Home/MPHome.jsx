import { useState, useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { UserContext } from '../../../App';
import EnhancedSearchBar from '../../../components/marketplace/EnhancedSearchBar';
import EnhancedItemCard from '../../../components/marketplace/EnhancedItemCard';
import Pagination from '../../../components/marketplace/Pagination';
import { 
  Plus, 
  BarChart3, 
  TrendingUp, 
  Users, 
  Package,
  Grid3X3,
  List,
} from 'lucide-react';
import QuickActions from './QuickActions';
import NoItemsFound from './NoItemsFound';

const EnhancedMarketplaceHome = ({stats,setStats}) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  // const [categories, setCategories] = useState([]);
  const [currentFilters, setCurrentFilters] = useState({});

  // Initialize filters from URL params
  useEffect(() => {
    const initialFilters = {
      category: searchParams.get('category') || '',
      search: searchParams.get('search') || '',
      page: parseInt(searchParams.get('page')) || 1,
      limit: 12
    };
    setCurrentFilters(initialFilters);
    fetchItems(initialFilters);
  }, [searchParams]);

  const fetchItems = async (filters = currentFilters) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          if (key === 'location' && typeof value === 'object') {
            Object.entries(value).forEach(([locKey, locValue]) => {
              if (locValue) queryParams.set(`location.${locKey}`, locValue);
            });
          } else if (key === 'tags' && Array.isArray(value)) {
            value.forEach(tag => queryParams.append('tags', tag));
          } else {
            queryParams.set(key, value);
          }
        }
      });

      // Add userId to check liked status
      if (user && user._id) {
        queryParams.set('userId', user._id);
      }

      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/marketplace/items?${queryParams}`
      );
      const data = await response.json();

      if (data.success) {
        setItems(data.items);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm, filters) => {
    const newFilters = { ...filters, search: searchTerm, page: 1 };
    setCurrentFilters(newFilters);
    updateURL(newFilters);
    fetchItems(newFilters);
  };

  const handleFilter = (filters) => {
    const newFilters = { ...filters, page: 1 };
    setCurrentFilters(newFilters);
    updateURL(newFilters);
    fetchItems(newFilters);
  };

  const handlePageChange = (page) => {
    const newFilters = { ...currentFilters, page };
    setCurrentFilters(newFilters);
    updateURL(newFilters);
    fetchItems(newFilters);
  };

  const updateURL = (filters) => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined && value !== false) {
        if (key === 'location' && typeof value === 'object') {
          Object.entries(value).forEach(([locKey, locValue]) => {
            if (locValue) params.set(`${key}.${locKey}`, locValue);
          });
        } else if (key === 'tags' && Array.isArray(value) && value.length > 0) {
          value.forEach(tag => params.append(key, tag));
        } else if (key !== 'limit') {
          params.set(key, value);
        }
      }
    });
    
    setSearchParams(params);
  };

  const handleLikeItem = async (itemId) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/user/toggle-item-like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('userId')}`,
        },
        body: JSON.stringify({ 
          itemId: itemId,
          userId: user._id 
        })
      });

      const data = await response.json();

      if (data.success) {
        // Update the items state to reflect the like status
        setItems(items.map(item => 
          item._id === itemId 
            ? { ...item, isLiked: data.isLiked }
            : item
        ));
      } else {
        console.error('Failed to toggle like:', data.error);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleMessageSeller = (sellerId, itemId) => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/messages?to=${sellerId}&item=${itemId}`);
  };

  const handleCategoryClick = (category) => {
    const newFilters = { ...currentFilters, category: category._id, page: 1 };
    setCurrentFilters(newFilters);
    updateURL(newFilters);
    fetchItems(newFilters);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">VIPS Marketplace</h1>
          <p className="text-gray-600 mt-1">Buy and sell within your community</p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* View Mode Toggle */}
          <div className="flex border border-gray-300 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Grid3X3 size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <List size={20} />
            </button>
          </div>

          {/* Add Item Button */}
          <button
            onClick={() => navigate('/marketplace/add-item')}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            Sell Item
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {Object.keys(stats).length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="text-blue-600" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.activeListings?.toLocaleString() || 0}
                </div>
                <div className="text-sm text-gray-600">Active Listings</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="text-green-600" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.soldItems?.toLocaleString() || 0}
                </div>
                <div className="text-sm text-gray-600">Items Sold</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="text-purple-600" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.totalSellers?.toLocaleString() || 0}
                </div>
                <div className="text-sm text-gray-600">Active Sellers</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <BarChart3 className="text-orange-600" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.categoriesBreakdown && stats.categoriesBreakdown?.length || 0}
                </div>
                <div className="text-sm text-gray-600">Categories</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Categories Quick Filter */}
      {stats.categoriesBreakdown && stats.categoriesBreakdown.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Browse by Category</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleCategoryClick({ _id: '' })}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                !currentFilters.category 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({stats.activeListings || 0})
            </button>
            {stats.categoriesBreakdown.map((category) => (
              <button
                key={category._id}
                onClick={() => handleCategoryClick(category)}
                className={`px-4 py-2 rounded-lg text-sm transition-colors capitalize ${
                  currentFilters.category === category._id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category._id} ({category.count})
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <EnhancedSearchBar onSearch={handleSearch} onFilter={handleFilter} />

      {/* Results Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-gray-600">
          {loading ? (
            'Loading...'
          ) : (
            `Showing ${items.length} of ${pagination.totalItems || 0} items`
          )}
        </div>
        
        {pagination.totalItems > 0 && (
          <div className="text-sm text-gray-500">
            Page {pagination.currentPage} of {pagination.totalPages}
          </div>
        )}
      </div>

      {/* Items Grid/List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-300"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-6 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : items.length > 0 ? (
        <>
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {items.map((item) => (
              <EnhancedItemCard
                key={item._id}
                item={item}
                onLike={handleLikeItem}
                onMessage={handleMessageSeller}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      ) : (
        <NoItemsFound navigate={navigate} />
      )}

      {/* Quick Actions Sidebar */}
    {user && <QuickActions navigate={navigate} />}
    </div>
  );
};

export default EnhancedMarketplaceHome;