// Post-build: write dist/ship-a-vehicle/index.html, a copy of the built
// index.html with the Ship a Vehicle page's own <head> (title, description,
// canonical, social tags, JSON-LD) and its text inside #root.
//
// Why: the site renders in the browser, so the raw HTML of every page is an
// empty <div id="root"> under the homepage's title and canonical. Crawlers
// that don't run JavaScript, which is most AI answer engines, saw nothing about
// vehicle shipping. React's createRoot replaces #root's contents on load, so
// visitors get the normal interactive page.
//
// Fails the build if the page can't be produced correctly: a silently wrong
// page is worse for search than no pre-render at all.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as page from "../src/content/shipVehicle.js";

const dist = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");
const url = page.SITE_URL + page.PATH;

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

let html = readFileSync(join(dist, "index.html"), "utf8");

function replace(pattern, replacement, what) {
  if (!pattern.test(html)) throw new Error(`prerender-ship-vehicle: could not find ${what} in dist/index.html`);
  html = html.replace(pattern, replacement);
}

const metaContent = (attr, name, value) => [
  new RegExp(`(<meta\\s+${attr}="${name}"\\s+content=")[^"]*(")`),
  `$1${esc(value)}$2`,
  `${attr}="${name}"`,
];

replace(/<title>[^<]*<\/title>/, `<title>${esc(page.TITLE)}</title>`, "<title>");
replace(...metaContent("name", "description", page.DESCRIPTION));
replace(...metaContent("property", "og:title", page.TITLE));
replace(...metaContent("property", "og:description", page.DESCRIPTION));
replace(...metaContent("property", "og:url", url));
replace(...metaContent("name", "twitter:title", page.TITLE));
replace(...metaContent("name", "twitter:description", page.DESCRIPTION));
replace(...metaContent("name", "twitter:url", url));
replace(/(<link\s+rel="canonical"\s+href=")[^"]*(")/, `$1${esc(url)}$2`, "canonical link");

const jsonLd = JSON.stringify(page.jsonLd()).replace(/</g, "\\u003c");
replace(
  /<\/head>/,
  `  <script type="application/ld+json" data-prerendered>${jsonLd}</script>\n  </head>`,
  "</head>"
);

const body = `
<main style="max-width:72rem;margin:0 auto;padding:6rem 1rem 4rem;font-family:Inter,system-ui,sans-serif;line-height:1.6">
  <h1>${esc(page.H1)}</h1>
  <p>${esc(page.INTRO)}</p>
  <p>Route: your city, by inland transport to ${esc(page.WAREHOUSE.city)} (${esc(page.WAREHOUSE.line)}), then by container to ${esc(page.DESTINATION.city)}. Cars, SUVs, pickup trucks and vans, running or not.</p>
  <p>Call <a href="tel:+18322959347">(832) 295-9347</a> or WhatsApp <a href="https://wa.me/17138261087">+1 713-826-1087</a>.</p>
  <p><strong>About the estimate:</strong> ${esc(page.DISCLAIMER)}</p>
  <h2>How shipping a car to Ghana works</h2>
  <ol>${page.STEPS.map((s) => `<li><h3>${esc(s.title)}</h3><p>${esc(s.body)}</p></li>`).join("")}</ol>
  <h2>Car shipping questions</h2>
  <dl>${page.FAQ.map((f) => `<dt>${esc(f.q)}</dt><dd>${esc(f.a)}</dd>`).join("")}</dl>
</main>`;
replace(/<div id="root"><\/div>/, `<div id="root">${body}</div>`, '<div id="root"></div>');

const out = join(dist, page.PATH.slice(1), "index.html");
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, html);
console.log(`prerender-ship-vehicle: wrote ${out}`);
