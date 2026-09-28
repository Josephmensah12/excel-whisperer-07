import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import * as shipVehicle from "@/content/shipVehicle";

/**
 * Keeps the <head> right for the current route after client-side navigation.
 *
 * Every route is served the same index.html, whose canonical points at the
 * homepage. That told search engines every page was a copy of the homepage, so
 * this sets a self-referencing canonical per route. Titles and descriptions
 * stay the index.html defaults except where a page defines its own
 * (today only /ship-a-vehicle, which is also pre-rendered at build time).
 */

const SITE_URL = shipVehicle.SITE_URL;

// Must match index.html. Not read from the DOM: a visitor who lands on a
// pre-rendered page starts with THAT page's title in the document.
const DEFAULT_TITLE = "Gold Coast Global Logistics | Door-to-Door Shipping USA to Ghana";
const DEFAULT_DESCRIPTION =
  "Door-to-door shipping from the USA to Ghana. Containers, vehicles, household goods, and business cargo—fast, reliable, and trusted.";

type PageSeo = { title: string; description: string; jsonLd?: Record<string, unknown>[] };

const PAGES: Record<string, PageSeo> = {
  [shipVehicle.PATH]: {
    title: shipVehicle.TITLE,
    description: shipVehicle.DESCRIPTION,
    jsonLd: shipVehicle.jsonLd(),
  },
};

const JSON_LD_ID = "route-jsonld";

function setMeta(selector: string, value: string) {
  const el = document.head.querySelector<HTMLMetaElement>(selector);
  if (el) el.setAttribute("content", value);
}

const RouteSeo = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : "/";
    const page = PAGES[path];
    const title = page?.title ?? DEFAULT_TITLE;
    const description = page?.description ?? DEFAULT_DESCRIPTION;
    const url = path === "/" ? SITE_URL : SITE_URL + path;

    document.title = title;
    setMeta('meta[name="description"]', description);
    setMeta('meta[property="og:title"]', title);
    setMeta('meta[property="og:description"]', description);
    setMeta('meta[property="og:url"]', url);
    setMeta('meta[name="twitter:url"]', url);
    setMeta('meta[name="twitter:title"]', title);
    setMeta('meta[name="twitter:description"]', description);

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = url;

    // The pre-rendered page ships its JSON-LD in the static HTML; don't add a
    // second copy of it, and remove it when leaving the page.
    document.getElementById(JSON_LD_ID)?.remove();
    const hasStatic = document.head.querySelector('script[type="application/ld+json"][data-prerendered]');
    if (page?.jsonLd && !hasStatic) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = JSON_LD_ID;
      script.textContent = JSON.stringify(page.jsonLd);
      document.head.appendChild(script);
    }
    if (!page?.jsonLd && hasStatic) hasStatic.remove();
  }, [pathname]);

  return null;
};

export default RouteSeo;
