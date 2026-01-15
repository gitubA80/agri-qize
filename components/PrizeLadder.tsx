import React, { useEffect, useRef } from 'react';
import { PRIZE_LADDER, SAFE_HAVENS } from '../types';

interface PrizeLadderProps {
  currentQuestionIndex: number;
  isOpen: boolean;
  close: () => void;
}

const PrizeLadder: React.FC<PrizeLadderProps> = ({ currentQuestionIndex, isOpen, close }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll to current level
  useEffect(() => {
    if (isOpen && scrollRef.current) {
        const activeItem = scrollRef.current.querySelector('[data-active="true"]');
        if (activeItem) {
            activeItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
  }, [isOpen, currentQuestionIndex]);

  return (
    <div className={`fixed inset-y-0 right-0 z-50 w-64 bg-slate-900 border-l border-amber-600/30 shadow-2xl transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} md:translate-x-0 md:static md:w-80 md:border-none md:bg-transparent`}>
      <div className="h-full flex flex-col p-4">
        <div className="flex justify-between items-center md:hidden mb-4 text-amber-500">
          <h2 className="text-xl font-bold uppercase">Prize Ladder</h2>
          <button onClick={close} className="text-2xl">&times;</button>
        </div>
        
        <div className="flex-1 overflow-y-auto no-scrollbar relative md:pr-4" ref={scrollRef}>
          <div className="flex flex-col-reverse gap-1">
            {PRIZE_LADDER.map((amount, index) => {
              const isCurrent = index === currentQuestionIndex;
              const isPast = index < currentQuestionIndex;
              const isSafe = SAFE_HAVENS.includes(index);
              
              return (
                <div 
                  key={index}
                  data-active={isCurrent}
                  className={`
                    flex justify-between items-center px-4 py-2 rounded-lg border
                    transition-all duration-300
                    ${isCurrent 
                      ? 'bg-amber-600 border-amber-400 text-white shadow-[0_0_15px_rgba(245,158,11,0.6)] scale-105 z-10' 
                      : isPast 
                        ? 'bg-green-900/40 border-green-700/50 text-green-400' 
                        : 'bg-slate-800/60 border-slate-700 text-slate-400'}
                  `}
                >
                  <span className={`font-mono font-bold ${isSafe ? 'text-white' : ''}`}>
                    {index + 1}
                  </span>
                  <span className={`font-bold tracking-wider ${isSafe && !isCurrent ? 'text-amber-400' : ''}`}>
                    ₹ {amount.toLocaleString('en-IN')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrizeLadder;