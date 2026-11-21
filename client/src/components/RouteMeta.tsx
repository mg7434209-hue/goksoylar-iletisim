/*
 * SPA içinde sayfa değiştirince title/description/canonical/JSON-LD'yi günceller.
 * İlk yüklemede sunucu aynı değerleri zaten HTML'e basmıştır (server/_core/seoHtml.ts);
 * bu bileşen yalnızca istemci tarafı gezinmede sekme başlığı ve etiketlerin
 * eski sayfada kalmasını önler.
 */
import { useEffect } from "react";
import { useLocation } from "wouter";
import { SITE, buildJsonLd, resolveSeo, serializeJsonLd } from "@shared/seo";

function upsert(
  selector: string,
  create: () => HTMLElement,
  apply: (el: HTMLElement) => void
) {
  let el = document.head.querySelector<HTMLElement>(selector);
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  apply(el);
}

function setMeta(attr: "name" | "property", key: string, content: string) {
  upsert(
    `meta[${attr}="${key}"]`,
    () => {
      const m = document.createElement("meta");
      m.setAttribute(attr, key);
      return m;
    },
    el => el.setAttribute("content", content)
  );
}

function removeMeta(attr: "name" | "property", key: string) {
  document.head.querySelector(`meta[${attr}="${key}"]`)?.remove();
}

export default function RouteMeta() {
  const [location] = useLocation();

  useEffect(() => {
    const seo = resolveSeo(location);

    document.title = seo.title;
    setMeta("name", "description", seo.description);

    if (seo.indexable && seo.canonical) {
      setMeta("name", "robots", "index, follow, max-image-preview:large");
      upsert(
        'link[rel="canonical"]',
        () => {
          const l = document.createElement("link");
          l.setAttribute("rel", "canonical");
          return l;
        },
        el => el.setAttribute("href", seo.canonical!)
      );
      setMeta("property", "og:type", "website");
      setMeta("property", "og:site_name", SITE.name);
      setMeta("property", "og:locale", SITE.locale);
      setMeta("property", "og:title", seo.title);
      setMeta("property", "og:description", seo.description);
      setMeta("property", "og:url", seo.canonical);
      setMeta("property", "og:image", `${SITE.url}${SITE.ogImage}`);
      setMeta("name", "twitter:card", "summary_large_image");
      setMeta("name", "twitter:title", seo.title);
      setMeta("name", "twitter:description", seo.description);
      setMeta("name", "twitter:image", `${SITE.url}${SITE.ogImage}`);
    } else {
      setMeta("name", "robots", "noindex, nofollow");
      document.head.querySelector('link[rel="canonical"]')?.remove();
      ["og:title", "og:description", "og:url", "og:image"].forEach(k =>
        removeMeta("property", k)
      );
    }

    // JSON-LD'yi bu sayfanınkiyle değiştir
    document.head
      .querySelectorAll('script[data-seo="jsonld"]')
      .forEach(n => n.remove());
    for (const block of buildJsonLd(seo)) {
      const s = document.createElement("script");
      s.type = "application/ld+json";
      s.dataset.seo = "jsonld";
      s.text = serializeJsonLd(block);
      document.head.appendChild(s);
    }
  }, [location]);

  return null;
}
