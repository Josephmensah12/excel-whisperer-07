
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const Hero = () => {
  return (
    <div className="relative">
      {/* Background Image Container with optimized loading */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/lovable-uploads/hero-door-to-door.png" 
          alt="Door-to-door shipping from Texas USA to Ghana - showing American home entrance connected to Ghanaian home via golden shipping container" 
          className="w-full h-[500px] object-cover object-center"
          loading="eager" 
          fetchPriority="high"
        />
        {/* Overlay to ensure text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-center mb-4">
          <img 
            src="/lovable-uploads/fec56b94-d58e-44f1-9568-71d7cfcb6770.png" 
            alt="Gold Coast Global Logistics company logo with gold and blue elements" 
            className="h-32 object-contain mix-blend-screen"
            loading="eager"
            width="320"
            height="128"
          />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-center text-white mt-8">
          Reliable Door-to-Door Shipping from the USA to Ghana
        </h1>
        
        <div className="flex justify-center mt-8">
          <Link to="/request-call">
            <Button size="lg" className="font-bold text-lg">
              Request a Quote <ArrowRight className="ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
