'use client';

interface RoleDisplayProps {
  role: string;
  category: string;
  keyword: string;
}

export default function RoleDisplay({ role, category, keyword }: RoleDisplayProps) {
  const isImpostor = role === 'impostor';

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center" style={{ background: 'rgba(0, 0, 0, 0.95)' }}>
      <div 
        className="text-center max-w-3xl px-8"
        style={{ animation: 'fadeInUp 0.8s ease-out' }}
      >
        {/* Role Icon */}
        <div 
          className="mb-8 inline-flex w-40 h-40 rounded-full items-center justify-center text-8xl"
          style={{
            background: isImpostor 
              ? 'linear-gradient(135deg, #FF6B9D 0%, #9D4EDD 100%)'
              : 'linear-gradient(135deg, #00FFF5 0%, #9D4EDD 100%)',
            boxShadow: isImpostor 
              ? '0 0 60px rgba(255, 107, 157, 0.8), 0 0 100px rgba(157, 78, 221, 0.6)'
              : '0 0 60px rgba(0, 255, 245, 0.8), 0 0 100px rgba(157, 78, 221, 0.6)',
            animation: 'rolePulse 2s ease-in-out infinite'
          }}
        >
          {isImpostor ? '🎭' : '✨'}
        </div>

        {/* Role Title */}
        <h1 
          className="text-7xl font-bold mb-6"
          style={{
            fontFamily: "'Cinzel', serif",
            color: isImpostor ? '#FF6B9D' : '#00FFF5',
            textShadow: isImpostor 
              ? '0 0 40px rgba(255, 107, 157, 0.8)'
              : '0 0 40px rgba(0, 255, 245, 0.8)',
            letterSpacing: '3px',
            animation: 'logoGlow 2s ease-in-out infinite'
          }}
        >
          {isImpostor ? 'YOU ARE THE IMPOSTOR' : 'YOU ARE A CREWMATE'}
        </h1>

        {/* Category */}
        <div 
          className="mb-6 px-10 py-4 inline-block rounded-xl"
          style={{
            background: 'rgba(27, 38, 59, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(0, 255, 245, 0.3)'
          }}
        >
          <div className="text-sm tracking-wide mb-2" style={{ color: '#778DA9', letterSpacing: '1px' }}>
            CATEGORY
          </div>
          <div 
            className="text-4xl font-bold"
            style={{
              fontFamily: "'Philosopher', sans-serif",
              color: '#9D4EDD',
              textShadow: '0 0 20px rgba(157, 78, 221, 0.6)',
              letterSpacing: '1px'
            }}
          >
            {category}
          </div>
        </div>

        {/* Keyword (only for crewmates) */}
        {!isImpostor && (
          <div 
            className="mb-8 px-10 py-4 inline-block rounded-xl"
            style={{
              background: 'rgba(27, 38, 59, 0.9)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(0, 255, 245, 0.3)'
            }}
          >
            <div className="text-sm tracking-wide mb-2" style={{ color: '#778DA9', letterSpacing: '1px' }}>
              YOUR KEYWORD
            </div>
            <div 
              className="text-5xl font-bold"
              style={{
                fontFamily: "'Philosopher', sans-serif",
                color: '#00FFF5',
                textShadow: '0 0 30px rgba(0, 255, 245, 0.8)',
                letterSpacing: '2px'
              }}
            >
              {keyword}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div 
          className="text-xl leading-relaxed"
          style={{
            fontFamily: "'Raleway', sans-serif",
            color: '#E0E1DD',
            letterSpacing: '0.5px'
          }}
        >
          {isImpostor 
            ? "You only know the category. Say words that fit it, but try to blend in. Don't reveal yourself!"
            : `Say words related to "${keyword}" to prove you're not the impostor!`
          }
        </div>

        <div 
          className="mt-8 text-base animate-pulse"
          style={{ color: '#778DA9', letterSpacing: '0.5px' }}
        >
          Game starting in a moment...
        </div>
      </div>

      <style jsx>{`
        @keyframes rolePulse {
          0%, 100% { 
            transform: scale(1);
          }
          50% { 
            transform: scale(1.05);
          }
        }
      `}</style>
    </div>
  );
}
