import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/layout/PageLayout';
import { fetchLatestYoutubeVideosByChannelId } from '@/lib/youtube';
import { sermonsPageMetadata } from '@/lib/seo';

export const metadata: Metadata = sermonsPageMetadata;

export const revalidate = 1800;

export default async function SermonsPage() {
  // Keep using the existing channel ID from the codebase for reliability.
  const channelId = 'UCo8E0MoXuz_E5BvaROleSDQ';
  const liveStreamUrl = 'https://www.youtube.com/@firstbaptistchurchoffenton3463/live';
  const channelUrl = `https://www.youtube.com/channel/${channelId}`;

  let videos: Awaited<ReturnType<typeof fetchLatestYoutubeVideosByChannelId>> = [];
  try {
    videos = await fetchLatestYoutubeVideosByChannelId(channelId, 9);
  } catch (error) {
    videos = [];
  }

  const getEmbedUrl = (videoId: string) => `https://www.youtube.com/embed/${videoId}`;

  return (
    <PageLayout
      title="Sermons"
      subtitle="We stream our sermons live on YouTube every Sunday at 10:30 AM."
    >
      <div className="flex gap-4 justify-center mb-8">
        <Button asChild>
          <Link href={channelUrl} target="_blank" rel="noopener noreferrer">
            View Channel
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href={liveStreamUrl} target="_blank" rel="noopener noreferrer">
            View Live Link
          </Link>
        </Button>
      </div>

      <h2 className="text-3xl sm:text-4xl font-heading font-bold mt-8 mb-4 text-center">Latest Sermons</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <div key={video.id} className="rounded-md overflow-hidden shadow-md">
            <div className="relative" style={{ paddingBottom: '56.25%' }}>
              <iframe
                title={video.title}
                src={getEmbedUrl(video.id)}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                className="absolute top-0 left-0 w-full h-full"
                allowFullScreen
              />
            </div>
          </div>
        ))}
      </div>
    </PageLayout>
  );
}