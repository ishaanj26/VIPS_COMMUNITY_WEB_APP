import { Package, TrendingUp, Users } from 'lucide-react';

const Stats = ({ stats }) => {
  const items = [
    {
      icon: <Package className="text-yellow-300" size={24} />,
      value: stats.activeListings,
      label: "Active Items",
    },
    {
      icon: <Users className="text-green-300" size={24} />,
      value: stats.totalSellers,
      label: "Sellers",
    },
    {
      icon: <TrendingUp className="text-orange-300" size={24} />,
      value: stats.categoriesCount,
      label: "Categories",
    },
    {
      icon: <Package className="text-pink-300" size={24} />,
      value: "4.8",
      label: "Avg Rating",
    },
  ];

  return (
    <div>
      {/* Quick Stats */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">VIPS Marketplace</h1>
        <p className="text-xl opacity-90 max-w-2xl mx-auto">
          Buy and sell items within the VIPS community. Connect with fellow students and find great deals!
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {items.map((item, i) => (
          <div key={i} className="text-center">
            <div className="flex items-center justify-center mb-2">{item.icon}</div>
            <div className="text-2xl font-bold">{item.value}</div>
            <div className="text-sm opacity-80">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stats;