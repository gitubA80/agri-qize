import React from 'react';

interface LifelineProps {
  type: '50:50' | 'audience' | 'phone' | 'double';
  label: string;
  icon: React.ReactNode;
  isUsed: boolean;
  isActive: boolean;
  onUse: () => void;
}

const LifelineButton: React.FC<LifelineProps> = ({ type, label, icon, isUsed, isActive, onUse }) => {
  return (
    <button
      onClick={onUse}
      disabled={isUsed}
      className={`
        relative group flex flex-col items-center justify-center p-2 md:p-4 rounded-full border-2 transition-all duration-300 w-16 h-16 md:w-20 md:h-20
        ${isUsed 
          ? 'border-slate-700 bg-slate-800 text-slate-600 cursor-not-allowed opacity-50' 
          : isActive 
             ? 'border-green-400 bg-green-900/50 text-green-400 animate-pulse shadow-[0_0_15px_rgba(74,222,128,0.5)]'
             : 'border-amber-500 bg-gradient-to-b from-slate-800 to-slate-900 text-amber-400 hover:scale-110 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)]'
        }
      `}
      title={label}
    >
      <div className="text-xl md:text-2xl mb-1">{icon}</div>
      {isActive && (
        <span className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full animate-ping"></span>
      )}
      <div className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-white bg-black/80 px-2 py-1 rounded whitespace-nowrap z-20">
        {label}
      </div>
    </button>
  );
};

export const AudienceGraph: React.FC<{ correctIndex: number }> = ({ correctIndex }) => {
  // Generate fake data favoring correct index
  const data = [0, 1, 2, 3].map(i => {
    if (i === correctIndex) return Math.floor(Math.random() * 40) + 50; // 50-90%
    return Math.floor(Math.random() * 20); // 0-20%
  });
  
  // Normalize to roughly 100%
  const total = data.reduce((a, b) => a + b, 0);
  const percentages = data.map(v => Math.round((v / total) * 100));

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-amber-500 rounded-xl p-6 w-full max-w-md shadow-2xl">
        <h3 className="text-xl text-amber-400 font-bold mb-6 text-center uppercase tracking-widest">Audience Poll Results</h3>
        <div className="flex justify-around items-end h-64 gap-4">
          {percentages.map((p, i) => (
            <div key={i} className="flex flex-col items-center w-12 group">
              <div className="text-white font-bold mb-2">{p}%</div>
              <div 
                className={`w-full rounded-t-lg transition-all duration-1000 ease-out ${i === correctIndex ? 'bg-green-500' : 'bg-blue-500'}`}
                style={{ height: `${p * 2}px` }}
              ></div>
              <div className="mt-2 text-amber-500 font-bold text-lg">{String.fromCharCode(65 + i)}</div>
            </div>
          ))}
        </div>
        <button 
           className="mt-8 w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg uppercase tracking-wider transition-colors"
           onClick={() => { /* This component assumes parent handles closing by conditional rendering, but adding a data attribute to close would be better handled by parent wrapper */ }}
        >
           Close
        </button>
      </div>
    </div>
  );
};

export default LifelineButton;