
import React from 'react';
import { Package, CheckCircle, Truck, Clock, Award } from "lucide-react";

const badges = [
  {
    icon: Package,
    title: "Proven Track Record",
    description: "Years of reliable service delivering to families across Ghana",
    stat: "5,000+",
    statLabel: "Deliveries"
  },
  {
    icon: CheckCircle,
    title: "Customs Compliant",
    description: "Licensed and compliant with all Ghana Revenue Authority requirements",
    stat: "100%",
    statLabel: "Clearance Rate"
  },
  {
    icon: Truck,
    title: "Door-to-Door",
    description: "Complete service from your doorstep in the USA to any location in Ghana",
    stat: "16",
    statLabel: "Regions Covered"
  },
  {
    icon: Clock,
    title: "Reliable Timing",
    description: "Consistent shipping schedules with real-time tracking updates",
    stat: "4-6",
    statLabel: "Weeks Transit"
  },
  {
    icon: Award,
    title: "Expert Team",
    description: "Experienced logistics professionals handling your cargo with care",
    stat: "10+",
    statLabel: "Years Experience"
  }
];

const TrustBadges = () => {
  return (
    <section className="py-16 bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Delivering Your Promise
          </h2>
          <p className="text-primary-foreground/70 text-lg max-w-2xl mx-auto">
            Gold Coast Global Logistics has been the preferred shipping partner 
            for the Ghanaian diaspora in the United States.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {badges.map((badge, index) => {
            const Icon = badge.icon;
            return (
              <div 
                key={index}
                className="bg-primary-foreground/5 backdrop-blur-sm rounded-xl p-6 border border-primary-foreground/10 hover:bg-primary-foreground/10 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-6 w-6 text-accent" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-primary-foreground mb-1">
                      {badge.title}
                    </h3>
                    <p className="text-primary-foreground/70 text-sm leading-relaxed mb-3">
                      {badge.description}
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-accent">{badge.stat}</span>
                      <span className="text-primary-foreground/60 text-sm">{badge.statLabel}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
