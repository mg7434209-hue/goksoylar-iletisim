/*
 * Sunucu tarafında sayfa başına SEO etiketlerini index.html'e basar.
 * Site bir SPA olduğundan JavaScript çalıştırmayan tarayıcılar (sosyal medya
 * ve WhatsApp önizlemeleri, birçok yapay zekâ botu) aksi halde hep aynı
 * genel başlığı görürdü.
 */
import {
  SITE,
  buildJsonLd,
  resolveSeo,
  serializeJsonLd,
  type ResolvedSeo,
} from "@shared/seo";

const MARKER = "<!--seo:head-->";

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function renderHeadTags(seo: ResolvedSeo): string {
  const title = escapeHtml(seo.title);
  const description = escapeHtml(seo.description);
  const tags: string[] = [
    `<title>${title}</title>`,
    `<meta name="description" content="${description}" />`,
  ];

  if (!seo.indexable) {
    tags.push(`<meta name="robots" content="noindex, nofollow" />`);
    return tags.join("\n    ");
  }

  const canonical = escapeHtml(seo.canonical ?? "");
  const image = escapeHtml(`${SITE.url}${SITE.ogImage}`);
  tags.push(
    `<meta name="robots" content="index, follow, max-image-preview:large" />`,
    `<link rel="canonical" href="${canonical}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${escapeHtml(SITE.name)}" />`,
    `<meta property="og:locale" content="${SITE.locale}" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:url" content="${canonical}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${description}" />`,
    `<meta name="twitter:image" content="${image}" />`
  );

  for (const block of buildJsonLd(seo)) {
    tags.push(
      `<script type="application/ld+json" data-seo="jsonld">${serializeJsonLd(block)}</script>`
    );
  }
  return tags.join("\n    ");
}

/**
 * index.html'deki varsayılan title/description'ı çıkarıp yerine sayfaya özel
 * etiketleri koyar. Yer tutucu yoksa </head>'den hemen önce ekler.
 */
export function injectSeo(
  html: string,
  rawPath: string
): { html: string; status: 200 | 404 } {
  const seo = resolveSeo(rawPath);
  const tags = renderHeadTags(seo);

  let out = html
    .replace(/<title>[\s\S]*?<\/title>\s*/i, "")
    .replace(/<meta\s+name="description"[^>]*>\s*/i, "");

  // String yerine fonksiyon: içerikteki "$&" gibi dizilerin yorumlanmasını önler.
  out = out.includes(MARKER)
    ? out.replace(MARKER, () => tags)
    : out.replace(/<\/head>/i, () => `    ${tags}\n  </head>`);

  return { html: out, status: seo.status };
}
