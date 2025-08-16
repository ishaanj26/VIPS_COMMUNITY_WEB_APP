import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, 
  Eye, 
  MapPin, 
  Calendar, 
  Star, 
  Badge,
  MessageCircle,
  Tag,
  Verified,
  Clock,
  AlertTriangle
} from 'lucide-react';

const EnhancedItemCard = ({ item, onLike, onMessage }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/marketplace/item/${item._id}`);
  };

  const handleLikeClick = (e) => {
    e.stopPropagation();
    if (onLike) {
      onLike(item._id);
    }
  };

  const handleMessageClick = (e) => {
    e.stopPropagation();
    if (onMessage) {
      onMessage(item.sellerId._id || item.sellerId, item._id);
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const itemDate = new Date(date);
    const diffInHours = Math.floor((now - itemDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return itemDate.toLocaleDateString();
  };

  const getConditionColor = (condition) => {
    switch (condition) {
      case 'new': return 'bg-green-100 text-green-800';
      case 'like-new': return 'bg-blue-100 text-blue-800';
      case 'good': return 'bg-yellow-100 text-yellow-800';
      case 'fair': return 'bg-orange-100 text-orange-800';
      case 'poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const primaryImage = item.images?.find(img => img.isPrimary)?.url || 
                      item.images?.[0]?.url || 
                      item.images?.[0] || 
                      'https://via.placeholder.com/300x200?text=No+Image';

  return (
    <div
      onClick={handleCardClick}
      className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
    >
      {/* Image Container */}
      <div className="relative">
        <img
          src={primaryImage}
          alt={item.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Status Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {item.isSold && (
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              SOLD
            </span>
          )}
          
          {item.urgentSale && !item.isSold && (
            <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
              <AlertTriangle size={12} />
              URGENT
            </span>
          )}
          
          {item.featured && !item.isSold && (
            <span className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
              <Star size={12} />
              FEATURED
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleLikeClick}
            className={`bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors ${
              item.isLiked ? 'text-red-500' : 'text-gray-600'
            }`}
          >
            <Heart size={16} className={item.isLiked ? 'fill-current' : ''} />
          </button>
          {!item.isSold && (
            <button
              onClick={handleMessageClick}
              className="bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
            >
              <MessageCircle size={16} className="text-blue-500" />
            </button>
          )}
        </div>

        {/* Image Count */}
        {item.images && item.images.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/50 text-white px-2 py-1 rounded text-xs">
            +{item.images.length - 1} more
          </div>
        )}

        {/* Video Indicator */}
        {item.videos && item.videos.length > 0 && (
          <div className="absolute bottom-3 left-3 bg-black/50 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
            Video
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-900 text-lg group-hover:text-blue-600 transition-colors line-clamp-2">
            {item.title}
          </h3>
          {item.condition && (
            <span className={`px-2 py-1 rounded text-xs font-medium ${getConditionColor(item.condition)}`}>
              {item.condition}
            </span>
          )}
        </div>

        {/* Price and Negotiable */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-green-600">
              ₹{item.price.toLocaleString()}
            </span>
            {item.negotiable && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                Negotiable
              </span>
            )}
          </div>
        </div>

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {item.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
              >
                <Tag size={10} />
                #{tag}
              </span>
            ))}
            {item.tags.length > 3 && (
              <span className="text-xs text-gray-500">
                +{item.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Description */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {item.description}
        </p>

        {/* Location */}
        {item.location && (item.location.campus || item.location.hostel) && (
          <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
            <MapPin size={14} />
            <span>
              {item.location.campus}
              {item.location.hostel && ` • ${item.location.hostel}`}
              {item.location.block && ` • ${item.location.block}`}
            </span>
          </div>
        )}

        {/* Seller Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
              {item.sellerName?.charAt(0).toUpperCase() || item.sellerId?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium text-gray-900">
                  {item.sellerName || item.sellerId?.name || 'Unknown'}
                </span>
                {(item.sellerVerified || item.sellerId?.verified) && (
                  <Verified className="text-blue-500" size={12} />
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Eye size={12} />
              {item.views || 0}
            </div>
            <div className="flex items-center gap-1">
              <Clock size={12} />
              {formatTimeAgo(item.createdAt)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedItemCard;
