
import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Calculator, FileTerminal, CreditCard } from 'lucide-react';

const Services = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16 mt-12">
      <Link to="/request-call" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
        <div className="flex flex-col items-center mb-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <Phone className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-4 text-center">Request a Call</h3>
        <p className="text-gray-600 text-center">Get a personalized consultation for your shipping needs</p>
      </Link>
      <Link to="/shipping-calculator" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
        <div className="flex flex-col items-center mb-4">
          <div className="bg-green-100 p-3 rounded-full">
            <Calculator className="h-6 w-6 text-green-600" />
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-4 text-center">Shipping Calculator</h3>
        <p className="text-gray-600 text-center">Calculate your shipping costs instantly</p>
      </Link>
      <Link to="/terms-of-service" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
        <div className="flex flex-col items-center mb-4">
          <div className="bg-amber-100 p-3 rounded-full">
            <FileTerminal className="h-6 w-6 text-amber-600" />
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-4 text-center">Terms of Service</h3>
        <p className="text-gray-600 text-center">Our shipping terms and conditions for your reference</p>
      </Link>
      <Link to="/frequently-shipped-items" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
        <div className="flex flex-col items-center mb-4">
          <div className="bg-purple-100 p-3 rounded-full">
            <CreditCard className="h-6 w-6 text-purple-600" />
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-4 text-center">View Rate Card</h3>
        <p className="text-gray-600 text-center">Check our rates for frequently shipped items</p>
      </Link>
    </div>
  );
};

export default Services;
