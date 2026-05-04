/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { TRACKS } from './constants';

export default function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  useEffect(() => {
    if (score > highScore) setHighScore(score);
  }, [score, highScore]);

  return (
    <div className="flex flex-col h-screen w-full bg-[#050505] font-mono text-white selection:bg-cyan-500/30 overflow-hidden">
      {/* Header */}
      <header className="h-16 flex items-center justify-between px-8 border-b border-white/10 bg-black/50 backdrop-blur-md z-50">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 flex items-center justify-center bg-black neon-border">
            <div className="w-2 h-2 bg-[#00f3ff]"></div>
          </div>
          <h1 className="text-xl font-bold tracking-tighter neon-text-blue">SYNTH_SNAKE v1.0</h1>
        </div>
        <div className="flex gap-12">
          <div className="text-center">
            <span className="block text-[10px] uppercase opacity-50">Current Score</span>
            <span className="text-2xl neon-text-green tabular-nums">
              {score.toString().padStart(6, '0')}
            </span>
          </div>
          <div className="text-center">
            <span className="block text-[10px] uppercase opacity-50">High Score</span>
            <span className="text-2xl opacity-80 tabular-nums">
              {highScore.toString().padStart(6, '0')}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Aside: Playlist */}
        <aside className="w-72 bg-black/40 border-r border-white/10 p-6 flex flex-col gap-6">
          <div>
            <h2 className="text-xs uppercase tracking-widest text-white/40 mb-4">Neural Playlist</h2>
            <div className="space-y-1">
              {TRACKS.map((track, i) => (
                <div 
                  key={track.id} 
                  onClick={() => setCurrentTrackIndex(i)}
                  className={`track-item ${currentTrackIndex === i ? 'active' : 'hover:bg-white/5'}`}
                >
                  <div className="flex flex-col">
                    <span className={`text-sm ${currentTrackIndex === i ? 'neon-text-blue font-bold' : ''}`}>{track.title}</span>
                    <span className="text-[10px] opacity-60 uppercase tracking-tighter">{track.artist}</span>
                  </div>
                  <span className="text-xs opacity-40">{track.duration}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-auto">
            <div className="p-4 bg-white/5 rounded border border-white/10 text-center">
              <p className="text-[10px] leading-relaxed opacity-60 italic whitespace-pre-line">
                {"\"Keep the beat,\nkeep the heat.\nDon't hit the walls.\""}
              </p>
            </div>
          </div>
        </aside>

        {/* Center Section: Snake Game */}
        <section className="flex-1 relative flex flex-col items-center justify-center grid-bg">
          <SnakeGame onScoreUpdate={setScore} />
        </section>

        {/* Right Aside: Visualizer/Stats */}
        <aside className="w-72 bg-black/40 border-l border-white/10 p-6 flex flex-col gap-8">
          <div>
            <h2 className="text-xs uppercase tracking-widest text-white/40 mb-4">Spectral Analysis</h2>
            <div className="flex items-end gap-1 h-32 mb-8">
              {[0.4, 0.6, 0.8, 1, 0.7, 0.5, 0.2].map((op, i) => (
                <motion.div
                  key={i}
                  animate={{ height: ['25%', '60%', '40%', '80%', '25%'] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                  className="w-full bg-[#00f3ff]"
                  style={{ opacity: op }}
                />
              ))}
            </div>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] uppercase opacity-40">
                  <span>Latency</span>
                  <span>12ms</span>
                </div>
                <div className="w-full h-1 bg-white/10">
                  <div className="w-3/4 h-full bg-[#00f3ff]"></div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] uppercase opacity-40">
                  <span>System Load</span>
                  <span>42%</span>
                </div>
                <div className="w-full h-1 bg-white/10">
                  <div className="w-1/2 h-full bg-[#ff00ff]"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-auto p-4 border border-cyan-500/20 rounded-md bg-cyan-500/5">
             <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] uppercase tracking-widest text-green-500">Node Secure</span>
             </div>
             <p className="text-[9px] text-white/40 leading-relaxed uppercase tracking-tighter">
               Neural interface synchronized with local machine. Simulation integrity at maximum.
             </p>
          </div>
        </aside>
      </main>

      {/* Footer: Music Player Controls */}
      <MusicPlayer 
        currentIndex={currentTrackIndex} 
        onTrackChange={setCurrentTrackIndex} 
      />
    </div>
  );
}

