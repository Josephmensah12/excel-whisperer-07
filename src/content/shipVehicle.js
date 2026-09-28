// Content for the Ship a Vehicle page (/ship-a-vehicle).
//
// Plain JavaScript on purpose: the React page renders it AND the post-build
// script scripts/prerender-ship-vehicle.mjs writes it into static HTML, so
// crawlers that don't run JavaScript (most AI answer engines) can read the page.
// Edit the words here and both stay in step.

export const SITE_URL = "https://www.goldcoastgloballogistics.com";
export const PATH = "/ship-a-vehicle";

export const TITLE = "Ship a Car from Houston to Ghana | Gold Coast Global Logistics";
export const DESCRIPTION =
  "Free instant estimate to ship your car, SUV, pickup truck or van from Houston, Texas to Tema, Ghana. Enter your VIN. Container and RoRo shipping, running or not.";

export const H1 = "Ship a Car from Houston to Ghana";
export const INTRO =
  "Gold Coast Global Logistics ships cars, SUVs, pickup trucks and vans from Houston, Texas to Tema, Ghana. Enter your VIN below for a free instant shipping estimate. A member of our team will then call you to confirm your price and plan the shipment.";

export const DISCLAIMER =
  "This is an estimate, not a final price. Your actual charge may be higher or lower once we confirm your vehicle's exact size and condition, the shipping method and the sailing. Ghana import duty and taxes are not included.";

export const STEPS = [
  {
    title: "Get your estimate",
    body: "Enter your contact details and your vehicle's 17-character VIN. We identify the vehicle and show you an estimated shipping cost straight away.",
  },
  {
    title: "We confirm and book",
    body: "A Gold Coast representative calls you to confirm the vehicle's size and condition, the shipping method and the next sailing.",
  },
  {
    title: "Get the vehicle ready",
    body: "Have the vehicle's original title ready: US Customs requires it before any vehicle is exported. Our warehouse is at 5301 Polk Street, Bldg 14, Houston, TX 77023.",
  },
  {
    title: "Shipped to Tema, Ghana",
    body: "Your vehicle sails to Tema port in a container or on a roll-on/roll-off (RoRo) vessel, and you can follow the shipment with our online tracking.",
  },
];

export const PRICE_FACTORS = [
  {
    title: "Vehicle size",
    body: "Space on the ship is priced by size. Compact sedans cost the least, then midsize sedans, SUVs, large SUVs and vans, with full-size pickup trucks at the top.",
  },
  {
    title: "Running condition",
    body: "Vehicles that don't run can still be shipped. They need extra handling to load, which adds to the cost.",
  },
  {
    title: "Shipping method and sailing",
    body: "Vehicles travel in a container or on a RoRo vessel. The method and the sailing schedule can move the final price up or down.",
  },
  {
    title: "Not included",
    body: "Ghana import duty and taxes are not part of the shipping estimate.",
  },
];

export const FAQ = [
  {
    q: "How much does it cost to ship a car from Houston to Ghana?",
    a: "It depends mainly on the vehicle's size and whether it runs. Enter your VIN on this page for a free instant estimate for your vehicle; a representative then confirms your exact price. Estimates do not include Ghana import duty and taxes.",
  },
  {
    q: "Is the online estimate my final price?",
    a: "No. It is an estimate based on the vehicle identified from your VIN. The actual charge may be higher or lower once we confirm the vehicle's exact size and condition, the shipping method and the sailing.",
  },
  {
    q: "Can you ship a car that doesn't run?",
    a: "Yes. Non-running vehicles can be shipped. They need extra handling, which adds to the cost, so choose the vehicle's condition when you request your estimate.",
  },
  {
    q: "What documents do I need to ship a car from the USA to Ghana?",
    a: "You need the vehicle's original title, because US Customs requires it before any vehicle is exported. If there is a loan on the vehicle, you will also need a letter from the lender allowing it to be exported. Our team goes through the paperwork with you when you book.",
  },
  {
    q: "How long does it take to ship a car to Ghana?",
    a: "Transit is typically 4 to 6 weeks. Your representative confirms the next sailing and the expected arrival when you book.",
  },
  {
    q: "Where in Ghana does my vehicle arrive?",
    a: "Vehicles arrive at Tema port. Ask your representative about clearing and onward delivery when you book.",
  },
];

/** schema.org data for search engines: the service, and the FAQ above. */
export function jsonLd() {
  const url = SITE_URL + PATH;
  return [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Car shipping from Houston to Ghana",
      serviceType: "Vehicle shipping",
      url,
      description: DESCRIPTION,
      areaServed: { "@type": "Country", name: "Ghana" },
      provider: {
        "@type": "Organization",
        name: "Gold Coast Global Logistics",
        url: SITE_URL,
        telephone: "+1-832-295-9347",
        address: {
          "@type": "PostalAddress",
          streetAddress: "5301 Polk Street, Bldg 14",
          addressLocality: "Houston",
          addressRegion: "TX",
          postalCode: "77023",
          addressCountry: "US",
        },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQ.map(({ q, a }) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a },
      })),
    },
  ];
}
