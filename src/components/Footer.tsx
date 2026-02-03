
import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-navy-dark text-primary-foreground">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <img 
              src="/lovable-uploads/fec56b94-d58e-44f1-9568-71d7cfcb6770.png" 
              alt="Gold Coast Global Logistics" 
              className="h-16 object-contain mb-4"
            />
            <p className="text-primary-foreground/70 text-sm leading-relaxed mb-4">
              Your trusted partner for reliable door-to-door shipping from the USA to Ghana. 
              Licensed, insured, and committed to excellence.
            </p>
            <div className="flex items-center gap-2 text-accent text-sm font-medium">
              <Clock className="h-4 w-4" />
              <span>Mon-Sat: 9AM - 6PM CST</span>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-primary-foreground">Contact Us</h3>
            <ul className="space-y-4">
              <li>
                <a 
                  href="tel:+18322959347" 
                  className="flex items-center gap-3 text-primary-foreground/70 hover:text-accent transition-colors group"
                >
                  <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                    <Phone className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-xs text-primary-foreground/50">Call or Text</p>
                    <p className="font-medium text-primary-foreground">(832) 295-9347</p>
                  </div>
                </a>
              </li>
              <li>
                <a 
                  href="https://wa.me/17138261087" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-primary-foreground/70 hover:text-accent transition-colors group"
                >
                  <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                    <svg className="h-5 w-5 text-accent" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-primary-foreground/50">WhatsApp</p>
                    <p className="font-medium text-primary-foreground">(713) 826-1087</p>
                  </div>
                </a>
              </li>
              <li>
                <a 
                  href="mailto:info@goldcoastlogistics.com" 
                  className="flex items-center gap-3 text-primary-foreground/70 hover:text-accent transition-colors group"
                >
                  <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                    <Mail className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-xs text-primary-foreground/50">Email</p>
                    <p className="font-medium text-primary-foreground">info@goldcoastlogistics.com</p>
                  </div>
                </a>
              </li>
            </ul>
          </div>

          {/* Locations */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-primary-foreground">Our Locations</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="font-medium text-primary-foreground mb-1">United States</p>
                  <p className="text-primary-foreground/70 text-sm">
                    5301 Polk Street, Bldg 14<br />
                    Unit C4<br />
                    Houston, TX 77023
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="font-medium text-primary-foreground mb-1">Ghana</p>
                  <p className="text-primary-foreground/70 text-sm">
                    Tema & Accra<br />
                    Nationwide Delivery
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Services & Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-primary-foreground">Our Services</h3>
            <ul className="space-y-3">
              {[
                { label: "Air Freight", desc: "Express delivery" },
                { label: "Sea Freight", desc: "Container shipping" },
                { label: "Vehicle Shipping", desc: "Cars & equipment" },
                { label: "Customs Clearance", desc: "Full-service" },
                { label: "Door-to-Door", desc: "Complete logistics" }
              ].map((service) => (
                <li key={service.label} className="flex items-center justify-between text-sm">
                  <span className="text-primary-foreground">{service.label}</span>
                  <span className="text-primary-foreground/50">{service.desc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-primary-foreground/50 text-sm">
              &copy; {new Date().getFullYear()} Gold Coast Global Logistics. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link 
                to="/terms-of-service" 
                className="text-primary-foreground/50 hover:text-accent text-sm transition-colors"
              >
                Terms of Service
              </Link>
              <Link 
                to="/privacy-policy" 
                className="text-primary-foreground/50 hover:text-accent text-sm transition-colors"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
