
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Phone, MapPin, Shield, Clock, Package } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/lovable-uploads/hero-door-to-door.png" 
          alt="Door-to-door shipping from Texas USA to Ghana - showing American home entrance connected to Ghanaian home via golden shipping container" 
          className="w-full h-full object-cover object-center"
          loading="eager" 
          fetchPriority="high"
        />
        {/* Premium Navy Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-navy-dark/90 via-navy/80 to-navy/60"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-20 md:py-28 lg:py-32">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img 
              src="/lovable-uploads/fec56b94-d58e-44f1-9568-71d7cfcb6770.png" 
              alt="Gold Coast Global Logistics company logo" 
              className="h-24 md:h-32 object-contain drop-shadow-2xl"
              loading="eager"
              width="320"
              height="128"
            />
          </div>

          {/* Main Headline */}
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-primary-foreground mb-6 leading-tight text-balance">
              Premium Door-to-Door Shipping
              <span className="block mt-2 gold-text">From USA to Ghana</span>
            </h1>
            
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
              Trusted by thousands of families. Licensed, insured, and fully customs-compliant shipping for your valuable cargo.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link to="/request-call">
                <Button 
                  size="lg" 
                  className="bg-accent hover:bg-gold-light text-accent-foreground font-bold text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Get a Free Quote <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/track">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 font-semibold text-lg px-8 py-6"
                >
                  <Package className="mr-2 h-5 w-5" />
                  Track Your Shipment
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-6 md:gap-8 text-primary-foreground/70 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-accent" />
                <span>Fully Insured</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-accent" />
                <span>Since 2015</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-accent" />
                <span>5,000+ Deliveries</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Bar */}
        <div className="relative -mb-8 z-20">
          <div className="bg-card rounded-xl shadow-xl p-6 md:p-8 premium-shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Call or Text</p>
                  <a href="tel:+18322959347" className="font-semibold text-foreground hover:text-accent transition-colors">
                    (832) 295-9347
                  </a>
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <svg className="h-6 w-6 text-accent" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">WhatsApp</p>
                  <a href="https://wa.me/17138261087" target="_blank" rel="noopener noreferrer" className="font-semibold text-foreground hover:text-accent transition-colors">
                    (713) 826-1087
                  </a>
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Houston, Texas</p>
                  <p className="font-semibold text-foreground">5301 Polk Street, Bldg 14</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
