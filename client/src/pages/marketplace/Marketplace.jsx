import React, { useState, useEffect, useContext } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../App';
import MarketplaceHome from '../../components/marketplace/MarketplaceHome';
import AddItem from '../../components/marketplace/AddItem';
import ItemDetails from '../../components/marketplace/ItemDetails';
import UserItems from '../../components/marketplace/UserItems';
import { Plus, Package, TrendingUp, Users } from 'lucide-react';

const Marketplace = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalItems: 0,
    activeItems: 0,
    totalSellers: 0,
    categoriesCount: 0
  });

  useEffect(() => {
    fetchMarketplaceStats();
  }, []);

  const fetchMarketplaceStats = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/marketplace/items?limit=1`);
      const data = await response.json();
      if (data.success) {
        setStats(prev => ({
          ...prev,
          totalItems: data.pagination.totalItems,
          activeItems: data.pagination.totalItems
        }));
      }

      // Fetch categories for count
      const categoriesResponse = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/marketplace/categories`);
      const categoriesData = await categoriesResponse.json();
      if (categoriesData.success) {
        setStats(prev => ({
          ...prev,
          categoriesCount: categoriesData.categories.length
        }));
      }
    } catch (error) {
      console.error('Error fetching marketplace stats:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">VIPS Marketplace</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Buy and sell items within the VIPS community. Connect with fellow students and find great deals!
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Package className="text-yellow-300" size={24} />
              </div>
              <div className="text-2xl font-bold">{stats.activeItems}</div>
              <div className="text-sm opacity-80">Active Items</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="text-green-300" size={24} />
              </div>
              <div className="text-2xl font-bold">{stats.totalSellers}</div>
              <div className="text-sm opacity-80">Sellers</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="text-orange-300" size={24} />
              </div>
              <div className="text-2xl font-bold">{stats.categoriesCount}</div>
              <div className="text-sm opacity-80">Categories</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Package className="text-pink-300" size={24} />
              </div>
              <div className="text-2xl font-bold">4.8</div>
              <div className="text-sm opacity-80">Avg Rating</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {user ? (
              <>
                <Link
                  to="/marketplace/add-item"
                  className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  <Plus size={20} />
                  Sell an Item
                </Link>
                <Link
                  to="/marketplace/my-items"
                  className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg font-semibold transition-colors backdrop-blur-sm"
                >
                  My Items
                </Link>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Login to Sell Items
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<MarketplaceHome />} />
        <Route path="/add-item" element={<AddItem />} />
        <Route path="/item/:id" element={<ItemDetails />} />
        <Route path="/my-items" element={<UserItems />} />
      </Routes>
    </div>
  );
};

export default Marketplace;
