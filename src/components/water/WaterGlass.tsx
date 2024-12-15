import { useEffect, useRef } from "react";

interface WaterGlassProps {
  percentage: number;
}

export function WaterGlass({ percentage }: WaterGlassProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    let time = 0;
    let drops: { x: number; y: number; speed: number; size: number }[] = [];

    // Create new drops when over 100%
    if (percentage > 100) {
      const dropCount = Math.floor((percentage - 100) / 10); // One drop per 10% over
      while (drops.length < dropCount) {
        drops.push({
          x: width * 0.3 + Math.random() * (width * 0.4), // Random position within glass width
          y: height * 0.2, // Start from top of glass
          speed: 2 + Math.random() * 2,
          size: 3 + Math.random() * 3
        });
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw glass container with enhanced shadow and border
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 15;
      ctx.shadowOffsetX = 3;
      ctx.shadowOffsetY = 3;

      // Draw glass container with tapered bottom
      ctx.beginPath();
      ctx.moveTo(width * 0.3, height * 0.1); // Top left
      ctx.lineTo(width * 0.35, height * 0.85); // Bottom left, moved in more
      ctx.quadraticCurveTo(width * 0.35, height * 0.9, width * 0.45, height * 0.9);
      ctx.lineTo(width * 0.55, height * 0.9);
      ctx.quadraticCurveTo(width * 0.65, height * 0.9, width * 0.65, height * 0.85);
      ctx.lineTo(width * 0.7, height * 0.1); // Top right
      ctx.strokeStyle = "rgba(0, 0, 0, 0.8)"; // Darker border
      ctx.lineWidth = 3;
      ctx.stroke();

      // Reset shadow for water
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      // Calculate water height based on percentage (capped at 100%)
      const cappedPercentage = Math.min(percentage, 100);
      const waterHeight = height * 0.8 * (cappedPercentage / 100);
      const baseY = height * 0.9 - waterHeight;

      // Draw water with proper clipping to prevent overflow
      ctx.save(); // Save the current state
      ctx.beginPath();
      ctx.moveTo(width * 0.35, height * 0.85);
      ctx.lineTo(width * 0.35, height * 0.1);
      ctx.lineTo(width * 0.7, height * 0.1);
      ctx.lineTo(width * 0.65, height * 0.85);
      ctx.closePath();
      ctx.clip(); // Clip to glass shape

      // Draw water
      ctx.beginPath();
      ctx.moveTo(width * 0.35, height * 0.9);
      
      // Create wave effect
      for (let x = width * 0.35; x <= width * 0.65; x++) {
        const y = baseY + Math.sin(x * 0.05 + time) * 5;
        ctx.lineTo(x, y);
      }

      ctx.lineTo(width * 0.65, height * 0.9);
      ctx.closePath();

      // Create gradient
      const gradient = ctx.createLinearGradient(0, baseY, 0, height * 0.9);
      gradient.addColorStop(0, "rgba(96, 165, 250, 0.6)");
      gradient.addColorStop(1, "rgba(59, 130, 246, 0.8)");

      ctx.fillStyle = gradient;
      ctx.fill();
      
      ctx.restore(); // Restore the state to remove clipping

      // Animate and draw water drops when over 100%
      if (percentage > 100) {
        drops = drops.filter(drop => {
          ctx.beginPath();
          ctx.arc(drop.x, drop.y, drop.size, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(59, 130, 246, 0.6)";
          ctx.fill();

          drop.y += drop.speed;
          return drop.y < height; // Remove drops that fall off screen
        });
      }

      time += 0.05;
      requestAnimationFrame(animate);
    };

    animate();
  }, [percentage]);

  return (
    <canvas
      ref={canvasRef}
      width={300}
      height={400}
      className="w-full max-w-[150px] mx-auto"
    />
  );
}