import React, { useState, useEffect } from 'react';
import { UserStats } from '../types';
import Button from './Button';
import { generateScheduleRoast } from '../services/geminiService';
import { playHoverSound } from '../utils/soundEngine';

interface DayAllocatorProps {
  stats: UserStats;
  onRestart: () => void;
}

const CATEGORIES = [
  { id: 'sleep', label: 'Sleep', emoji: '💤', color: 'bg-blue-200' },
  { id: 'work', label: 'Work/Study', emoji: '💼', color: 'bg-orange-200' },
  { id: 'commute', label: 'Commute', emoji: '🚌', color: 'bg-gray-300' },
  { id: 'social', label: 'Social', emoji: '👯', color: 'bg-pink-200' },
  { id: 'hobbies', label: 'Hobbies', emoji: '🎨', color: 'bg-green-200' },
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
    <div className="min-h-screen bg-paper flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white border-4 border-ink p-8 shadow-[12px_12px_0px_0px_#1a1a1a] relative">
        <div className="absolute -top-4 -left-4 bg-gum text-white px-4 py-1 font-serif text-lg transform -rotate-2 border-2 border-ink">
            Architecture of a Day
        </div>

        <h2 className="text-4xl font-serif text-ink mb-2 text-center mt-4">Design Your Ideal Day</h2>
        <p className="text-ink/60 text-center mb-8 font-pixel">Allocate your 24 hours. The leftovers are dangerous.</p>

        <div className="space-y-6 mb-8">
          {CATEGORIES.map((cat) => (
            <div key={cat.id} className="flex items-center gap-4 group">
              <div className="w-8 text-2xl group-hover:scale-110 transition-transform" onMouseEnter={() => playHoverSound('pop')}>{cat.emoji}</div>
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <label className="font-pixel text-sm uppercase text-ink">{cat.label}</label>
                  <span className="text-ink font-bold bg-gray-100 px-2 border border-ink">{allocation[cat.id]}h</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="16"
                  step="0.5"
                  value={allocation[cat.id]}
                  onChange={(e) => handleChange(cat.id, parseFloat(e.target.value))}
                  className="w-full h-4 bg-gray-200 rounded-none border-2 border-ink appearance-none cursor-pointer accent-gum hover:accent-ink transition-all"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="border-t-4 border-dashed border-ink/20 pt-6">
            <div className="flex justify-between items-end mb-4">
                <div className="text-left">
                    <p className="text-xs text-ink/50 uppercase tracking-widest">Unallocated Time</p>
                    <h3 className={`text-5xl font-serif ${doomscrollTime > 3 ? 'text-gum' : 'text-ink'}`}>
                        {doomscrollTime.toFixed(1)}h
                    </h3>
                </div>
                <div className="text-right max-w-[50%]">
                     <p className="text-xs text-ink/50 uppercase tracking-widest mb-1">Analysis</p>
                     {loadingRoast ? (
                         <span className="text-xs text-gold bg-ink px-1 animate-pulse">Calculating Fate...</span>
                     ) : (
                        <p className={`text-sm font-pixel leading-tight ${isOverbooked ? 'text-gum font-bold' : 'text-ink'}`}>
                            {geminiRoast}
                        </p>
                     )}
                </div>
            </div>

            {/* Visual Bar */}
            <div className="h-12 w-full border-2 border-ink flex overflow-hidden shadow-inner bg-gray-100">
                {CATEGORIES.map(cat => (
                     <div 
                        key={cat.id} 
                        style={{ width: `${(allocation[cat.id] / 24) * 100}%`}} 
                        className={`h-full ${cat.color} border-r border-ink last:border-0`}
                        title={cat.label}
                     />
                ))}
                {doomscrollTime > 0 && !isOverbooked && (
                    <div 
                        style={{ width: `${(doomscrollTime / 24) * 100}%`}}
                        className="h-full bg-gum relative overflow-hidden"
                        title="Doomscroll Zone"
                    >
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8cGF0aCBkPSJNLTExLTExTDExLTExTDExIDExTC0xMSAxMUwtMTEtMTFaIiBmaWxsPSIjMDAwIi8+Cjwvc3ZnPg==')] opacity-20"></div>
                        <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold tracking-widest animate-pulse">VOID</span>
                    </div>
                )}
            </div>
            {isOverbooked && <p className="text-gum text-center font-bold text-sm mt-2">⚠ SYSTEM ERROR: TIME OVERFLOW ⚠</p>}
        </div>

        <div className="mt-8 flex justify-center">
            <Button onClick={onRestart} variant="secondary">Reset Experience</Button>
        </div>
      </div>
    </div>
  );
};

export default DayAllocator;