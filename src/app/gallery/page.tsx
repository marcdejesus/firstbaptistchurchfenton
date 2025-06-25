"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import Image from 'next/image';
import { Camera, Video } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

// Mock data simulating Firestore structure. 
// Replace this with actual data fetching from Firestore.
const mockAlbums = [
  {
    id: '1',
    name: 'Sunday Services',
    description: 'Photos from our weekly worship services.',
    thumbnail: '/images/gallery/service-thumb.jpg',
  },
  {
    id: '2',
    name: 'Community Outreach',
    description: 'Serving our local community.',
    thumbnail: '/images/gallery/outreach-thumb.jpg',
  },
  {
    id: '3',
    name: 'Youth Group',
    description: 'Fun and fellowship with our youth.',
    thumbnail: '/images/gallery/youth-thumb.jpg',
  },
];

const mockMedia = {
  '1': [
    { id: '101', type: 'photo', url: '/images/gallery/service-1.jpg', title: 'Worship' },
    { id: '102', type: 'photo', url: '/images/gallery/service-2.jpg', title: 'Sermon' },
    { id: '103', type: 'video', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', title: 'Special Music' },
  ],
  '2': [
    { id: '201', type: 'photo', url: '/images/gallery/outreach-1.jpg', title: 'Food Drive' },
  ],
  '3': [
    { id: '301', type: 'photo', url: '/images/gallery/youth-1.jpg', title: 'Game Night' },
  ]
};

export default function GalleryPage() {
  const [albums, setAlbums] = useState(mockAlbums);
  const [loading, setLoading] = useState(false);
  
  // NOTE: This is an example of how you would fetch from firestore
  // useEffect(() => {
  //   const fetchAlbums = async () => {
  //     setLoading(true);
  //     try {
  //       const querySnapshot = await getDocs(collection(db, "gallery-albums"));
  //       const albumsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  //       setAlbums(albumsData);
  //     } catch (error) {
  //       console.error("Error fetching albums: ", error);
  //     }
  //     setLoading(false);
  //   };
  //   fetchAlbums();
  // }, []);


  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Photo & Video Gallery</h1>
      {loading ? (
        <p>Loading albums...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {albums.map((album) => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </div>
      )}
    </div>
  );
}

function AlbumCard({ album }: { album: { id: string, name: string, description: string, thumbnail: string } }) {
  const [media, setMedia] = useState(mockMedia[album.id as keyof typeof mockMedia] || []);
  const [loading, setLoading] = useState(false);
  
  // NOTE: This is an example of how you would fetch from firestore
  // useEffect(() => {
  //   const fetchMedia = async () => {
  //     setLoading(true);
  //     try {
  //       const querySnapshot = await getDocs(collection(db, `gallery-albums/${album.id}/media`));
  //       const mediaData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  //       setMedia(mediaData);
  //     } catch (error) {
  //       console.error("Error fetching media: ", error);
  //     }
  //     setLoading(false);
  //   };
  //   fetchMedia();
  // }, [album.id]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="relative h-48 w-full mb-4">
              <Image src={album.thumbnail} alt={album.name} layout="fill" objectFit="cover" className="rounded-t-lg" />
            </div>
            <CardTitle>{album.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{album.description}</p>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{album.name}</DialogTitle>
        </DialogHeader>
        {loading ? (
          <p>Loading media...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-4">
            {media.map(item => (
              <MediaItem key={item.id} item={item} />
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function MediaItem({ item }: { item: { id: string, type: string, url: string, title: string } }) {
  if (item.type === 'video') {
    return (
      <div className="aspect-w-16 aspect-h-9">
        <iframe
          src={item.url}
          title={item.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="rounded-lg"
        ></iframe>
      </div>
    );
  }

  return (
    <div className="relative group">
      <Image src={item.url} alt={item.title} width={200} height={200} className="rounded-lg object-cover w-full h-full" />
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
        <p className="text-white opacity-0 group-hover:opacity-100 transition-opacity">{item.title}</p>
      </div>
    </div>
  );
} 