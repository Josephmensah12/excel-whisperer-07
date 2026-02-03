
import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Calculator, FileText, CreditCard, ArrowRight } from 'lucide-react';

const services = [
  {
    to: "/request-call",
    icon: Phone,
    title: "Request a Call",
    description: "Get personalized consultation from our shipping specialists",
    cta: "Schedule Call"
  },
  {
    to: "/shipping-calculator",
    icon: Calculator,
    title: "Shipping Calculator",
    description: "Calculate your shipping costs instantly with our estimator",
    cta: "Calculate Now"
  },
  {
    to: "/terms-of-service",
    icon: FileText,
    title: "Terms of Service",
    description: "Review our comprehensive shipping terms and conditions",
    cta: "Read Terms"
  },
  {
    to: "/frequently-shipped-items",
    icon: CreditCard,
    title: "Rate Card",
    description: "View transparent pricing for frequently shipped items",
    cta: "View Rates"
  }
];

const Services = () => {
  return (
    <section className="py-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          How Can We Help You?
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Whether you're shipping personal effects, vehicles, or commercial cargo, 
          we have the expertise to deliver safely and on time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <Link 
              key={service.to}
              to={service.to} 
              className="group bg-card rounded-xl p-6 premium-shadow hover:premium-shadow-lg transition-all duration-300 border border-border hover:border-accent/30 flex flex-col"
            >
              <div className="h-14 w-14 rounded-xl bg-accent/10 flex items-center justify-center mb-5 group-hover:bg-accent/20 transition-colors">
                <Icon className="h-7 w-7 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                {service.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-grow">
                {service.description}
              </p>
              <div className="flex items-center text-accent font-medium text-sm group-hover:gap-2 transition-all">
                {service.cta}
                <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default Services;
