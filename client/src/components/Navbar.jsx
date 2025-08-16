import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../App';
import { LogIn, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="bg-gray-900 shadow-lg fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">

        {/* Brand Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-yellow-400 text-2xl font-bold tracking-wide hover:scale-105 transition-transform duration-200"
          onClick={closeMenu}
        >
          VIPS<span className="text-white">Connect</span>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-8 items-center">
          <li><Link to="/" className="text-white font-medium hover:text-yellow-400 transition-colors">Home</Link></li>
          <li><Link to="/feed" className="text-white font-medium hover:text-yellow-400 transition-colors">Feed</Link></li>
          <li><Link to="/forum" className="text-white font-medium hover:text-yellow-400 transition-colors">Forum</Link></li>
          <li><Link to="/communities" className="text-white font-medium hover:text-yellow-400 transition-colors">Communities</Link></li>
          <li><Link to="/marketplace" className="text-white font-medium hover:text-yellow-400 transition-colors">Market Place</Link></li>
        </ul>

        {/* Desktop User Section */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <Link to="/user" className="flex items-center gap-2 bg-gray-800 px-3 py-1 rounded-full hover:bg-gray-700">
                <span className="w-8 h-8 rounded-full bg-yellow-400 text-gray-900 flex items-center justify-center font-bold">
                  {user.name[0]}
                </span>
                <span className="text-white font-medium cursor-pointer">{user.name}</span>
              </Link>
            </>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1 bg-yellow-400 text-gray-900 font-medium px-4 py-2 rounded-md hover:bg-yellow-300 transition-colors"
            >
              <LogIn size={18} /> Login
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(true)}
        >
          <Menu size={26} />
        </button>
      </div>

      {/* Mobile Slide-out Menu */}
      {/* Mobile Slide-out Menu with transition and fixed overlay color */}
      <div
        className={`fixed inset-0 z-40 md:hidden pointer-events-none transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        style={{ background: isOpen ? 'rgba(0,0,0,0.5)' : 'transparent' }}
      >
        {/* Slide-out Menu (Slide from Right) */}
        <div
          className={`absolute top-0 right-0 w-64 h-full bg-gray-900 shadow-lg p-6 flex flex-col gap-6 transform transition-transform duration-300 ease-in-out pointer-events-auto ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          {/* Close Button */}
          <button
            className="self-end text-white"
            onClick={closeMenu}
          >
            <X size={26} />
          </button>

          {/* Menu Links */}
          <ul className="flex flex-col gap-4 mt-4">
            <li><Link to="/" className="text-white font-medium hover:text-yellow-400" onClick={closeMenu}>Home</Link></li>
            <li><Link to="/feed" className="text-white font-medium hover:text-yellow-400" onClick={closeMenu}>Feed</Link></li>
            <li><Link to="/forum" className="text-white font-medium hover:text-yellow-400" onClick={closeMenu}>Forum</Link></li>
            <li><Link to="/communities" className="text-white font-medium hover:text-yellow-400" onClick={closeMenu}>Communities</Link></li>
            <li><Link to="/marketplace" className="text-white font-medium hover:text-yellow-400" onClick={closeMenu}>Buy/Sell</Link></li>
          </ul>

          {/* User Section */}
          <div className="mt-auto">
            {user ? (
              <>
                <Link to="/user" className="flex items-center gap-2 bg-gray-800 px-3 py-1 rounded-full mb-4 hover:bg-gray-700">
                  <span className="w-8 h-8 rounded-full bg-yellow-400 text-gray-900 flex items-center justify-center font-bold">
                    {user.name[0]}
                  </span>
                  <span className="text-white font-medium cursor-pointer">{user.name}</span>
                </Link>
                
              </>
            ) : (
              <Link
                to="/login"
                className="w-full flex items-center justify-center gap-1 bg-yellow-400 text-gray-900 font-medium px-4 py-2 rounded-md hover:bg-yellow-300 transition-colors"
                onClick={closeMenu}
              >
                <LogIn size={18} /> Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
