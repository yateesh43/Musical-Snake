export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  cover: string;
}

export const TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Drift',
    artist: 'AI Synth-01',
    duration: '3:45',
    cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&h=400&fit=crop'
  },
  {
    id: '2',
    title: 'Cyber Pulse',
    artist: 'Neural Wave',
    duration: '4:20',
    cover: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=400&fit=crop'
  },
  {
    id: '3',
    title: 'Midnight Grid',
    artist: 'Byte Beat',
    duration: '3:15',
    cover: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=400&fit=crop'
  }
];

export type Point = { x: number; y: number };
export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
