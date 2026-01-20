
import React from "react";
import ShippingCalculator from "@/components/ShippingCalculator";
import Footer from "@/components/Footer";
import NavMenu from "@/components/NavMenu";
import { Calculator } from "lucide-react";

const ShippingCalculatorPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      <NavMenu />
      
      <div className="relative mb-8">
        <div className="absolute inset-0 z-0">
          <img 
            src="/lovable-uploads/9b323c79-5f84-4a76-b4f9-58377cd77404.png" 
            alt="Container ships" 
            className="w-full h-48 md:h-64 object-cover"
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        <div className="relative z-10 h-48 md:h-64 flex items-center justify-center">
          <div className="text-center text-white">
            <Calculator className="h-16 w-16 mx-auto mb-2" />
            <h1 className="text-3xl md:text-4xl font-bold">Shipping Calculator</h1>
            <p className="text-lg mt-2">Get instant cost estimates</p>
          </div>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <ShippingCalculator />
      </div>
      <Footer />
    </div>
  );
};

export default ShippingCalculatorPage;
