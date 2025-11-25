import React, { useEffect, useRef, useState } from 'react';
import { UserStats, RoastResponse } from '../types';
import Button from './Button';

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
  // 1 hour is low chaos, 12 hours is max chaos
  const chaosLevel = Math.min(Math.max(stats.dailyScreenTime / 12, 0.1), 1);
  const cellSize = Math.floor(20 - (chaosLevel * 10)); // Higher chaos = smaller cells = more noise
  
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

    // Set canvas size to match video
    if (canvas.width !== video.videoWidth) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    }

    // Draw original frame to temporary context or just read from video
    // We draw small to get average colors easily
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;

    // Grid dimensions
    const cols = Math.floor(canvas.width / cellSize);
    const rows = Math.floor(canvas.height / cellSize);

    tempCanvas.width = cols;
    tempCanvas.height = rows;
    
    // Draw the video scaled down to grid size (pixelation step)
    tempCtx.drawImage(video, 0, 0, cols, rows);
    
    // Get the pixel data
    const frameData = tempCtx.getImageData(0, 0, cols, rows).data;

    // Clear main canvas
    ctx.fillStyle = '#000';
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

        // Visual logic based on stats
        // If brightness is low, just black
        if (brightness < 30) continue;

        // Choose symbol
        let symbol = '';
        const randomSeed = Math.sin(x * y + time);
        
        // High chaos level increases probability of "brainrot" symbols over simple colors
        if (Math.random() < chaosLevel * 0.8 && brightness > 100) {
            // Brainrot mode
            const symbolSet = Math.random() > 0.5 ? BRAINROT_SYMBOLS : TECH_LOGOS;
            symbol = symbolSet[Math.floor(Math.abs(randomSeed * 100)) % symbolSet.length];
        } else {
            // Pixel mode
            ctx.fillStyle = `rgb(${r},${g},${b})`;
            ctx.fillRect(posX, posY, cellSize - 1, cellSize - 1);
            continue;
        }

        ctx.font = `${cellSize}px monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillText(symbol, posX + cellSize/2, posY + cellSize/2);
      }
    }

    // Glitch effect if chaos is high
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permissionGranted]);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-4 bg-digital-black">
      <div className="max-w-4xl w-full text-center space-y-6">
        
        <div className="flex justify-between items-center w-full">
            <h2 className="text-2xl font-bold text-neon-blue tracking-tighter">THE MIRROR OF CONSUMPTION</h2>
            <div className="text-right">
                <p className="text-xs text-gray-400">CHAOS FACTOR</p>
                <div className="w-32 h-2 bg-gray-800 mt-1">
                    <div className="h-full bg-neon-red transition-all duration-1000" style={{ width: `${chaosLevel * 100}%`}}></div>
                </div>
            </div>
        </div>

        <div className="relative border-4 border-gray-800 rounded-lg overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.8)] bg-black aspect-video">
          {!permissionGranted && !error && (
            <div className="absolute inset-0 flex items-center justify-center text-neon-green animate-pulse">
              INITIALIZING SENSOR ARRAY...
            </div>
          )}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center text-neon-red px-8 text-center">
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
          
          {/* Overlay Text for High Chaos */}
          {chaosLevel > 0.5 && (
            <div className="absolute top-4 left-4 right-4 pointer-events-none">
                 <p className="text-neon-red font-bold text-lg bg-black/50 inline-block px-2 backdrop-blur-sm transform -rotate-1">
                    WARNING: ATTENTION LEAKAGE DETECTED
                 </p>
            </div>
          )}
        </div>

        {roast && (
          <div className="bg-gray-900/80 border border-neon-purple p-6 rounded-md backdrop-blur-md shadow-lg transform transition-all duration-500 hover:scale-[1.01]">
            <p className="text-lg md:text-xl text-white font-medium mb-2">"{roast.roast}"</p>
            <div className="h-px w-full bg-gray-700 my-4"></div>
            <p className="text-sm text-neon-green uppercase tracking-wide">Alternative Timeline Simulation:</p>
            <p className="text-gray-300 mt-1">{roast.alternativeActivity}</p>
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
