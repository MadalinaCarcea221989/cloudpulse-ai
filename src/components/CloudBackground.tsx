import Plasma from './Plasma';

const CloudBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Plasma WebGL Background */}
      <div className="absolute inset-0 pointer-events-auto">
        <Plasma 
          color="#3b82f6"
          speed={0.5}
          direction="forward"
          scale={1.2}
          opacity={0.9}
          mouseInteractive={true}
        />
      </div>
      
      {/* Subtle overlay gradient for better text readability */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, hsla(210, 80%, 5%, 0.4) 0%, transparent 30%, transparent 70%, hsla(210, 80%, 5%, 0.5) 100%)',
        }}
      />
    </div>
  );
};

export default CloudBackground;
