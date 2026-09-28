// Content for the Ship a Vehicle page (/ship-a-vehicle).
//
// Plain JavaScript on purpose: the React page renders it AND the post-build
// script scripts/prerender-ship-vehicle.mjs writes it into static HTML, so
// crawlers that don't run JavaScript (most AI answer engines) can read the page.
// Edit the words here and both stay in step. No em dashes in copy.

export const SITE_URL = "https://www.goldcoastgloballogistics.com";
export const PATH = "/ship-a-vehicle";

export const TITLE = "Ship a Car to Ghana from Anywhere in the US | Gold Coast Global Logistics";
export const DESCRIPTION =
  "Ship your car, SUV, pickup truck or van to Tema, Ghana from any US state through our Houston, Texas warehouse. Enter your VIN for a free instant estimate.";

export const H1 = "Ship your car to Ghana from anywhere in the US.";
export const INTRO =
  "Wherever the car is today, we bring it to our Houston warehouse and put it on a ship to Tema. Enter your VIN to see an estimate in seconds; someone from our office then calls to confirm it and plan the move.";

export const DISCLAIMER =
  "This is an estimate, not a final price. Your actual charge may be higher or lower once we confirm your vehicle's exact size and condition, the shipping method and the sailing. Ghana import duty and taxes are not included.";

export const WAREHOUSE = {
  city: "Houston, TX",
  line: "Gold Coast warehouse, 5301 Polk Street, Bldg 14",
};
export const DESTINATION = { city: "Tema, Ghana", line: "Tema port" };

export const STEPS = [
  {
    title: "Tell us about the car",
    body: "Your VIN tells us the make, model and body type, and you see an estimate straight away.",
  },
  {
    title: "We call you",
    body: "Someone from our Houston office confirms the vehicle, its condition, the shipping method and the next sailing. If the car is outside the Houston area, we price the trip to our warehouse on the same call.",
  },
  {
    title: "The car comes to Houston",
    body: "Drive it to 5301 Polk Street, or we arrange inland transport from your city. Have the original title ready: US Customs requires it before any vehicle is exported.",
  },
  {
    title: "It sails to Tema",
    body: "Your vehicle travels in a container or on a roll-on/roll-off (RoRo) vessel. Follow it on our online tracking until it reaches Tema port.",
  },
];

export const PRICE_FACTORS = [
  {
    title: "Vehicle size",
    body: "Space on the ship is priced by size. Compact sedans cost the least, then midsize sedans, SUVs, large SUVs and vans, with full-size pickup trucks at the top.",
  },
  {
    title: "Where the car starts",
    body: "Cars outside the Houston area travel to our warehouse first. We price that inland leg on the call; it is not part of the online estimate.",
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
    q: "How much does it cost to ship a car from the US to Ghana?",
    a: "It depends mainly on the vehicle's size and whether it runs. Enter your VIN on this page for a free instant estimate of the ocean shipping from Houston to Tema; a representative then confirms your exact price. Estimates do not include inland transport to Houston or Ghana import duty and taxes.",
  },
  {
    q: "Can you ship my car to Ghana if I don't live in Texas?",
    a: "Yes. We ship from anywhere in the US. Vehicles outside the Houston area are transported to our Houston warehouse first, and we price that inland leg when we call you.",
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
    a: "Transit is typically 4 to 6 weeks from sailing. Your representative confirms the next sailing and the expected arrival when you book.",
  },
  {
    q: "Where in Ghana does my vehicle arrive?",
    a: "Vehicles arrive at Tema port. Ask your representative about clearing and onward delivery when you book.",
  },
];

/** Greater Houston ZIPs (770xx-775xx) drop off at the warehouse; mirrors the backend. */
export function isHoustonAreaZip(zip) {
  const prefix = Number(String(zip || "").slice(0, 3));
  return prefix >= 770 && prefix <= 775;
}

/** schema.org data for search engines: the service, and the FAQ above. */
export function jsonLd() {
  const url = SITE_URL + PATH;
  return [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Car shipping from the USA to Ghana",
      serviceType: "Vehicle shipping",
      url,
      description: DESCRIPTION,
      areaServed: [
        { "@type": "Country", name: "United States" },
        { "@type": "Country", name: "Ghana" },
      ],
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
