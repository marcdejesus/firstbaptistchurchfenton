import { Metadata } from 'next';

interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  imageAlt?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
}

export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords = [],
    image,
    imageAlt,
    url,
    type = 'website',
    publishedTime,
    modifiedTime,
    author,
    section,
    tags = []
  } = config;

  const baseUrl = 'https://fbcfenton.org';
  const fullUrl = url ? `${baseUrl}${url}` : baseUrl;
  const ogImage = image || '/church.png';
  const ogImageAlt = imageAlt || 'First Baptist Church Fenton';

  const metadata: Metadata = {
    title,
    description,
    keywords: [
        // Core identity
  'First Baptist Church Fenton', 'FBC Fenton', 'First Baptist Church', 'Baptist Church',
  'Christian Church', 'Bible Church', 'Faith Community', 'Gospel-centered church',
  'Christ-centered church', 'Bible-believing church', 'evangelical church',

  // Location & geos
  'Fenton Michigan', 'Fenton MI', 'church in Fenton MI', 'local church Fenton',
  'church near me Fenton', 'Genesee County church', 'Genesee County MI',
  'Linden MI church', 'Holly MI church', 'Grand Blanc church', 'Flint MI church',
  'Brighton MI church', 'Hartland MI church', 'Davisburg MI church',
  'Swartz Creek church', 'Highland MI church', 'Tyrone Township church',
  'Argentine Township church', 'Oceola Township church', 'Livingston County church',

  // Worship & services
  'Sunday Service', 'Sunday worship', 'Christian worship service', 'Baptist worship service',
  'traditional worship', 'contemporary worship', 'blended worship', 'praise and worship',
  'church music', 'hymns', 'praise band', 'choir', 'Communion', 'Lord’s Supper',
  'Baptism', 'new here', 'plan a visit', 'service times', 'directions to church',

  // Teaching & discipleship
  'Bible Study', 'bible teaching', 'biblical preaching', 'expository preaching',
  'Christian discipleship', 'small groups', 'life groups', 'home groups',
  'adult Sunday school', 'Christian education',

  // Prayer & care
  'prayer', 'prayer requests', 'intercessory prayer', 'pastoral care',
  'spiritual counseling', 'care ministry',

  // Family & next gen
  'Family Church', 'family-friendly church', 'children’s ministry', 'kids church',
  'nursery ministry', 'elementary ministry', 'youth ministry', 'youth group',
  'student ministry', 'college and young adults', 'young professionals ministry',
  'men’s ministry', 'women’s ministry', 'marriage enrichment', 'senior adult ministry',

  // Outreach & community
  'Christian fellowship', 'community outreach', 'local missions', 'global missions',
  'service projects', 'volunteer opportunities', 'community events', 'church events',

  // Media & online
  'sermons', 'sermon archive', 'watch sermons online', 'church livestream',
  'church podcast', 'Christian devotionals', 'daily devotion',

  // Seasons & special services
  'Easter service', 'Good Friday service', 'Palm Sunday service',
  'Christmas service', 'Christmas Eve service', 'Advent services',
  'Vacation Bible School', 'VBS Fenton', 'back to church Sunday',

  // Beliefs & seekers
  'learn about Jesus', 'what is the gospel', 'how to know God',
  'grow in faith', 'Christian faith', 'salvation in Jesus Christ',
  'bible answers', 'Christian resources',

  // Practical visit terms
  'church parking', 'church location', 'church address Fenton',
  'wheelchair accessible church', 'welcome team', 'greeter team',

  // Ministries & service areas
  'missions and outreach', 'prayer team', 'hospitality team',
  'worship team', 'tech team', 'media team', 'ushers', 'greeters',

  // Local intent variations
  'best church in Fenton', 'Baptist church near Fenton MI',
  'church for families Fenton', 'youth group near Fenton',
  'kids program Fenton MI', 'Bible study near me Fenton',
  'Christian church near Linden', 'Christian church near Holly',

  // Event intent
  'church calendar', 'upcoming church events', 'fellowship events',
  'community dinners', 'holiday services',

  // Misc helpful variants
  'faith community Fenton', 'Christian community Fenton',
  'non-denominational style worship Fenton', 'traditional Baptist values',
  
    ],
    authors: author ? [{ name: author }] : [{ name: 'First Baptist Church Fenton' }],
    creator: 'First Baptist Church Fenton',
    publisher: 'First Baptist Church Fenton',
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: url || '/',
    },
    openGraph: {
      title,
      description,
      url: fullUrl,
      siteName: 'First Baptist Church Fenton',
      locale: 'en_US',
      type,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: ogImageAlt,
        },
      ],
      ...(type === 'article' && {
        publishedTime,
        modifiedTime,
        authors: author ? [author] : undefined,
        section,
        tags,
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
      creator: '@FBCFenton',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };

  return metadata;
}

// Specific metadata generators for different page types
export const homePageMetadata = generateMetadata({
  title: 'First Baptist Church of Fenton - Growing in Faith, Sharing God\'s Love',
  description: 'Join First Baptist Church Fenton, a welcoming community in Fenton, Michigan. Sunday services at 10:30 AM. Experience authentic worship, biblical teaching, and genuine fellowship. All are welcome!',
  image: '/church.png',
  imageAlt: 'First Baptist Church Fenton - Welcome Home',
  url: '/',
});

export const aboutPageMetadata = generateMetadata({
  title: 'About Us - First Baptist Church Fenton',
  description: 'Learn about First Baptist Church Fenton\'s mission, values, and commitment to serving our community in Fenton, Michigan. Discover our story and what makes us unique.',
  keywords: ['about us', 'church history', 'mission', 'values', 'leadership'],
  url: '/about',
});

export const staffPageMetadata = generateMetadata({
  title: 'Meet Our Team - First Baptist Church Fenton',
  description: 'Meet the pastors and leaders of First Baptist Church Fenton. Learn about our dedicated team who serve our church and community with passion and commitment.',
  keywords: ['staff', 'leadership', 'pastors', 'ministry team', 'church leaders'],
  url: '/about/staff',
});

export const contactPageMetadata = generateMetadata({
  title: 'Contact Us - First Baptist Church Fenton',
  description: 'Get in touch with First Baptist Church Fenton. Find our location, service times, contact information, and ways to connect with our community.',
  keywords: ['contact', 'location', 'service times', 'directions', 'phone', 'email'],
  url: '/contact',
});

export const eventsPageMetadata = generateMetadata({
  title: 'Events & Calendar - First Baptist Church Fenton',
  description: 'Stay updated with upcoming events, services, and activities at First Baptist Church Fenton. Join us for worship, fellowship, and community events.',
  keywords: ['events', 'calendar', 'services', 'activities', 'fellowship'],
  url: '/events',
});

export const sermonsPageMetadata = generateMetadata({
  title: 'Sermons - First Baptist Church Fenton',
  description: 'Watch and listen to inspiring sermons from First Baptist Church Fenton. Join us for biblical teaching that applies to your daily life.',
  keywords: ['sermons', 'messages', 'preaching', 'bible teaching', 'worship'],
  url: '/sermons',
});

export const ministriesPageMetadata = generateMetadata({
  title: 'Ministries - First Baptist Church Fenton',
  description: 'Explore the various ministries and programs at First Baptist Church Fenton. Find opportunities to grow, serve, and connect with others.',
  keywords: ['ministries', 'programs', 'youth', 'children', 'adults', 'small groups'],
  url: '/ministries',
});

export const prayerPageMetadata = generateMetadata({
  title: 'Prayer Requests - First Baptist Church Fenton',
  description: 'Submit your prayer requests to First Baptist Church Fenton. Our prayer team is here to support you and lift up your needs in prayer.',
  keywords: ['prayer', 'prayer requests', 'spiritual support', 'intercession'],
  url: '/prayer',
});

export const blogPageMetadata = generateMetadata({
  title: 'Blog - First Baptist Church Fenton',
  description: 'Read inspiring articles, devotionals, and updates from First Baptist Church Fenton. Stay connected with our community through our blog.',
  keywords: ['blog', 'articles', 'devotionals', 'updates', 'inspiration'],
  url: '/blog',
});

// Function to generate blog post metadata
export function generateBlogPostMetadata(post: {
  title: string;
  excerpt?: string;
  thumbnailUrl?: string;
  publishedAt?: string;
  author?: { name: string };
  slug: string;
}): Metadata {
  const description = post.excerpt || `Read "${post.title}" on the First Baptist Church Fenton blog.`;
  const image = post.thumbnailUrl || '/church.png';
  const imageAlt = post.thumbnailUrl ? post.title : 'First Baptist Church Fenton';

  return generateMetadata({
    title: `${post.title} - First Baptist Church Fenton`,
    description,
    keywords: ['blog', 'article', 'devotional', 'christian', 'faith'],
    image,
    imageAlt,
    url: `/blog/${post.slug}`,
    type: 'article',
    publishedTime: post.publishedAt,
    author: post.author?.name,
    tags: ['blog', 'christian', 'faith'],
  });
}
