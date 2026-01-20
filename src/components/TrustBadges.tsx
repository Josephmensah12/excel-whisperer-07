
import React from 'react';
import { Shield, Package, Check } from "lucide-react";

const TrustBadges = () => {
  return (
    <section className="bg-gray-100 py-8 border-t border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          
          {/* Badge 1: Fully Insured Shipments */}
          <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="inline-flex h-14 w-14 rounded-full bg-blue-100 p-3 mb-4">
              <Shield className="h-8 w-8 text-blue-600" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Fully Insured Shipments</h3>
            <p className="text-sm text-gray-600">Your valuable items are protected throughout transit</p>
          </div>
          
          {/* Badge 2: Over 5,000 Deliveries */}
          <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="inline-flex h-14 w-14 rounded-full bg-green-100 p-3 mb-4">
              <Package className="h-8 w-8 text-green-600" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Over 5,000 Deliveries Completed</h3>
            <p className="text-sm text-gray-600">Years of experience serving the Ghanaian community</p>
          </div>
          
          {/* Badge 3: Customs Compliant */}
          <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="inline-flex h-14 w-14 rounded-full bg-purple-100 p-3 mb-4">
              <Check className="h-8 w-8 text-purple-600" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-semibold mb-2">100% Ghana Customs Compliant</h3>
            <p className="text-sm text-gray-600">Hassle-free customs clearance for all shipments</p>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
