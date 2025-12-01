import React, { useEffect, useRef, useState } from 'react';
import { UserStats, RoastResponse } from '../types';
import Button from './Button';
import { playHoverSound } from '../utils/soundEngine';

interface MosaicFilterProps {
  stats: UserStats;
  roast: RoastResponse | null;
  onBack: () => void;
  onNext: () => void;
}

const BRAINROT_SYMBOLS = ['📱', '👁️', '💀', '🤡', '🤖', '💩', '👾', '💸', '💊', '🚧', '🔒', '📉'];
const TECH_LOGOS = ['X', 'f', 'G', 'in', 'tt', 'yt']; 

const MosaicFilter: React.FC<MosaicFilterProps> = ({ stats, roast, onBack, onNext }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [error, setError] = useState<string>('');
  const animationRef = useRef<number>();

  // Calculate chaos level based on screen time (0 to 1 scale)
  const chaosLevel = Math.min(Math.max(stats.dailyScreenTime / 12, 0.1), 1);
  const cellSize = Math.floor(20 - (chaosLevel * 10)); 
  
  useEffect(() => {
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setPermissionGranted(true);
        }
      } catch (err) {
        setError("Camera access denied. The mirror cannot reflect your digital soul.");
      }
    };

    startVideo();

    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const drawMosaic = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { willReadFrequently: true });

    if (!video || !canvas || !ctx || video.readyState !== 4) {
        animationRef.current = requestAnimationFrame(drawMosaic);
        return;
    }

    if (canvas.width !== video.videoWidth) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    }

    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;

    const cols = Math.floor(canvas.width / cellSize);
    const rows = Math.floor(canvas.height / cellSize);

    tempCanvas.width = cols;
    tempCanvas.height = rows;
    tempCtx.drawImage(video, 0, 0, cols, rows);
    const frameData = tempCtx.getImageData(0, 0, cols, rows).data;

    // Background for the canvas - make it dark ink for contrast
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const time = Date.now() / 1000;

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const index = (y * cols + x) * 4;
        const r = frameData[index];
        const g = frameData[index + 1];
        const b = frameData[index + 2];
        const brightness = (r + g + b) / 3;

        const posX = x * cellSize;
        const posY = y * cellSize;

        if (brightness < 30) continue;

        let symbol = '';
        const randomSeed = Math.sin(x * y + time);
        
        if (Math.random() < chaosLevel * 0.8 && brightness > 100) {
            const symbolSet = Math.random() > 0.5 ? BRAINROT_SYMBOLS : TECH_LOGOS;
            symbol = symbolSet[Math.floor(Math.abs(randomSeed * 100)) % symbolSet.length];
        } else {
            ctx.fillStyle = `rgb(${r},${g},${b})`;
            ctx.fillRect(posX, posY, cellSize - 1, cellSize - 1);
            continue;
        }

        ctx.font = `${cellSize}px "Pixelify Sans"`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillText(symbol, posX + cellSize/2, posY + cellSize/2);
      }
    }

    if (chaosLevel > 0.6 && Math.random() > 0.9) {
        const sliceHeight = Math.random() * 50;
        const sliceY = Math.random() * canvas.height;
        const offset = (Math.random() - 0.5) * 50;
        ctx.drawImage(canvas, 0, sliceY, canvas.width, sliceHeight, offset, sliceY, canvas.width, sliceHeight);
    }

    animationRef.current = requestAnimationFrame(drawMosaic);
  };

  useEffect(() => {
    if (permissionGranted) {
      drawMosaic();
    }
  }, [permissionGranted]);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-4 bg-paper bg-[url('data:image/svg+xml;base64,...')]">
      <div className="max-w-4xl w-full text-center space-y-6">
        
        <div className="flex justify-between items-center w-full border-b-2 border-ink pb-2">
            <h2 className="text-2xl font-serif font-bold text-ink">THE MIRROR OF CONSUMPTION</h2>
            <div className="text-right">
                <p className="text-xs font-pixel text-ink uppercase">Chaos Factor</p>
                <div className="w-32 h-4 border-2 border-ink bg-white mt-1 relative">
                    <div className="h-full bg-gum absolute top-0 left-0 transition-all duration-1000" style={{ width: `${chaosLevel * 100}%`}}></div>
                    <div className="absolute inset-0 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAIklEQVQIW2NkQAKrVq36zwjjgzhhZWGMYAEYB8RmROaABADeOQ8CXl/xfgAAAABJRU5ErkJggg==')] opacity-20"></div>
                </div>
            </div>
        </div>

        <div className="relative border-4 border-ink bg-void aspect-video shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)]">
          {!permissionGranted && !error && (
            <div className="absolute inset-0 flex items-center justify-center text-paper font-pixel animate-pulse">
              INITIALIZING SENSOR ARRAY...
            </div>
          )}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center text-gum px-8 text-center font-bold">
              {error}
            </div>
          )}
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className="absolute inset-0 w-full h-full object-cover opacity-0 pointer-events-none" 
          />
          <canvas 
            ref={canvasRef} 
            className="w-full h-full object-cover"
          />
          
          {chaosLevel > 0.5 && (
            <div className="absolute top-4 left-4 right-4 pointer-events-none transform -rotate-1">
                 <p className="text-paper bg-gum inline-block px-4 py-1 font-serif text-xl shadow-lg border-2 border-ink">
                    ⚠ ATTENTION LEAKAGE DETECTED
                 </p>
            </div>
          )}
        </div>

        {roast && (
          <div 
            className="bg-paper border-2 border-ink p-6 shadow-[8px_8px_0px_0px_#e63946] text-left relative transform hover:-translate-y-1 transition-transform"
            onMouseEnter={() => playHoverSound('pop')}
          >
            <div className="absolute -top-3 -right-3 bg-gold text-ink px-2 py-1 font-pixel text-xs border border-ink transform rotate-3">AI ANALYSIS</div>
            <p className="text-xl md:text-2xl text-ink font-serif mb-4 leading-tight">"{roast.roast}"</p>
            <div className="h-px w-full bg-ink/20 my-4"></div>
            <p className="text-xs text-gum uppercase font-bold tracking-widest mb-1">Alternative Timeline:</p>
            <p className="text-ink font-pixel text-lg">{roast.alternativeActivity}</p>
          </div>
        )}

        <div className="flex gap-4 justify-center pt-4">
          <Button variant="secondary" onClick={onBack}>Retake Metrics</Button>
          <Button variant="primary" onClick={onNext}>Reclaim Your Time</Button>
        </div>
      </div>
    </div>
  );
};

export default MosaicFilter;