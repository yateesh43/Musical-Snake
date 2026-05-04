import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipBack, SkipForward, Music, Disc } from 'lucide-react';
import { TRACKS } from '../constants';

interface MusicPlayerProps {
  currentIndex: number;
  onTrackChange: (index: number) => void;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ currentIndex, onTrackChange }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const currentTrack = TRACKS[currentIndex];

  const togglePlay = () => setIsPlaying(!isPlaying);
  
  const nextTrack = () => {
    onTrackChange((currentIndex + 1) % TRACKS.length);
  };

  const prevTrack = () => {
    onTrackChange((currentIndex - 1 + TRACKS.length) % TRACKS.length);
  };

  return (
    <footer className="h-24 bg-black border-t border-white/10 px-8 flex items-center justify-between z-50">
      {/* Track Info */}
      <div className="flex items-center gap-4 w-72">
        <div className="w-12 h-12 bg-[#00f3ff]/20 neon-border flex items-center justify-center relative overflow-hidden group">
          <img 
            src={currentTrack.cover} 
            alt={currentTrack.title}
            className={`absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-[5000ms] ${isPlaying ? 'scale-125' : 'scale-100'}`}
          />
          <span className="relative neon-text-blue text-lg">♫</span>
        </div>
        <div>
          <p className="text-sm font-bold text-white tracking-tight">{currentTrack.title}</p>
          <p className="text-[10px] opacity-50 uppercase tracking-widest">{currentTrack.artist}</p>
        </div>
      </div>

      {/* Center Controls & Progress */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex gap-6 items-center">
          <button 
            onClick={prevTrack}
            className="text-white/40 hover:text-[#00f3ff] transition-colors p-2"
          >
            <SkipBack className="w-5 h-5" />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-14 h-14 rounded-full border-2 border-[#00f3ff] flex items-center justify-center neon-text-blue hover:bg-[#00f3ff]/10 transition-all active:scale-90"
          >
            {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
          </button>

          <button 
            onClick={nextTrack}
            className="text-white/40 hover:text-[#00f3ff] transition-colors p-2"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-3 w-[400px]">
          <span className="text-[10px] opacity-40 tabular-nums">01:24</span>
          <div className="flex-1 h-1 bg-white/10 relative">
            <motion.div 
              animate={isPlaying ? { width: '100%' } : { width: '33%' }}
              transition={isPlaying ? { duration: 180, ease: "linear" } : { duration: 0.5 }}
              className="absolute top-0 left-0 h-full bg-[#00f3ff] shadow-[0_0_10px_#00f3ff]" 
            />
          </div>
          <span className="text-[10px] opacity-40 tabular-nums">{currentTrack.duration}</span>
        </div>
      </div>

      {/* Volume / Extra Info */}
      <div className="flex items-center gap-4 w-72 justify-end">
        <div className="flex flex-col items-end gap-1">
          <span className="text-[9px] opacity-40 uppercase tracking-widest">Master Vol</span>
          <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="w-4/5 h-full bg-white/60"></div>
          </div>
        </div>
        <div className="w-px h-8 bg-white/10 mx-2" />
        <button className="text-white/20 hover:text-white transition-colors">
          <Music className="w-4 h-4" />
        </button>
      </div>
    </footer>
  );
};

