import Script from 'next/script';

interface ChurchStructuredDataProps {
  pageName?: string;
  pageDescription?: string;
  pageUrl?: string;
}

export function ChurchStructuredData({ 
  pageName = 'First Baptist Church of Fenton',
  pageDescription = 'Growing in Faith, Sharing God\'s Love',
  pageUrl = 'https://fbcfenton.org'
}: ChurchStructuredDataProps) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Church",
    "name": "First Baptist Church of Fenton",
    "alternateName": "FBC Fenton",
    "description": "A welcoming Baptist church community in Fenton, Michigan, dedicated to growing in faith and sharing God's love through worship, fellowship, and service.",
    "url": "https://fbcfenton.org",
    "logo": "https://fbcfenton.org/logo.png",
    "image": "https://fbcfenton.org/og-image.jpg",
    "telephone": "(810) 629-2241",
    "email": "info@fbcfenton.org",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "860 N Leroy St",
      "addressLocality": "Fenton",
      "addressRegion": "MI",
      "postalCode": "48430",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "42.7917",
      "longitude": "-83.7513"
    },
    "openingHours": [
      "Su 10:00-11:00",
      "Su 18:00-19:00",
      "We 19:00-20:00"
    ],
    "servesCuisine": [],
    "priceRange": "Free",
    "currenciesAccepted": "USD",
    "paymentAccepted": "Cash, Check, Online",
    "founder": {
      "@type": "Person",
      "name": "Church Founders"
    },
    "foundingDate": "1800s",
    "sameAs": [
      "https://www.facebook.com/FBCFenton",
      "https://www.youtube.com/FBCFenton",
      "https://www.instagram.com/fbcfenton"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Church Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Sunday Morning Worship",
            "description": "Traditional worship service with contemporary elements"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Sunday Evening Service",
            "description": "Casual evening worship and fellowship"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Wednesday Bible Study",
            "description": "Mid-week Bible study and prayer"
          }
        }
      ]
    },
    "department": [
      {
        "@type": "Organization",
        "name": "Youth Ministry",
        "description": "Ministry for students grades 6-12"
      },
      {
        "@type": "Organization", 
        "name": "Children's Ministry",
        "description": "Programs for children and families"
      },
      {
        "@type": "Organization",
        "name": "Worship Ministry",
        "description": "Music and worship leadership"
      }
    ]
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "First Baptist Church Fenton",
    "url": "https://fbcfenton.org",
    "description": pageDescription,
    "publisher": {
      "@type": "Church",
      "name": "First Baptist Church of Fenton"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://fbcfenton.org/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://fbcfenton.org"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": pageName,
        "item": pageUrl
      }
    ]
  };

  return (
    <>
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
    </>
  );
}

// Specialized structured data for events
export function EventStructuredData({ event }: { 
  event: {
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    url: string;
  }
}) {
  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": event.title,
    "description": event.description,
    "startDate": event.date,
    "endDate": event.date,
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "location": {
      "@type": "Place",
      "name": event.location,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "860 N Leroy St",
        "addressLocality": "Fenton",
        "addressRegion": "MI",
        "postalCode": "48430",
        "addressCountry": "US"
      }
    },
    "organizer": {
      "@type": "Church",
      "name": "First Baptist Church of Fenton",
      "url": "https://fbcfenton.org"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "url": event.url
    }
  };

  return (
    <Script
      id="event-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(eventSchema),
      }}
    />
  );
}

// Structured data for blog articles
export function ArticleStructuredData({ article }: {
  article: {
    title: string;
    description: string;
    author: string;
    datePublished: string;
    dateModified?: string;
    url: string;
    imageUrl?: string;
  }
}) {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.description,
    "author": {
      "@type": "Person",
      "name": article.author
    },
    "publisher": {
      "@type": "Church",
      "name": "First Baptist Church of Fenton",
      "logo": {
        "@type": "ImageObject",
        "url": "https://fbcfenton.org/logo.png"
      }
    },
    "datePublished": article.datePublished,
    "dateModified": article.dateModified || article.datePublished,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": article.url
    },
    ...(article.imageUrl && {
      "image": {
        "@type": "ImageObject",
        "url": article.imageUrl,
        "width": 1200,
        "height": 630
      }
    })
  };

  return (
    <Script
      id="article-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(articleSchema),
      }}
    />
  );
} 