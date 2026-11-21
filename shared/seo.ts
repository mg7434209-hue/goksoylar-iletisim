/*
 * SEO tek kaynağı: rota tablosu, işletme bilgileri ve JSON-LD üretimi.
 * Sunucu (HTML enjeksiyonu + sitemap) ve istemci (sayfa geçişlerinde başlık
 * güncelleme) aynı dosyayı kullanır; böylece üçü birbirinden kopmaz.
 */
import { FAQ_ITEMS } from "./faq";

export const SITE = {
  url: "https://goksoylar.com.tr",
  name: "Göksoylar İletişim",
  locale: "tr_TR",
  phone: "+905349777000",
  phoneDisplay: "0534 977 70 00",
  email: "info@goksoylar.com",
  street: "Aşağı Pazarcı, Zübeyde Hanım Cd. No:44",
  city: "Manavgat",
  region: "Antalya",
  country: "TR",
  ogImage: "/og-image.jpg",
} as const;

export type PageType =
  | "WebPage"
  | "CollectionPage"
  | "AboutPage"
  | "ContactPage";

export interface RouteSeo {
  path: string;
  title: string;
  description: string;
  /** Breadcrumb etiketi (ana sayfada yok). */
  crumb?: string;
  pageType: PageType;
}

/** Aranabilir (indekslenebilir) herkese açık sayfalar. */
export const PUBLIC_ROUTES: readonly RouteSeo[] = [
  {
    path: "/",
    title: "Göksoylar İletişim | Manavgat Türkcell Yetkili Bayi",
    description:
      "Manavgat'ta Türkcell Yetkili Bayisi. Cep telefonları, Türkcell paketleri, Superbox ve aksesuarlar; 12 aya varan taksit ve ücretsiz kargo ile Göksoylar İletişim'de.",
    pageType: "WebPage",
  },
  {
    path: "/telefonlar",
    title: "Cep Telefonları ve Taksit Seçenekleri | Göksoylar İletişim",
    description:
      "Güncel cep telefonu modellerini Göksoylar İletişim'de inceleyin. 12 aya varan taksit ve ücretsiz kargo; WhatsApp ile kolayca sipariş verin.",
    crumb: "Cep Telefonları",
    pageType: "CollectionPage",
  },
  {
    path: "/paketler",
    title: "Türkcell Faturalı ve Genç Paketler | Göksoylar İletişim",
    description:
      "Türkcell faturalı ve genç paketlerini karşılaştırın, numara taşıma ve yeni hat başvurunuzu Göksoylar İletişim'den WhatsApp ile hemen yapın.",
    crumb: "Türkcell Paketler",
    pageType: "CollectionPage",
  },
  {
    path: "/superbox",
    title: "Türkcell Superbox Taşınabilir Ev İnterneti | Göksoylar",
    description:
      "Fiber altyapı gerektirmeden tek prizle ev interneti. Türkcell Superbox paketlerinde 12 ay sabit fiyat; Göksoylar İletişim'den hemen başvurun.",
    crumb: "Superbox",
    pageType: "CollectionPage",
  },
  {
    path: "/aksesuarlar",
    title: "Telefon Aksesuarları | Göksoylar İletişim",
    description:
      "Telefonunuz için aksesuarlar Göksoylar İletişim'de. WhatsApp ile kolayca sipariş verin, ücretsiz kargo ile kapınıza gelsin.",
    crumb: "Aksesuarlar",
    pageType: "CollectionPage",
  },
  {
    path: "/hakkimizda",
    title: "Hakkımızda | 10+ Yıllık Türkcell Yetkili Bayi | Göksoylar",
    description:
      "Göksoylar İletişim, 10 yılı aşkın süredir Manavgat'ta Türkcell Yetkili Bayisi olarak hizmet veriyor. Hikâyemizi ve değerlerimizi tanıyın.",
    crumb: "Hakkımızda",
    pageType: "AboutPage",
  },
  {
    path: "/iletisim",
    title: "İletişim ve Adres | Göksoylar İletişim Manavgat",
    description:
      "Aşağı Pazarcı, Zübeyde Hanım Cd. No:44, Manavgat / Antalya. Pzt - Cmt 09:00 - 20:00. Telefon: 0534 977 70 00 veya WhatsApp ile ulaşın.",
    crumb: "İletişim",
    pageType: "ContactPage",
  },
];

export interface ResolvedSeo {
  /** HTTP durum kodu: bilinmeyen yol için 404. */
  status: 200 | 404;
  title: string;
  description: string;
  /** false ise noindex; canonical ve JSON-LD üretilmez. */
  indexable: boolean;
  /** Canonical mutlak URL (yalnızca indexable sayfalarda). */
  canonical?: string;
  route?: RouteSeo;
}

/** "/telefonlar/" → "/telefonlar", boş → "/" (sorgu/hash atılır). */
export function normalizePath(input: string): string {
  const noQuery = input.split(/[?#]/)[0] || "/";
  const trimmed = noQuery.length > 1 ? noQuery.replace(/\/+$/, "") : noQuery;
  return trimmed || "/";
}

export function absoluteUrl(path: string): string {
  return path === "/" ? `${SITE.url}/` : `${SITE.url}${path}`;
}

export function resolveSeo(rawPath: string): ResolvedSeo {
  const path = normalizePath(rawPath);
  const route = PUBLIC_ROUTES.find(r => r.path === path);
  if (route) {
    return {
      status: 200,
      title: route.title,
      description: route.description,
      indexable: true,
      canonical: absoluteUrl(route.path),
      route,
    };
  }
  if (path === "/admin" || path.startsWith("/admin/")) {
    return {
      status: 200,
      title: `Yönetim Paneli | ${SITE.name}`,
      description: "Yönetim paneli.",
      indexable: false,
    };
  }
  return {
    status: 404,
    title: `Sayfa Bulunamadı | ${SITE.name}`,
    description: "Aradığınız sayfa bulunamadı.",
    indexable: false,
  };
}

type JsonLd = Record<string, unknown>;

const BUSINESS_ID = `${SITE.url}/#business`;
const WEBSITE_ID = `${SITE.url}/#website`;

function businessJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "MobilePhoneStore",
    "@id": BUSINESS_ID,
    name: SITE.name,
    description:
      "Manavgat / Antalya'da Türkcell Yetkili Bayisi. Cep telefonları, Türkcell paketleri, Superbox ve telefon aksesuarları.",
    url: `${SITE.url}/`,
    image: `${SITE.url}${SITE.ogImage}`,
    telephone: SITE.phone,
    email: SITE.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.street,
      addressLocality: SITE.city,
      addressRegion: SITE.region,
      addressCountry: SITE.country,
    },
    areaServed: { "@type": "City", name: SITE.city },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "09:00",
        closes: "20:00",
      },
    ],
  };
}

function websiteJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: `${SITE.url}/`,
    name: SITE.name,
    inLanguage: "tr-TR",
    publisher: { "@id": BUSINESS_ID },
  };
}

/** Yalnızca indekslenebilir sayfalar için yapılandırılmış veri. */
export function buildJsonLd(seo: ResolvedSeo): JsonLd[] {
  const route = seo.route;
  if (!seo.indexable || !route) return [];

  const blocks: JsonLd[] = [
    businessJsonLd(),
    websiteJsonLd(),
    {
      "@context": "https://schema.org",
      "@type": route.pageType,
      "@id": `${seo.canonical}#webpage`,
      url: seo.canonical,
      name: seo.title,
      description: seo.description,
      inLanguage: "tr-TR",
      isPartOf: { "@id": WEBSITE_ID },
      about: { "@id": BUSINESS_ID },
    },
  ];

  if (route.path !== "/" && route.crumb) {
    blocks.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Ana Sayfa",
          item: absoluteUrl("/"),
        },
        {
          "@type": "ListItem",
          position: 2,
          name: route.crumb,
          item: seo.canonical,
        },
      ],
    });
  }

  if (route.path === "/") {
    blocks.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQ_ITEMS.map(item => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    });
  }

  return blocks;
}

/** <script> içine güvenle gömmek için JSON'u serileştirir ("<" kaçışlı). */
export function serializeJsonLd(block: JsonLd): string {
  return JSON.stringify(block).replace(/</g, "\\u003c");
}
