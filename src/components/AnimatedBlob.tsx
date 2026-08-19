import React from 'react';

const AnimatedBlob: React.FC = () => {
  return (
    <>
      <style>{`
        @keyframes blobMorph {
          0%, 100% {
            border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
            transform: rotate(0deg) scale(1);
          }
          33% {
            border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
            transform: rotate(120deg) scale(1.05);
          }
          66% {
            border-radius: 70% 30% 50% 50% / 30% 50% 70% 40%;
            transform: rotate(240deg) scale(0.95);
          }
        }

        .animated-blob-container {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .animated-blob-element {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, var(--accent) 0%, #12f7ff 50%, #0077ff 100%);
          animation: blobMorph 8s ease-in-out infinite alternate;
          filter: drop-shadow(0 0 20px var(--accent-glow));
        }
      `}</style>
      <div className="animated-blob-container">
        <div className="animated-blob-element" />
      </div>
    </>
  );
};

export default AnimatedBlob;
