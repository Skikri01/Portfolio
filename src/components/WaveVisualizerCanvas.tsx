import React, { useEffect, useRef } from 'react';

interface WaveProps {
  className?: string;
}

export const WaveVisualizerCanvas: React.FC<WaveProps> = ({ className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || 800;
      canvas.height = canvas.parentElement?.clientHeight || 500;
    };

    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const height = canvas.height;

      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      const waves = [
        { amplitude: 35, frequency: 0.008, speed: 1, color: isLight ? 'rgba(2, 132, 199, 0.35)' : 'rgba(168, 192, 232, 0.25)' },
        { amplitude: 25, frequency: 0.012, speed: -1.2, color: isLight ? 'rgba(217, 119, 6, 0.3)' : 'rgba(232, 168, 124, 0.2)' },
        { amplitude: 45, frequency: 0.005, speed: 0.8, color: isLight ? 'rgba(196, 142, 36, 0.35)' : 'rgba(217, 164, 65, 0.15)' },
      ];

      waves.forEach((wave) => {
        ctx.beginPath();
        ctx.strokeStyle = wave.color;
        ctx.lineWidth = 2;

        for (let x = 0; x < width; x += 3) {
          const y =
            height / 2 +
            Math.sin(x * wave.frequency + time * wave.speed) * wave.amplitude;
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} />;
};
