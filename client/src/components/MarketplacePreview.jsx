import React from 'react';
import { ShoppingBag, ArrowRight, Star, DollarSign } from 'lucide-react';

const MarketplacePreview = () => {
  const featuredItems = [
    {
      id: 1,
      title: 'Programming Books Bundle',
      price: '₹1,200',
      seller: 'Arjun Sharma',
      rating: 4.8,
      image: '/api/placeholder/150/150'
    },
    {
      id: 2,
      title: 'Scientific Calculator',
      price: '₹800',
      seller: 'Priya Patel',
      rating: 4.9,
      image: '/api/placeholder/150/150'
    },
    {
      id: 3,
      title: 'Laptop Stand',
      price: '₹500',
      seller: 'Rahul Singh',
      rating: 4.7,
      image: '/api/placeholder/150/150'
    }
  ];

  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl p-8 text-white">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="flex-1 mb-6 lg:mb-0">
              <div className="flex items-center gap-3 mb-4">
                <ShoppingBag size={32} />
                <h2 className="text-3xl font-bold">Buy & Sell Marketplace</h2>
              </div>
              
              <p className="text-lg mb-4 opacity-90">
                Trade items with VIPS members safely and conveniently. From textbooks to electronics, find everything you need.
              </p>
              
              <div className="flex flex-wrap gap-4 text-sm mb-6">
                <div className="flex items-center gap-2">
                  <DollarSign size={16} />
                  <span>Best Prices</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star size={16} />
                  <span>Trusted Sellers</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShoppingBag size={16} />
                  <span>Wide Variety</span>
                </div>
              </div>
              
              <button className="inline-flex items-center gap-2 bg-white text-green-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold">
                Go to Marketplace
                <ArrowRight size={18} />
              </button>
            </div>

            {/* Featured Items Preview */}
            <div className="flex-shrink-0">
              <h3 className="text-lg font-semibold mb-4 text-center">Featured Items</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
                {featuredItems.map((item) => (
                  <div key={item.id} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-lg mx-auto mb-3 flex items-center justify-center">
                      <ShoppingBag size={24} className="text-white" />
                    </div>
                    <h4 className="font-medium text-sm mb-1">{item.title}</h4>
                    <p className="text-xl font-bold mb-1">{item.price}</p>
                    <div className="flex items-center justify-center gap-1 text-xs">
                      <Star size={12} className="fill-current text-yellow-300" />
                      <span>{item.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
          <div className="text-center p-4">
            <div className="text-2xl font-bold text-gray-900">500+</div>
            <div className="text-sm text-gray-600">Items Listed</div>
          </div>
          <div className="text-center p-4">
            <div className="text-2xl font-bold text-gray-900">200+</div>
            <div className="text-sm text-gray-600">Active Sellers</div>
          </div>
          <div className="text-center p-4">
            <div className="text-2xl font-bold text-gray-900">1000+</div>
            <div className="text-sm text-gray-600">Successful Trades</div>
          </div>
          <div className="text-center p-4">
            <div className="text-2xl font-bold text-gray-900">4.8</div>
            <div className="text-sm text-gray-600">Average Rating</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplacePreview;
