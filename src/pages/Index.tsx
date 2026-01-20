
import React from "react";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Footer from "@/components/Footer";
import NavMenu from "@/components/NavMenu";
import RollingCities from "@/components/RollingCities";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      <RollingCities />
      <div className="pt-14 mt-6">
        <NavMenu />
        <div className="fixed top-24 right-4 z-30 animate-pulse">
          <Badge 
            variant="rateCard" 
            to="/frequently-shipped-items"
            className="text-sm"
          >
            View Rate Card
          </Badge>
        </div>
        <Hero />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Services />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Index;
