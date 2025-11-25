import React, { useState } from 'react';
import { AppStage, UserStats, RoastResponse } from './types';
import Button from './components/Button';
import MosaicFilter from './components/MosaicFilter';
import DayAllocator from './components/DayAllocator';
import { generateRealityCheck } from './services/geminiService';

const App: React.FC = () => {
  const [stage, setStage] = useState<AppStage>(AppStage.ONBOARDING);
  const [stats, setStats] = useState<UserStats>({ age: 25, dailyScreenTime: 4 });
  const [roast, setRoast] = useState<RoastResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleStatsSubmit = async () => {
    setLoading(true);
    // Calculate and fetch roast
    const result = await generateRealityCheck(stats.age, stats.dailyScreenTime);
    setRoast(result);
    setLoading(false);
    setStage(AppStage.MOSAIC_MIRROR);
  };

  const calculateLostYears = () => {
    const remainingLife = 80 - stats.age;
    const totalHours = remainingLife * 365 * stats.dailyScreenTime;
    const yearsLost = totalHours / 24 / 365;
    return yearsLost.toFixed(1);
  };

  const renderOnboarding = () => (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 via-digital-black to-black">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple tracking-tighter drop-shadow-[0_0_10px_rgba(0,243,255,0.3)]">
            THE TIME MOSAIC
          </h1>
          <p className="text-gray-400 font-mono text-sm">Quantify your digital decay.</p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur border border-gray-800 p-8 rounded-2xl shadow-2xl space-y-6">
          <div className="space-y-2 text-left">
            <label className="text-neon-blue text-xs uppercase font-bold tracking-widest">Your Age</label>
            <input
              type="number"
              min="10"
              max="100"
              value={stats.age}
              onChange={(e) => setStats({ ...stats, age: parseInt(e.target.value) || 0 })}
              className="w-full bg-black border border-gray-700 rounded p-3 text-white focus:border-neon-blue focus:outline-none focus:ring-1 focus:ring-neon-blue transition-colors font-mono text-xl"
            />
          </div>

          <div className="space-y-2 text-left">
            <label className="text-neon-red text-xs uppercase font-bold tracking-widest">Daily Screen Time (Hours)</label>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="24"
                step="0.1"
                value={stats.dailyScreenTime}
                onChange={(e) => setStats({ ...stats, dailyScreenTime: parseFloat(e.target.value) || 0 })}
                className="w-full bg-black border border-gray-700 rounded p-3 text-white focus:border-neon-red focus:outline-none focus:ring-1 focus:ring-neon-red transition-colors font-mono text-xl"
              />
              <span className="absolute right-4 top-3 text-gray-500">HRS</span>
            </div>
            <p className="text-xs text-gray-500 italic">Be honest. The algorithm knows anyway.</p>
          </div>

          {stats.dailyScreenTime > 0 && (
             <div className="py-4 border-t border-gray-800 animate-pulse">
                <p className="text-gray-400 text-xs uppercase">Projected Attention Cost</p>
                <p className="text-4xl font-bold text-white mt-1">{calculateLostYears()} <span className="text-lg text-gray-500 font-normal">YEARS</span></p>
             </div>
          )}

          <Button 
            onClick={handleStatsSubmit} 
            disabled={loading || stats.dailyScreenTime <= 0}
            className="w-full"
            variant={stats.dailyScreenTime > 6 ? "danger" : "primary"}
          >
            {loading ? "Calculating Regret..." : "Enter The Mirror"}
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="font-mono text-white">
      {stage === AppStage.ONBOARDING && renderOnboarding()}
      {stage === AppStage.MOSAIC_MIRROR && (
        <MosaicFilter 
          stats={stats} 
          roast={roast}
          onBack={() => setStage(AppStage.ONBOARDING)}
          onNext={() => setStage(AppStage.DAY_BUILDER)}
        />
      )}
      {stage === AppStage.DAY_BUILDER && (
        <DayAllocator 
          stats={stats}
          onRestart={() => setStage(AppStage.ONBOARDING)}
        />
      )}
    </div>
  );
};

export default App;