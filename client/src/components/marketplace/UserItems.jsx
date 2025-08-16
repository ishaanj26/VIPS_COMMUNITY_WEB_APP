import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../App';
import ItemCard from './ItemCard';
import { 
  Plus, 
  Package, 
  TrendingUp, 
  DollarSign, 
  Edit, 
  Trash2, 
  Eye, 
  MessageCircle,
  MoreVertical,
  Heart,
  MapPin,
  Calendar,
  ShoppingBag,
  AlertCircle
} from 'lucide-react';

const UserItems = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    sold: 0,
    inactive: 0,
    totalViews: 0,
    totalEarnings: 0
  });

  // Redirect if not logged in
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user) {
      fetchUserItems();
      fetchUserStats();
    }
  }, [user, activeTab]);

  const fetchUserItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/marketplace/user/${user._id}/items?status=${activeTab}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      const data = await response.json();

      if (data.success) {
        setItems(data.items);
      }
    } catch (error) {
      console.error('Error fetching user items:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/marketplace/user/${user._id}/stats`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      const data = await response.json();

      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/marketplace/items/${itemId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      const data = await response.json();

      if (data.success) {
        setItems(items.filter(item => item._id !== itemId));
        setShowDeleteModal(false);
        setItemToDelete(null);
        fetchUserStats(); // Refresh stats
      } else {
        alert('Failed to delete item: ' + data.message);
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item');
    }
  };

  const handleToggleStatus = async (itemId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/marketplace/items/${itemId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      const data = await response.json();

      if (data.success) {
        fetchUserItems(); // Refresh items
        fetchUserStats(); // Refresh stats
      } else {
        alert('Failed to update item status: ' + data.message);
      }
    } catch (error) {
      console.error('Error updating item status:', error);
      alert('Failed to update item status');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'sold':
        return 'text-blue-600 bg-blue-100';
      case 'inactive':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getTabCount = (status) => {
    switch (status) {
      case 'active':
        return stats.activeItems || 0;
      case 'sold':
        return stats.soldItems || 0;
      case 'inactive':
        return stats.inactiveItems || 0;
      default:
        return 0;
    }
  };

  const DeleteModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="text-red-600" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Delete Item</h3>
            <p className="text-sm text-gray-600">This action cannot be undone</p>
          </div>
        </div>
        
        <p className="text-gray-700 mb-6">
          Are you sure you want to delete "{itemToDelete?.title}"? This will remove the item permanently.
        </p>
        
        <div className="flex gap-3 justify-end">
          <button
            onClick={() => {
              setShowDeleteModal(false);
              setItemToDelete(null);
            }}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => handleDeleteItem(itemToDelete._id)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete Item
          </button>
        </div>
      </div>
    </div>
  );

  if (!user) {
    return null; // Will redirect
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Items</h1>
          <p className="text-gray-600">Manage your marketplace listings</p>
        </div>
        <Link
          to="/marketplace/add-item"
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors mt-4 sm:mt-0"
        >
          <Plus size={20} />
          Add New Item
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Items</p>
              <p className="text-2xl font-bold text-green-600">{stats.activeItems || 0}</p>
            </div>
            <TrendingUp className="text-green-500" size={24} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Items Sold</p>
              <p className="text-2xl font-bold text-blue-600">{stats.soldItems || 0}</p>
            </div>
            <ShoppingBag className="text-blue-500" size={24} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-purple-600">{stats.totalViews || 0}</p>
            </div>
            <Eye className="text-purple-500" size={24} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Earnings</p>
              <p className="text-2xl font-bold text-orange-600">{formatPrice(stats.totalEarnings || 0)}</p>
            </div>
            <DollarSign className="text-orange-500" size={24} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {['active', 'sold', 'inactive'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab} ({getTabCount(tab)})
            </button>
          ))}
        </nav>
      </div>

      {/* Items List */}
      {items.length > 0 ? (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item._id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex gap-6">
                {/* Item Image */}
                <div className="flex-shrink-0">
                  <img
                    src={item.images?.[0]?.url || '/api/placeholder/120/120'}
                    alt={item.title}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                </div>

                {/* Item Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {item.title}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <DollarSign size={16} />
                      <span className="font-semibold text-gray-900">{formatPrice(item.price)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      <span>Listed {formatDate(item.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye size={16} />
                      <span>{item.views || 0} views</span>
                    </div>
                    {item.location?.city && (
                      <div className="flex items-center gap-1">
                        <MapPin size={16} />
                        <span>{item.location.city}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => navigate(`/marketplace/item/${item._id}`)}
                      className="flex items-center gap-2 px-3 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <Eye size={16} />
                      View
                    </button>
                    
                    <button
                      onClick={() => navigate(`/marketplace/edit-item/${item._id}`)}
                      className="flex items-center gap-2 px-3 py-2 text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Edit size={16} />
                      Edit
                    </button>

                    {item.status === 'active' && (
                      <button
                        onClick={() => handleToggleStatus(item._id, item.status)}
                        className="flex items-center gap-2 px-3 py-2 text-yellow-600 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
                      >
                        <Package size={16} />
                        Deactivate
                      </button>
                    )}

                    {item.status === 'inactive' && (
                      <button
                        onClick={() => handleToggleStatus(item._id, item.status)}
                        className="flex items-center gap-2 px-3 py-2 text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                      >
                        <TrendingUp size={16} />
                        Activate
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setItemToDelete(item);
                        setShowDeleteModal(true);
                      }}
                      className="flex items-center gap-2 px-3 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="text-gray-400" size={48} />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No {activeTab} items found
          </h3>
          <p className="text-gray-600 mb-6">
            {activeTab === 'active' 
              ? "You don't have any active listings yet."
              : `You don't have any ${activeTab} items.`
            }
          </p>
          {activeTab === 'active' && (
            <button
              onClick={() => navigate('/marketplace/add-item')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              List Your First Item
            </button>
          )}
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && <DeleteModal />}
    </div>
  );
};

export default UserItems;
