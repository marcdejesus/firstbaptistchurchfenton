export type YoutubeVideo = {
  id: string;
  title: string;
  publishedAt: string;
  url: string;
  thumbnailUrl?: string;
};

function extractFirstMatch(content: string, regex: RegExp): string | undefined {
  const match = content.match(regex);
  return match?.[1];
}

export async function fetchLatestYoutubeVideosByChannelId(
  channelId: string,
  maxResults: number = 9
): Promise<YoutubeVideo[]> {
  const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(
    channelId
  )}`;

  const response = await fetch(feedUrl, {
    // Cache at the edge; caller can also set ISR via revalidate on the page
    next: { revalidate: 1800 },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch YouTube feed: ${response.status}`);
  }

  const xml = await response.text();

  const entryBlocks = xml.split('<entry>').slice(1).map((block) => block.split('</entry>')[0]);

  const videos: YoutubeVideo[] = entryBlocks.map((entry) => {
    const id = extractFirstMatch(entry, /<yt:videoId>([^<]+)<\/yt:videoId>/);
    const title = extractFirstMatch(entry, /<title>([^<]+)<\/title>/);
    const publishedAt = extractFirstMatch(entry, /<published>([^<]+)<\/published>/);
    const url = extractFirstMatch(entry, /<link\s+rel="alternate"\s+href="([^"]+)"/);
    const thumbnailUrl = extractFirstMatch(
      entry,
      /<media:thumbnail[^>]+url="([^"]+)"/,
    );

    if (!id || !title || !publishedAt || !url) {
      return undefined;
    }

    return { id, title, publishedAt, url, thumbnailUrl } as YoutubeVideo;
  })
  .filter((v): v is YoutubeVideo => Boolean(v))
  .slice(0, Math.max(0, maxResults));

  return videos;
}


