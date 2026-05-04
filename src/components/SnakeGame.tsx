import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Play, RotateCcw } from 'lucide-react';
import { Point, Direction } from '../constants';

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
const INITIAL_DIRECTION: Direction = 'UP';
const GAME_SPEED = 150;

interface SnakeGameProps {
  onScoreUpdate: (score: number) => void;
}

export const SnakeGame: React.FC<SnakeGameProps> = ({ onScoreUpdate }) => {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [score, setScore] = useState(0);
  
  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const moveSnake = useCallback(() => {
    if (isPaused || isGameOver) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      // Wall collision
      if (
        newHead.x < 0 || newHead.x >= GRID_SIZE ||
        newHead.y < 0 || newHead.y >= GRID_SIZE
      ) {
        setIsGameOver(true);
        return prevSnake;
      }

      // Self collision
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        const newScore = score + 10;
        setScore(newScore);
        onScoreUpdate(newScore);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isPaused, isGameOver, generateFood, score, onScoreUpdate]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
        case ' ': setIsPaused(p => !p); break;
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction]);

  useEffect(() => {
    const interval = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(interval);
  }, [moveSnake]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    onScoreUpdate(0);
    setIsGameOver(false);
    setIsPaused(false);
    setFood(generateFood(INITIAL_SNAKE));
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div 
        id="snake-board"
        className="relative bg-black/80 neon-border overflow-hidden"
        style={{ width: GRID_SIZE * 20, height: GRID_SIZE * 20 }}
      >
        {/* Snake Rendering */}
        {snake.map((segment, i) => (
          <motion.div
            key={`${i}-${segment.x}-${segment.y}`}
            initial={false}
            animate={{ left: segment.x * 20 + 1, top: segment.y * 20 + 1 }}
            className="snake-dot"
            style={{ 
              background: i === 0 ? '#39ff14' : '#39ff14cc',
              boxShadow: i === 0 ? '0 0 15px #39ff14' : '0 0 5px #39ff14'
            }}
          />
        ))}

        {/* Food Rendering */}
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="food-dot"
          style={{ left: food.x * 20 + 1, top: food.y * 20 + 1 }}
        />

        {/* Overlays */}
        <AnimatePresence>
          {isPaused && !isGameOver && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 bg-black/60 backdrop-blur-sm flex items-center justify-center cursor-pointer"
              onClick={() => setIsPaused(false)}
            >
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full border border-cyan-400 flex items-center justify-center text-cyan-400 bg-cyan-400/10 hover:bg-cyan-400/20 transition-colors">
                  <Play className="w-8 h-8 ml-1" />
                </div>
                <span className="font-mono text-cyan-400 uppercase tracking-widest text-xs">Press Space to Start</span>
              </div>
            </motion.div>
          )}

          {isGameOver && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 z-20 bg-black/90 backdrop-blur-md flex items-center justify-center p-8 text-center"
            >
              <div className="flex flex-col items-center gap-6">
                <div className="space-y-1">
                  <h2 className="text-3xl font-bold text-white uppercase tracking-tighter neon-text-blue">System Crash</h2>
                  <p className="text-[#39ff14] font-mono text-[10px] uppercase tracking-widest opacity-70">Simulation Terminated</p>
                </div>
                
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest">Score Captured</span>
                  <span className="text-5xl font-bold text-[#39ff14] neon-text-green">{score}</span>
                </div>

                <button 
                  onClick={resetGame}
                  className="flex items-center gap-3 px-8 py-3 border border-white/20 hover:border-cyan-400 hover:text-cyan-400 text-white font-bold uppercase tracking-widest rounded-sm transition-all active:scale-95"
                >
                  <RotateCcw className="w-5 h-5" />
                  Reboot
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex gap-4">
        <div className="px-4 py-1 border border-white/20 text-[10px] opacity-40 uppercase tracking-widest">Arrow Keys to Move</div>
        <div className="px-4 py-1 border border-white/20 text-[10px] opacity-40 uppercase tracking-widest">Space to Pause Game</div>
      </div>
    </div>
  );
};

