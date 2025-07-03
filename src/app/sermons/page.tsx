import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Youtube } from 'lucide-react';

export default function SermonsPage() {
  const youtubeChannelUrl = 'https://www.youtube.com/channel/UCo8E0MoXuz_E5BvaROleSDQ';

  const sermonVideoIds = [
    'xqzYRiO4ifQ',
    'YWF4E5DIK8g',
    't2bpMv-i3tc',
    'jgcpH1lGy7o',
    '9WukRR_lDmk',
    'WdbxVEx-LRQ',
    'TCSjNqhfaz4',
    'GsgEh2qbpnY',
    '1iFCUyE0jts',
  ];

  const getEmbedUrl = (videoId: string) => `https://www.youtube.com/embed/${videoId}`;



  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl sm:text-5xl font-heading font-bold text-center mb-8">Sermons</h1>

      <Card className="mb-8 bg-background-secondary border-border-light">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="text-2xl font-heading">Sermon Information</span>
            <Link href={youtubeChannelUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-dark transition-colors">
              <Youtube className="h-8 w-8" />
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-text-secondary font-body">
            We upload our sermons live to YouTube every Sunday. Visit our channel for the latest sermons.
          </p>
        </CardContent>
      </Card>

      <h2 className="text-3xl sm:text-4xl font-heading font-bold mt-8 mb-4">Popular Sermons</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 {sermonVideoIds.map((videoId) => (
 <div key={videoId} className="rounded-md overflow-hidden shadow-md flex flex-col"> {/* Added flex-col for vertical stacking if needed later, currently not strictly necessary for iframe */}
 <div className="relative" style={{ paddingBottom: '56.25%' }}> {/* 16:9 Aspect Ratio */}
            <iframe
              src={getEmbedUrl(videoId)}
              frameBorder="0"
 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              className="absolute top-0 left-0 w-full h-full"
              allowFullScreen></iframe>
          </div>
 </div>))}
      </div>
    </main>
  );
}