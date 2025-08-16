import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { UserContext } from '../../App';
import { 
  ArrowLeft, 
  Eye, 
  Clock, 
  MapPin, 
  MessageCircle, 
  Share2, 
  Heart,
  MoreHorizontal,
  CheckCircle,
  Trash2,
  Edit,
  Package
} from 'lucide-react';

const ItemDetails = () => {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  useEffect(() => {
    fetchItemDetails();
  }, [id]);

  const fetchItemDetails = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/marketplace/item/${id}`);
      const data = await response.json();
      
      if (data.success) {
        setItem(data.item);
      } else {
        console.error('Item not found');
        navigate('/marketplace');
      }
    } catch (error) {
      console.error('Error fetching item details:', error);
      navigate('/marketplace');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsSold = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/marketplace/item/${id}/mark-sold`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sellerId: user.id })
      });

      const data = await response.json();
      
      if (data.success) {
        setItem(prev => ({ ...prev, isSold: true }));
      } else {
        alert(data.message || 'Failed to mark as sold');
      }
    } catch (error) {
      console.error('Error marking as sold:', error);
      alert('Network error. Please try again.');
    }
  };

  const handleDeleteItem = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/marketplace/item/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sellerId: user.id })
      });

      const data = await response.json();
      
      if (data.success) {
        navigate('/marketplace');
      } else {
        alert(data.message || 'Failed to delete item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Network error. Please try again.');
    }
    setShowConfirmDelete(false);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      electronics: 'bg-blue-100 text-blue-700',
      books: 'bg-green-100 text-green-700',
      clothing: 'bg-purple-100 text-purple-700',
      furniture: 'bg-orange-100 text-orange-700',
      sports: 'bg-red-100 text-red-700',
      vehicles: 'bg-gray-100 text-gray-700',
      other: 'bg-yellow-100 text-yellow-700'
    };
    return colors[category] || colors.other;
  };

  const isOwner = user && item && user.id === item.sellerId;

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-96 bg-gray-200 rounded"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Item Not Found</h2>
        <Link to="/marketplace" className="text-blue-600 hover:text-blue-700">
          ← Back to Marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/marketplace')}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
      >
        <ArrowLeft size={20} />
        Back to Marketplace
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Images Section */}
        <div>
          {item.images && item.images.length > 0 ? (
            <div>
              {/* Main Image */}
              <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden mb-4">
                <img
                  src={item.images[currentImageIndex]}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Image Thumbnails */}
              {item.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {item.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 ${
                        currentImageIndex === index ? 'border-blue-500' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${item.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-400">
                <Package size={64} className="mx-auto mb-4" />
                <p>No images available</p>
              </div>
            </div>
          )}
        </div>

        {/* Details Section */}
        <div>
          {/* Title and Status */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(item.category)}`}>
                  {item.category}
                </span>
                {item.isSold && (
                  <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                    SOLD
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{item.title}</h1>
              <div className="text-4xl font-bold text-blue-600 mb-4">
                {formatPrice(item.price)}
              </div>
            </div>
            
            {isOwner && (
              <div className="relative">
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <MoreHorizontal size={20} />
                </button>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {item.description}
            </p>
          </div>

          {/* Item Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Item Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Clock size={16} />
                Listed on {formatDate(item.createdAt)}
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Eye size={16} />
                {item.views} views
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin size={16} />
                VIPS Campus
              </div>
            </div>
          </div>

          {/* Seller Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Seller Information</h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                {item.sellerName[0]}
              </div>
              <div>
                <p className="font-medium text-gray-900">{item.sellerName}</p>
                <p className="text-sm text-gray-600">{item.sellerEmail}</p>
                <p className="text-xs text-gray-500">Member since {formatDate(item.sellerId?.createdAt || item.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {isOwner ? (
              <div className="grid grid-cols-1 gap-3">
                {!item.isSold && (
                  <button
                    onClick={handleMarkAsSold}
                    className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle size={20} />
                    Mark as Sold
                  </button>
                )}
                <button className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                  <Edit size={20} />
                  Edit Item
                </button>
                <button
                  onClick={() => setShowConfirmDelete(true)}
                  className="flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash2 size={20} />
                  Delete Item
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                <button className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                  <MessageCircle size={20} />
                  Contact Seller
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <button className="flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <Heart size={18} />
                    Save
                  </button>
                  <button className="flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <Share2 size={18} />
                    Share
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Item</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this item? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteItem}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemDetails;
