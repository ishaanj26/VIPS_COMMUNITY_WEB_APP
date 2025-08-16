import React from 'react';
import SidebarLeft from '../../components/SidebarLeft';
import SidebarRight from '../../components/SidebarRight';
import Feed from '../../components/Feed';
import ForumPreview from '../../components/ForumPreview';
import CommunitiesPreview from '../../components/CommunitiesPreview';
import MarketplacePreview from '../../components/MarketplacePreview';
import Footer from '../../components/Footer';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Container */}
      <div className="flex min-h-screen pt-16">
        {/* Left Sidebar - Hidden on mobile and tablet */}
        <SidebarLeft />
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Center Content with Responsive Layout */}
          <main className="flex-1">
            <div className="flex flex-col xl:flex-row">
              {/* Feed Content - Full width on mobile, shrinks on desktop */}
              <div className="flex-1 min-w-0 px-2 sm:px-4 py-4 sm:py-6">
                <Feed />
              </div>
              
              {/* Right Sidebar - Hidden on mobile and smaller screens */}
              <SidebarRight />
            </div>
          </main>
          
          {/* Section Previews */}
          <ForumPreview />
          <CommunitiesPreview />
          <MarketplacePreview />
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
