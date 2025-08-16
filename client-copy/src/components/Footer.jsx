import React from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Heart } from 'lucide-react';

const Footer = () => {
  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Events', href: '/events' },
    { name: 'Members', href: '/members' },
    { name: 'Contact', href: '/contact' }
  ];

  const communityLinks = [
    { name: 'Discussion Forum', href: '/forum' },
    { name: 'Communities', href: '/communities' },
    { name: 'Marketplace', href: '/marketplace' },
    { name: 'Help Center', href: '/help' },
    { name: 'Guidelines', href: '/guidelines' }
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', color: 'hover:text-blue-600' },
    { icon: Twitter, href: '#', color: 'hover:text-blue-400' },
    { icon: Instagram, href: '#', color: 'hover:text-pink-600' },
    { icon: Linkedin, href: '#', color: 'hover:text-blue-700' }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-bold text-yellow-400">VIPS</span>
              <span className="text-2xl font-bold">Connect</span>
            </div>
            <p className="text-gray-400 mb-4 leading-relaxed">
              Connecting VIPS students through innovation, collaboration, and community building. Join us in creating meaningful connections and opportunities.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className={`p-2 bg-gray-800 rounded-lg transition-colors ${social.color}`}
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Community</h3>
            <ul className="space-y-2">
              {communityLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-yellow-400" />
                <a
                  href="mailto:community@vips.edu"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  community@vips.edu
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-yellow-400" />
                <span className="text-gray-400">+91 11 2345 6789</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-yellow-400 mt-1" />
                <span className="text-gray-400">
                  VIPS, Plot No. 249, Udyog Vihar Phase IV, Gurugram, Haryana 122015
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-gray-400">
              <span>&copy; {new Date().getFullYear()} VIPS Community. All rights reserved.</span>
            </div>
            
            <div className="flex items-center gap-1 text-gray-400">
              <span>Made with</span>
              <Heart size={16} className="text-red-500 fill-current" />
              <span>by VIPS Students</span>
            </div>
            
            <div className="flex gap-6 text-sm">
              <a href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
