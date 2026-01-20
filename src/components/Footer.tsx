
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <p className="text-gray-400">
              <a href="mailto:info@goldcoastlogistics.com" className="hover:text-blue-400 transition-colors">
                Email: info@goldcoastlogistics.com
              </a>
            </p>
            <p className="text-gray-400">
              <a href="tel:+18322959347" className="hover:text-blue-400 transition-colors">
                Call/Text: (832) 295-9347
              </a>
            </p>
            <p className="text-gray-400">
              <a href="https://wa.me/17138261087" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                WhatsApp: (713) 826-1087
              </a>
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Locations</h3>
            <p className="text-gray-400">United States Office:</p>
            <p className="text-gray-400">5301 Polk Street Bldg 14</p>
            <p className="text-gray-400">UNIT C4</p>
            <p className="text-gray-400">Houston, TX 77023</p>
            <p className="text-gray-400 mt-2">Ghana Office</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <p className="text-gray-400">Air Freight</p>
            <p className="text-gray-400">Sea Freight</p>
            <p className="text-gray-400">Custom Clearance</p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <div className="flex justify-center space-x-4 mb-4">
            <Link to="/terms-of-service" className="hover:text-blue-400 transition-colors">
              Terms of Service
            </Link>
            <Link to="/privacy-policy" className="hover:text-blue-400 transition-colors">
              Privacy Policy
            </Link>
          </div>
          <p>&copy; 2024 Gold Coast Global Logistics. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
