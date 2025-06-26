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
    <div className="container mx-auto px-4 py-8 bg-scheme-1-background">
      <h1 className="text-desktop-heading1 font-heading font-bold text-center mb-8 text-scheme-1-text">Sermons</h1>

      <Card className="mb-8 bg-scheme-2-background border border-scheme-2-border">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-scheme-2-text">
            <span className="text-desktop-heading3 font-heading">Sermon Information</span>
            <Link href={youtubeChannelUrl} target="_blank" rel="noopener noreferrer" className="text-primary-orange hover:text-primary-orange-dark transition-colors">
              <Youtube className="h-8 w-8" />
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-desktop-textLarge text-scheme-2-text opacity-80 font-body">
            We upload our sermons live to YouTube every Sunday. Visit our channel for the latest sermons.
          </p>
        </CardContent>
      </Card>

      <h2 className="text-desktop-heading2 font-heading font-bold mt-8 mb-4 text-scheme-1-text">Popular Sermons</h2>
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
    </div>
  );
}