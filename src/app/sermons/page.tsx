import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { fetchLatestYoutubeVideosByChannelId } from '@/lib/youtube';

export const revalidate = 1800;

export default async function SermonsPage() {
  // Keep using the existing channel ID from the codebase for reliability.
  const channelId = 'UCo8E0MoXuz_E5BvaROleSDQ';
  const liveStreamUrl = 'https://www.youtube.com/@firstbaptistchurchoffenton3463/live';

  let videos: Awaited<ReturnType<typeof fetchLatestYoutubeVideosByChannelId>> = [];
  try {
    videos = await fetchLatestYoutubeVideosByChannelId(channelId, 9);
  } catch (error) {
    videos = [];
  }

  const getEmbedUrl = (videoId: string) => `https://www.youtube.com/embed/${videoId}`;

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl sm:text-5xl font-heading font-bold text-center mb-8">Sermons</h1>

      <section className="mb-10 rounded-xl bg-primary text-primary-foreground px-6 py-8 sm:py-10">
        <div className="flex flex-col items-center text-center gap-3">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold">Join Our Live Service!</h2>
          <p className="text-lg sm:text-xl">Sundays at 10:30 AM EDT</p>
          <Button asChild size="lg" variant="secondary" className="mt-2">
            <Link href={liveStreamUrl} target="_blank" rel="noopener noreferrer">
              Watch Live Now
            </Link>
          </Button>
        </div>
      </section>

      <h2 className="text-3xl sm:text-4xl font-heading font-bold mt-8 mb-4">Latest Sermons</h2>
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
    </main>
  );
}