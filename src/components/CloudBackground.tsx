import { useEffect, useState } from "react";

interface Cloud {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  delay: number;
}

const CloudBackground = () => {
  const [clouds, setClouds] = useState<Cloud[]>([]);

  useEffect(() => {
    const generateClouds = () => {
      const newClouds: Cloud[] = [];
      for (let i = 0; i < 12; i++) {
        newClouds.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 200 + 100,
          opacity: Math.random() * 0.3 + 0.1,
          speed: Math.random() * 20 + 15,
          delay: Math.random() * -20,
        });
      }
      setClouds(newClouds);
    };
    generateClouds();
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Gradient background */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, hsl(210 80% 8%) 0%, hsl(210 70% 20%) 40%, hsl(205 60% 45%) 100%)',
        }}
      />
      
      {/* Animated clouds */}
      {clouds.map((cloud) => (
        <div
          key={cloud.id}
          className="absolute rounded-full blur-3xl"
          style={{
            left: `${cloud.x}%`,
            top: `${cloud.y}%`,
            width: `${cloud.size}px`,
            height: `${cloud.size * 0.6}px`,
            backgroundColor: `hsla(205, 100%, 95%, ${cloud.opacity})`,
            animation: `float ${cloud.speed}s ease-in-out infinite`,
            animationDelay: `${cloud.delay}s`,
          }}
        />
      ))}

      {/* Subtle radial glow */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, hsla(210, 80%, 55%, 0.15) 0%, transparent 60%)',
        }}
      />
    </div>
  );
};

export default CloudBackground;
