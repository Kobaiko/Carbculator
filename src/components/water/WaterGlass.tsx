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

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw glass container with enhanced shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 15;
      ctx.shadowOffsetX = 3;
      ctx.shadowOffsetY = 3;

      // Draw glass container with tapered top
      ctx.beginPath();
      ctx.moveTo(width * 0.25, height * 0.1); // Top left
      ctx.lineTo(width * 0.3, height * 0.85); // Bottom left, moved in
      ctx.quadraticCurveTo(width * 0.3, height * 0.9, width * 0.4, height * 0.9);
      ctx.lineTo(width * 0.6, height * 0.9);
      ctx.quadraticCurveTo(width * 0.7, height * 0.9, width * 0.7, height * 0.85);
      ctx.lineTo(width * 0.75, height * 0.1); // Top right
      ctx.strokeStyle = "rgba(0, 0, 0, 0.8)"; // Darker border color
      ctx.lineWidth = 3;
      ctx.stroke();

      // Reset shadow for water
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      // Calculate water height based on percentage
      const waterHeight = height * 0.8 * (percentage / 100);
      const baseY = height * 0.9 - waterHeight;

      // Draw water
      ctx.beginPath();
      ctx.moveTo(width * 0.3, height * 0.9);
      
      // Create wave effect
      for (let x = width * 0.3; x <= width * 0.7; x++) {
        const y = baseY + Math.sin(x * 0.05 + time) * 5;
        ctx.lineTo(x, y);
      }

      ctx.lineTo(width * 0.7, height * 0.9);
      ctx.closePath();

      // Create gradient
      const gradient = ctx.createLinearGradient(0, baseY, 0, height * 0.9);
      gradient.addColorStop(0, "rgba(96, 165, 250, 0.6)");
      gradient.addColorStop(1, "rgba(59, 130, 246, 0.8)");

      ctx.fillStyle = gradient;
      ctx.fill();

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
      className="w-full max-w-[150px] mx-auto" // Made the glass smaller
    />
  );
}