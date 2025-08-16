import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Eye, MapPin, Badge, Package } from 'lucide-react';

const ItemCard = ({ item, viewMode = 'grid' }) => {
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
      month: 'short',
      day: 'numeric'
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

  if (viewMode === 'list') {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Image */}
          <div className="flex-shrink-0">
            <Link to={`/marketplace/item/${item._id}`}>
              <div className="w-full md:w-32 h-32 bg-gray-200 rounded-lg overflow-hidden">
                {item.images && item.images.length > 0 ? (
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Package size={32} />
                  </div>
                )}
              </div>
            </Link>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between">
              <div className="flex-1">
                <Link to={`/marketplace/item/${item._id}`}>
                  <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-1">
                    {item.title}
                  </h3>
                </Link>
                
                <p className="text-gray-600 mt-1 line-clamp-2">
                  {item.description}
                </p>

                <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                    {item.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    {formatDate(item.createdAt)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye size={14} />
                    {item.views} views
                  </div>
                </div>
              </div>

              <div className="mt-4 md:mt-0 md:ml-4 text-right">
                <div className="text-2xl font-bold text-gray-900">
                  {formatPrice(item.price)}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  by {item.sellerName}
                </div>
                {item.isSold && (
                  <span className="inline-block mt-2 px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                    SOLD
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow group">
      {/* Image */}
      <Link to={`/marketplace/item/${item._id}`} className="block relative">
        <div className="aspect-square bg-gray-200 overflow-hidden">
          {item.images && item.images.length > 0 ? (
            <img
              src={item.images[0]}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <Package size={48} />
            </div>
          )}
        </div>
        
        {item.isSold && (
          <div className="absolute top-2 right-2">
            <span className="bg-red-500 text-white px-2 py-1 text-xs font-bold rounded-full">
              SOLD
            </span>
          </div>
        )}
        
        <div className="absolute top-2 left-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
            {item.category}
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        <Link to={`/marketplace/item/${item._id}`}>
          <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 mb-2">
            {item.title}
          </h3>
        </Link>
        
        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
          {item.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="text-xl font-bold text-gray-900">
            {formatPrice(item.price)}
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Eye size={12} />
            {item.views}
          </div>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <div className="text-sm text-gray-500">
            by {item.sellerName}
          </div>
          <div className="text-xs text-gray-400">
            {formatDate(item.createdAt)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
