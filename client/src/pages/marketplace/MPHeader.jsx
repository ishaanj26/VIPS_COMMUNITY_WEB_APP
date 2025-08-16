import { useState, useEffect, useContext } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { UserContext } from '../../App';
import EnhancedMarketplaceHome from './Home/MPHome';
import AddItem from '../../components/marketplace/AddItem';
import EnhancedItemDetails from '../../components/marketplace/EnhancedItemDetails';
import UserItems from '../../components/marketplace/UserItems';
import Messages from '../../components/marketplace/Messages';
import { Plus, MessageCircle } from 'lucide-react';
import Stats from './Stats';

const Marketplace = () => {
  const { user } = useContext(UserContext);
  const [stats, setStats] = useState({
    totalItems: 0,
    activeListings: 0,
    totalSellers: 0,
    categoriesCount: 0,
    categories: []
  });

  useEffect(() => {
    fetchMarketplaceStats();
  }, []);

  const fetchMarketplaceStats = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/marketplace/stats`);
      const data = await response.json();
      if (data.success) {
        setStats({
          ...data.stats,
          categoriesCount: data.stats.categoriesBreakdown.length,
          categories: data.stats.categoriesBreakdown
        });
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
          <Stats stats={stats} />
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
                <Link
                  to="/marketplace/messages"
                  className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg font-semibold transition-colors backdrop-blur-sm"
                >
                  <MessageCircle size={20} />
                  Messages
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
        <Route path="/" element={<EnhancedMarketplaceHome stats={stats} setStats={setStats} />} />
        <Route path="/add-item" element={<AddItem fetchStats={fetchMarketplaceStats} />} />
        <Route path="/item/:id" element={<EnhancedItemDetails />} />
        <Route path="/edit-item/:id" element={<AddItem />} />
        <Route path="/my-items" element={<UserItems  stats={stats} setStats={setStats} fetchUserStats ={fetchMarketplaceStats} />} />
        <Route path="/messages" element={<Messages />} />
      </Routes>
    </div>
  );
};

export default Marketplace;