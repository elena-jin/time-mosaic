import React, { useState, useEffect } from 'react';
import { UserStats } from '../types';
import Button from './Button';
import { generateScheduleRoast } from '../services/geminiService';

interface DayAllocatorProps {
  stats: UserStats;
  onRestart: () => void;
}

const CATEGORIES = [
  { id: 'sleep', label: 'Sleep', emoji: '💤', color: 'text-blue-400' },
  { id: 'work', label: 'Work/Study', emoji: '💼', color: 'text-orange-400' },
  { id: 'commute', label: 'Commute/Chore', emoji: '🚌', color: 'text-gray-400' },
  { id: 'social', label: 'Social', emoji: '👯', color: 'text-pink-400' },
  { id: 'hobbies', label: 'Hobbies/Skill', emoji: '🎨', color: 'text-green-400' },
];

const DayAllocator: React.FC<DayAllocatorProps> = ({ stats, onRestart }) => {
  const [allocation, setAllocation] = useState<Record<string, number>>({
    sleep: 7,
    work: 8,
    commute: 1,
    social: 2,
    hobbies: 1
  });
  
  const [geminiRoast, setGeminiRoast] = useState<string>('');
  const [loadingRoast, setLoadingRoast] = useState(false);

  const totalAllocated = (Object.values(allocation) as number[]).reduce((a, b) => a + b, 0);
  const doomscrollTime = Math.max(0, 24 - totalAllocated);
  const isOverbooked = totalAllocated > 24;

  const handleChange = (id: string, value: number) => {
    setAllocation(prev => ({
      ...prev,
      [id]: parseFloat(value.toFixed(1))
    }));
  };

  useEffect(() => {
    // Debounce the Gemini call
    const timer = setTimeout(async () => {
      if (doomscrollTime > 0.5 && !isOverbooked) {
        setLoadingRoast(true);
        const text = await generateScheduleRoast(doomscrollTime);
        setGeminiRoast(text);
        setLoadingRoast(false);
      } else if (isOverbooked) {
        setGeminiRoast("You have broken the laws of physics. 24 hours only.");
      } else {
        setGeminiRoast("A perfectly packed day. Suspiciously productive.");
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [doomscrollTime, isOverbooked]);

  return (
    <div className="min-h-screen bg-digital-black flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-gray-900/50 border border-gray-800 p-8 rounded-xl backdrop-blur-sm shadow-2xl">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">Design Your Ideal Day</h2>
        <p className="text-gray-400 text-center mb-8">Allocate your 24 hours. The leftovers are dangerous.</p>

        <div className="space-y-6 mb-8">
          {CATEGORIES.map((cat) => (
            <div key={cat.id} className="flex items-center gap-4">
              <div className="w-8 text-2xl">{cat.emoji}</div>
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <label className={`font-mono text-sm uppercase ${cat.color}`}>{cat.label}</label>
                  <span className="text-white font-bold">{allocation[cat.id]}h</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="16"
                  step="0.5"
                  value={allocation[cat.id]}
                  onChange={(e) => handleChange(cat.id, parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-neon-blue hover:accent-white transition-all"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="border-t-2 border-dashed border-gray-700 pt-6">
            <div className="flex justify-between items-end mb-4">
                <div className="text-left">
                    <p className="text-xs text-gray-500 uppercase tracking-widest">Unallocated Time</p>
                    <h3 className={`text-4xl font-bold ${doomscrollTime > 3 ? 'text-neon-red animate-pulse' : 'text-neon-blue'}`}>
                        {doomscrollTime.toFixed(1)}h
                    </h3>
                </div>
                <div className="text-right max-w-[50%]">
                     <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Analysis</p>
                     {loadingRoast ? (
                         <span className="text-xs text-neon-green">Simulating consequences...</span>
                     ) : (
                        <p className={`text-sm italic ${isOverbooked ? 'text-neon-red' : 'text-gray-300'}`}>
                            {geminiRoast}
                        </p>
                     )}
                </div>
            </div>

            {/* Visual Bar */}
            <div className="h-6 w-full bg-gray-800 rounded-full overflow-hidden flex">
                {CATEGORIES.map(cat => (
                     <div 
                        key={cat.id} 
                        style={{ width: `${(allocation[cat.id] / 24) * 100}%`}} 
                        className={`h-full ${cat.color.replace('text', 'bg')} opacity-80`}
                     />
                ))}
                {doomscrollTime > 0 && !isOverbooked && (
                    <div 
                        style={{ width: `${(doomscrollTime / 24) * 100}%`}}
                        className="h-full bg-neon-red pattern-diagonal-lines animate-pulse"
                        title="Doomscroll Zone"
                    />
                )}
            </div>
            {isOverbooked && <p className="text-neon-red text-center text-xs mt-2">SYSTEM ERROR: TIME OVERFLOW</p>}
        </div>

        <div className="mt-8 flex justify-center">
            <Button onClick={onRestart} variant="secondary">Reset Experience</Button>
        </div>
      </div>
    </div>
  );
};

export default DayAllocator;