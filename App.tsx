import React, { useState } from 'react';
import { AppStage, UserStats, RoastResponse } from './types';
import Button from './components/Button';
import MosaicFilter from './components/MosaicFilter';
import DayAllocator from './components/DayAllocator';
import BrainrotElement from './components/BrainrotElement';
import { generateRealityCheck } from './services/geminiService';
import { playHoverSound } from './utils/soundEngine';

const App: React.FC = () => {
  const [stage, setStage] = useState<AppStage>(AppStage.ONBOARDING);
  const [stats, setStats] = useState<UserStats>({ age: 25, dailyScreenTime: 4 });
  const [roast, setRoast] = useState<RoastResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleStatsSubmit = async () => {
    setLoading(true);
    playHoverSound('glitch');
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
    <div className="relative min-h-screen w-full overflow-hidden bg-paper flex flex-col items-center justify-center p-4">
      {/* Background Collage Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gum via-transparent to-transparent blur-3xl"></div>
      
      {/* Interactive Brainrot Elements (The "Playground") */}
      <BrainrotElement emoji="👁️" top="10%" left="15%" type="float" rotation="-12deg" />
      <BrainrotElement emoji="👄" top="15%" left="80%" type="jitter" rotation="12deg" delay="1s" />
      <BrainrotElement emoji="📱" top="70%" left="10%" type="float" rotation="45deg" delay="0.5s" />
      <BrainrotElement emoji="💊" top="65%" left="85%" type="float" rotation="-20deg" scale={1.5} />
      <BrainrotElement emoji="🤡" top="85%" left="40%" type="spin" rotation="0deg" scale={0.8} />
      <BrainrotElement emoji="⌛" top="5%" left="50%" type="float" delay="2s" />

      {/* Main Content Card */}
      <div className="relative z-20 max-w-xl w-full">
        {/* Title Block */}
        <div 
          className="mb-8 text-center space-y-2 cursor-default"
          onMouseEnter={() => playHoverSound('pop')}
        >
            <p className="font-pixel text-gum uppercase tracking-[0.3em] text-sm">Interactive Experience</p>
            <h1 className="font-serif text-6xl md:text-8xl leading-[0.85] text-ink drop-shadow-[4px_4px_0px_rgba(230,57,70,0.4)]">
              THE TIME <br/>
              <span className="italic">MOSAIC</span>
            </h1>
            <p className="font-pixel text-ink/60 mt-4 text-lg">Come play on the playgrounds of the internet.</p>
        </div>

        {/* Input Ticket */}
        <div className="bg-paper border-4 border-ink shadow-[8px_8px_0px_0px_#1a1a1a] p-8 relative transform rotate-1 transition-transform hover:rotate-0">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-ink text-paper px-4 py-1 font-pixel text-xs uppercase">
            Admit One
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="font-serif text-xl block text-ink">Age</label>
                    <input
                    type="number"
                    min="10"
                    max="100"
                    value={stats.age}
                    onChange={(e) => setStats({ ...stats, age: parseInt(e.target.value) || 0 })}
                    className="w-full bg-paper border-b-2 border-ink p-2 text-3xl font-pixel focus:outline-none focus:bg-gold/20 transition-colors"
                    />
                </div>
                <div className="space-y-2">
                    <label className="font-serif text-xl block text-ink">Screen Time</label>
                    <div className="flex items-baseline">
                        <input
                        type="number"
                        min="0"
                        max="24"
                        step="0.1"
                        value={stats.dailyScreenTime}
                        onChange={(e) => setStats({ ...stats, dailyScreenTime: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-paper border-b-2 border-ink p-2 text-3xl font-pixel focus:outline-none focus:bg-gum/10 transition-colors"
                        />
                        <span className="font-pixel text-sm ml-2">HRS</span>
                    </div>
                </div>
            </div>

            {stats.dailyScreenTime > 0 && (
                <div className="bg-ink p-4 text-paper text-center transform -rotate-1 border-2 border-dashed border-paper/50">
                    <p className="font-pixel text-xs uppercase tracking-widest text-gold mb-1">Estimated Attention Cost</p>
                    <p className="font-serif text-5xl">{calculateLostYears()} <span className="text-xl italic text-gray-400">Years</span></p>
                </div>
            )}

            <Button 
                onClick={handleStatsSubmit} 
                disabled={loading || stats.dailyScreenTime <= 0}
                className="w-full text-xl"
                variant={stats.dailyScreenTime > 6 ? "danger" : "primary"}
            >
                {loading ? "Fragmenting Self..." : "Enter The Mirror"}
            </Button>
          </div>
        </div>
        
        <p className="text-center mt-6 font-pixel text-xs text-ink/40 max-w-xs mx-auto">
            By entering, you agree to confront your digital reflection. No refunds on time already spent.
        </p>
      </div>
    </div>
  );

  return (
    <div className="font-pixel text-ink min-h-screen bg-paper selection:bg-gum selection:text-white">
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