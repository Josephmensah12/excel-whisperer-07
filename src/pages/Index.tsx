
import React from "react";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import TrustBadges from "@/components/TrustBadges";
import Footer from "@/components/Footer";
import NavMenu from "@/components/NavMenu";
import RollingCities from "@/components/RollingCities";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <RollingCities />
      <div className="pt-14">
        <NavMenu />
        
        {/* Hero Section */}
        <Hero />
        
        {/* Services Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <Services />
        </section>
        
        {/* Trust & Credibility Section */}
        <TrustBadges />
        
        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default Index;
