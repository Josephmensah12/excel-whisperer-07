// Content for the Ship a Vehicle page (/ship-a-vehicle).
//
// Plain JavaScript on purpose: the React page renders it AND the post-build
// script scripts/prerender-ship-vehicle.mjs writes it into static HTML, so
// crawlers that don't run JavaScript (most AI answer engines) can read the page.
// Keep it short (most visitors are on a phone) and free of em dashes.

export const SITE_URL = "https://www.goldcoastgloballogistics.com";
export const PATH = "/ship-a-vehicle";

export const TITLE = "Ship a Car to Ghana from Anywhere in the US | Gold Coast Global Logistics";
export const DESCRIPTION =
  "Container shipping for cars, SUVs, pickups and vans from anywhere in the US to Tema, Ghana, through our Houston warehouse. Free instant estimate with your VIN.";

export const H1 = "Ship your car to Ghana.";
export const INTRO = "From anywhere in the US, by container, through our Houston warehouse.";

export const DISCLAIMER =
  "An estimate, not a final price. The actual charge may be higher or lower. Ghana duty and taxes not included.";

export const WAREHOUSE = { city: "Houston, TX", line: "Our warehouse, 5301 Polk St" };
export const DESTINATION = { city: "Tema, Ghana", line: "Tema port" };

export const STEPS = [
  { title: "Get an estimate", body: "Enter your VIN. See a price in seconds." },
  { title: "We call you", body: "We confirm the price and book your container." },
  { title: "It ships", body: "The car comes to Houston, then sails to Tema." },
];

export const FAQ = [
  {
    q: "How much does it cost to ship a car to Ghana?",
    a: "It depends on the vehicle's size and whether it runs. Enter your VIN above for a free estimate. It covers Houston to Tema and excludes inland transport and Ghana duty.",
  },
  {
    q: "Can you ship my car if I'm not in Texas?",
    a: "Yes, from anywhere in the US. We move the car to our Houston warehouse first and price that leg when we call.",
  },
  {
    q: "Is it shipped in a container?",
    a: "Most vehicles ship in a container. Roll-on/roll-off (RoRo) is also available.",
  },
  {
    q: "Can you ship a car that doesn't run?",
    a: "Yes. It needs extra handling, which adds to the cost.",
  },
  {
    q: "What documents do I need?",
    a: "The original title, which US Customs requires before export. If there is a loan, a letter from the lender too.",
  },
  {
    q: "How long does it take?",
    a: "Typically 4 to 6 weeks from sailing to Tema port.",
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
      serviceType: "Vehicle container shipping",
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
