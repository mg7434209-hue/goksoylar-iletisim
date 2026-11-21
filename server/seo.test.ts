import { describe, expect, it } from "vitest";
import { FAQ_ITEMS } from "@shared/faq";
import {
  PUBLIC_ROUTES,
  buildJsonLd,
  normalizePath,
  resolveSeo,
  serializeJsonLd,
} from "@shared/seo";
import { escapeHtml, injectSeo, renderHeadTags } from "./_core/seoHtml";
import { buildSitemapXml } from "./_core/sitemap";

const TEMPLATE = `<!doctype html><html><head>
<title>Varsayılan</title>
<meta name="description" content="varsayılan açıklama" />
<!--seo:head-->
</head><body><div id="root"></div></body></html>`;

describe("rota çözümleme", () => {
  it("bilinen sayfalar 200 ve indekslenebilir", () => {
    for (const route of PUBLIC_ROUTES) {
      const seo = resolveSeo(route.path);
      expect(seo.status).toBe(200);
      expect(seo.indexable).toBe(true);
      expect(seo.canonical).toMatch(/^https:\/\/goksoylar\.com\.tr/);
    }
  });

  it("sondaki eğik çizgi ve sorgu dizesi yok sayılır", () => {
    expect(normalizePath("/telefonlar/")).toBe("/telefonlar");
    expect(normalizePath("/paketler?utm_source=x#a")).toBe("/paketler");
    expect(normalizePath("")).toBe("/");
    expect(resolveSeo("/superbox/").canonical).toBe(
      "https://goksoylar.com.tr/superbox"
    );
  });

  it("bilinmeyen yol 404 ve noindex", () => {
    const seo = resolveSeo("/yok-boyle-bir-sayfa");
    expect(seo.status).toBe(404);
    expect(seo.indexable).toBe(false);
    expect(seo.canonical).toBeUndefined();
  });

  it("admin 200 ama noindex", () => {
    for (const p of ["/admin", "/admin/telefonlar"]) {
      const seo = resolveSeo(p);
      expect(seo.status).toBe(200);
      expect(seo.indexable).toBe(false);
    }
    // "/administrator" admin değildir → 404
    expect(resolveSeo("/administrator").status).toBe(404);
  });

  it("başlık ve açıklamalar benzersiz ve makul uzunlukta", () => {
    const titles = PUBLIC_ROUTES.map(r => r.title);
    const descriptions = PUBLIC_ROUTES.map(r => r.description);
    expect(new Set(titles).size).toBe(titles.length);
    expect(new Set(descriptions).size).toBe(descriptions.length);
    for (const r of PUBLIC_ROUTES) {
      expect(r.title.length, r.path).toBeLessThanOrEqual(65);
      expect(r.description.length, r.path).toBeGreaterThanOrEqual(80);
      expect(r.description.length, r.path).toBeLessThanOrEqual(170);
    }
  });
});

describe("JSON-LD", () => {
  it("indekslenmeyen sayfalar için üretilmez", () => {
    expect(buildJsonLd(resolveSeo("/admin"))).toEqual([]);
    expect(buildJsonLd(resolveSeo("/yok"))).toEqual([]);
  });

  it("her sayfada işletme + site + sayfa bloğu var", () => {
    for (const route of PUBLIC_ROUTES) {
      const types = buildJsonLd(resolveSeo(route.path)).map(b => b["@type"]);
      expect(types, route.path).toContain("MobilePhoneStore");
      expect(types, route.path).toContain("WebSite");
      expect(types, route.path).toContain(route.pageType);
    }
  });

  it("işletme bilgileri sitedeki bilgilerle birebir aynı", () => {
    const business = buildJsonLd(resolveSeo("/"))[0] as any;
    expect(business.telephone).toBe("+905349777000");
    expect(business.address.streetAddress).toBe(
      "Aşağı Pazarcı, Zübeyde Hanım Cd. No:44"
    );
    expect(business.address.addressLocality).toBe("Manavgat");
    const hours = business.openingHoursSpecification[0];
    expect(hours.dayOfWeek).toHaveLength(6); // Pazar kapalı
    expect(hours.dayOfWeek).not.toContain("Sunday");
    expect(hours.opens).toBe("09:00");
    expect(hours.closes).toBe("20:00");
  });

  it("FAQPage yalnızca ana sayfada ve sorularla eşleşir", () => {
    const home = buildJsonLd(resolveSeo("/")).find(
      b => b["@type"] === "FAQPage"
    ) as any;
    expect(home.mainEntity).toHaveLength(FAQ_ITEMS.length);
    expect(home.mainEntity[0].name).toBe(FAQ_ITEMS[0].question);
    const other = buildJsonLd(resolveSeo("/telefonlar")).map(b => b["@type"]);
    expect(other).not.toContain("FAQPage");
  });

  it("alt sayfalarda BreadcrumbList, ana sayfada yok", () => {
    expect(buildJsonLd(resolveSeo("/"))).not.toContainEqual(
      expect.objectContaining({ "@type": "BreadcrumbList" })
    );
    const crumb = buildJsonLd(resolveSeo("/iletisim")).find(
      b => b["@type"] === "BreadcrumbList"
    ) as any;
    expect(crumb.itemListElement).toHaveLength(2);
    expect(crumb.itemListElement[1].item).toBe(
      "https://goksoylar.com.tr/iletisim"
    );
  });

  it("</script> kaçışı: JSON-LD içindeki '<' serileştirmede kaçırılır", () => {
    const out = serializeJsonLd({ x: "</script><script>alert(1)</script>" });
    expect(out).not.toContain("<");
    expect(JSON.parse(out).x).toBe("</script><script>alert(1)</script>");
  });
});

describe("HTML enjeksiyonu", () => {
  it("varsayılan title/description'ı sayfaya özel olanla değiştirir", () => {
    const { html, status } = injectSeo(TEMPLATE, "/telefonlar");
    expect(status).toBe(200);
    expect(html).not.toContain("Varsayılan");
    expect(html).not.toContain("varsayılan açıklama");
    expect(html.match(/<title>/g)).toHaveLength(1);
    expect(html).toContain(
      `<link rel="canonical" href="https://goksoylar.com.tr/telefonlar" />`
    );
    expect(html).toContain(
      `property="og:url" content="https://goksoylar.com.tr/telefonlar"`
    );
    expect(html).toContain(`name="twitter:card" content="summary_large_image"`);
    expect(html).toContain(`type="application/ld+json"`);
    expect(html).not.toContain("<!--seo:head-->");
  });

  it("bilinmeyen yol 404 + noindex, canonical/JSON-LD yok", () => {
    const { html, status } = injectSeo(TEMPLATE, "/yok");
    expect(status).toBe(404);
    expect(html).toContain(`content="noindex, nofollow"`);
    expect(html).not.toContain("canonical");
    expect(html).not.toContain("ld+json");
  });

  it("admin noindex", () => {
    const { html, status } = injectSeo(TEMPLATE, "/admin/mesajlar");
    expect(status).toBe(200);
    expect(html).toContain(`content="noindex, nofollow"`);
  });

  it("yer tutucu yoksa </head> öncesine ekler", () => {
    const bare = `<html><head><title>x</title></head><body></body></html>`;
    const { html } = injectSeo(bare, "/");
    expect(html).toContain(`rel="canonical"`);
    expect(html.indexOf("canonical")).toBeLessThan(html.indexOf("</head>"));
  });

  it("özel karakterler HTML özniteliklerinde kaçırılır", () => {
    expect(escapeHtml(`a"b<c>&'d`)).toBe("a&quot;b&lt;c&gt;&amp;&#39;d");
    // Üretilen etiketlerde ham tırnak/< açıklama içinde kalmamalı
    const tags = renderHeadTags(resolveSeo("/iletisim"));
    expect(tags).toContain("Zübeyde Hanım");
    expect(tags).not.toMatch(/content="[^"]*<[^"]*"/);
  });
});

describe("sitemap", () => {
  it("yalnızca indekslenebilir sayfaları içerir", () => {
    const xml = buildSitemapXml();
    for (const r of PUBLIC_ROUTES) {
      expect(xml).toContain(
        r.path === "/"
          ? "https://goksoylar.com.tr/<"
          : `https://goksoylar.com.tr${r.path}<`
      );
    }
    expect(xml).not.toContain("/admin");
    expect(xml.match(/<url>/g)).toHaveLength(PUBLIC_ROUTES.length);
    expect(xml.startsWith(`<?xml version="1.0" encoding="UTF-8"?>`)).toBe(true);
  });
});
