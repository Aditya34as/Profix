import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, url, serviceSchema }) => {
  const currentTitle = title ? `${title} | Pro Fix Plumbing & HVAC` : 'Pro Fix Plumbing & HVAC';
  const defaultDescription = 'Emergency plumbing and AC repair in Delhi NCR. 24/7 dispatched technicians.';
  const siteUrl = 'https://www.profixindia.in';
  const currentUrl = url || siteUrl;
  const currentDescription = description || defaultDescription;

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Pro Fix Plumbing & HVAC",
    "url": siteUrl,
    "telephone": "+919876543210",
    "priceRange": "₹₹",
    "image": `${siteUrl}/hero_bg.png`,
    "description": "Top-rated plumbing and AC repair services in Delhi NCR. 90-minute dispatch, genuine parts, upfront pricing.",
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
      { "@type": "City", "name": "Faridabad" }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "200",
      "bestRating": "5"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "00:00",
      "closes": "23:59"
    },
    "sameAs": [
      "https://wa.me/919876543210"
    ]
  };

  return (
    <Helmet>
      <title>{currentTitle}</title>
      <meta name="description" content={currentDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={currentUrl} />
      
      {/* Open Graph Tags for Social Sharing */}
      <meta property="og:title" content={currentTitle} />
      <meta property="og:description" content={currentDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:site_name" content="Pro Fix Plumbing & HVAC" />
      <meta property="og:locale" content="en_IN" />
      <meta property="og:image" content={`${siteUrl}/hero_bg.png`} />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={currentTitle} />
      <meta name="twitter:description" content={currentDescription} />
      <meta name="twitter:image" content={`${siteUrl}/hero_bg.png`} />
      
      {/* LocalBusiness JSON-LD Schema */}
      <script type="application/ld+json">
        {JSON.stringify(localBusinessSchema)}
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
