import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, url, serviceSchema, article, noindex }) => {
  const siteName = 'Pro Fix India — Trusted Home Services';
  const currentTitle = title ? `${title} | Pro Fix India` : siteName;
  const defaultDescription = 'Book verified AC repair, plumbing, geyser repair & deep cleaning professionals near you in Delhi NCR. 90-minute dispatch, upfront pricing, 30-day service warranty. Rated 4.9★ by 10,000+ customers.';
  const siteUrl = 'https://www.profixindia.in';
  const currentUrl = url || siteUrl;
  const currentDescription = description || defaultDescription;
  const defaultKeywords = 'home services near me, AC repair near me, plumber near me, geyser repair Delhi, cleaning services India, Pro Fix India, best home service app India, trusted technicians Delhi NCR, emergency plumber Gurgaon, AC servicing Noida';
  const currentKeywords = keywords ? `${keywords}, ${defaultKeywords}` : defaultKeywords;

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteUrl}/#business`,
    "name": "Pro Fix India",
    "alternateName": "Pro Fix Home Services",
    "url": siteUrl,
    "telephone": "+919876543210",
    "email": "info@profixindia.in",
    "priceRange": "₹₹",
    "image": [
      `${siteUrl}/hero_bg.png`,
      `${siteUrl}/auth_hero.png`,
      `${siteUrl}/trusted_tech.png`
    ],
    "logo": `${siteUrl}/favicon.svg`,
    "description": "India's most trusted marketplace for verified home service professionals. Book AC repair, plumbing, geyser installation, and deep cleaning services with transparent pricing and a 30-day service warranty.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "South Extension Part 2",
      "addressLocality": "New Delhi",
      "addressRegion": "DL",
      "postalCode": "110049",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "28.5762",
      "longitude": "77.2246"
    },
    "areaServed": [
      { "@type": "City", "name": "New Delhi" },
      { "@type": "City", "name": "Gurgaon" },
      { "@type": "City", "name": "Noida" },
      { "@type": "City", "name": "Faridabad" },
      { "@type": "City", "name": "Ghaziabad" },
      { "@type": "City", "name": "Greater Noida" },
      { "@type": "City", "name": "Dwarka" },
      { "@type": "City", "name": "Rohini" },
      { "@type": "City", "name": "Indirapuram" },
      { "@type": "City", "name": "Laxmi Nagar" }
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Home Services",
      "itemListElement": [
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "AC Repair & Servicing" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Plumbing Services" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Geyser & Water Heater Repair" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Deep Cleaning" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Electrical Repair" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Carpentry Services" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Painting Services" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Pest Control" } }
      ]
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "2450",
      "bestRating": "5",
      "worstRating": "1"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "08:00",
      "closes": "21:00"
    },
    "sameAs": [
      "https://www.instagram.com/profixindia",
      "https://www.facebook.com/profixindia",
      "https://x.com/profixindia",
      "https://www.youtube.com/@profixindia",
      "https://www.linkedin.com/company/profixindia",
      "https://wa.me/919876543210"
    ],
    "founder": {
      "@type": "Person",
      "name": "Pro Fix India Team"
    },
    "foundingDate": "2024"
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Pro Fix India",
    "url": siteUrl,
    "logo": `${siteUrl}/favicon.svg`,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+919876543210",
      "contactType": "customer service",
      "areaServed": "IN",
      "availableLanguage": ["English", "Hindi"]
    },
    "sameAs": [
      "https://www.instagram.com/profixindia",
      "https://www.facebook.com/profixindia",
      "https://x.com/profixindia",
      "https://www.youtube.com/@profixindia",
      "https://www.linkedin.com/company/profixindia",
      "https://wa.me/919876543210"
    ]
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Pro Fix India",
    "url": siteUrl,
    "inLanguage": "en-IN",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${siteUrl}/find-services?service={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": siteUrl },
      ...(url && url !== siteUrl ? [{ "@type": "ListItem", "position": 2, "name": title || "Page", "item": url }] : [])
    ]
  };

  // WebPage schema for each page
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": article ? "Article" : "WebPage",
    "name": currentTitle,
    "description": currentDescription,
    "url": currentUrl,
    "inLanguage": "en-IN",
    "isPartOf": { "@id": `${siteUrl}/#website` },
    "about": { "@id": `${siteUrl}/#business` },
    "dateModified": new Date().toISOString().split('T')[0],
  };

  return (
    <Helmet>
      <title>{currentTitle}</title>
      <meta name="description" content={currentDescription} />
      <meta name="keywords" content={currentKeywords} />
      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"} />
      <meta name="author" content="Pro Fix India" />
      <meta name="publisher" content="Pro Fix India" />
      <meta name="theme-color" content="#003c89" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-title" content="Pro Fix India" />
      <meta name="format-detection" content="telephone=yes" />
      <meta name="google" content="notranslate" />
      <meta httpEquiv="content-language" content="en-IN" />
      <link rel="canonical" href={currentUrl} />
      
      {/* Hreflang for India audience */}
      <link rel="alternate" hreflang="en-IN" href={currentUrl} />
      <link rel="alternate" hreflang="x-default" href={currentUrl} />
      
      {/* Geo Meta Tags for Local SEO */}
      <meta name="geo.region" content="IN-DL" />
      <meta name="geo.placename" content="New Delhi, India" />
      <meta name="geo.position" content="28.5762;77.2246" />
      <meta name="ICBM" content="28.5762, 77.2246" />
      
      {/* Open Graph Tags for Social Sharing */}
      <meta property="og:title" content={currentTitle} />
      <meta property="og:description" content={currentDescription} />
      <meta property="og:type" content={article ? "article" : "website"} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:site_name" content="Pro Fix India" />
      <meta property="og:locale" content="en_IN" />
      <meta property="og:image" content={`${siteUrl}/hero_bg.png`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Pro Fix India - Trusted Home Services Near You" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@profixindia" />
      <meta name="twitter:creator" content="@profixindia" />
      <meta name="twitter:title" content={currentTitle} />
      <meta name="twitter:description" content={currentDescription} />
      <meta name="twitter:image" content={`${siteUrl}/hero_bg.png`} />
      
      {/* LocalBusiness JSON-LD Schema */}
      <script type="application/ld+json">
        {JSON.stringify(localBusinessSchema)}
      </script>

      {/* Organization Schema */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>

      {/* WebSite Schema with SearchAction */}
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>

      {/* Breadcrumb Schema */}
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>

      {/* WebPage Schema */}
      <script type="application/ld+json">
        {JSON.stringify(webPageSchema)}
      </script>

      {/* Optional Service-specific Schemas */}
      {serviceSchema && Array.isArray(serviceSchema) && serviceSchema.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
      {serviceSchema && !Array.isArray(serviceSchema) && (
        <script type="application/ld+json">
          {JSON.stringify(serviceSchema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
