import React, { useState, useEffect } from 'react';
import { QUESTIONS } from './data/questions';
import { GameState, PRIZE_LADDER, SAFE_HAVENS, User, GameSettings } from './types';
import PrizeLadder from './components/PrizeLadder';
import LifelineButton, { AudienceGraph } from './components/Lifelines';
import AuthScreen from './components/AuthScreen';
import MainMenu from './components/MainMenu';
import { playSound, SOUNDS } from './utils/sounds';
import AdBanner from './components/AdBanner';

// Icons
const Icon5050 = () => <span className="font-bold text-xs md:text-sm">50:50</span>;
const IconAudience = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);
const IconPhone = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);
const IconDouble = () => <span className="font-bold text-xs md:text-sm">x2</span>;

type AppMode = 'auth' | 'menu' | 'game';

function App() {
  // Navigation State
  const [appMode, setAppMode] = useState<AppMode>('auth');
  const [user, setUser] = useState<User | null>(null);

  // Global Settings State
  const [settings, setSettings] = useState<GameSettings>({
    timerDuration: 45,
    availableLifelines: {
      fiftyFifty: true,
      audiencePoll: true,
      phoneAFriend: true,
      doubleDip: true
    }
  });

  // Game State
  const [gameState, setGameState] = useState<GameState>({
    currentQuestionIndex: 0,
    selectedOption: null,
    isLocked: false,
    isCorrect: null,
    score: 0,
    lifelines: {
      fiftyFifty: false,
      audiencePoll: false,
      phoneAFriend: false,
      doubleDip: false
    },
    gameStatus: 'playing',
    activeLifeline: null,
    eliminatedOptions: [],
    doubleDipActive: false,
    moneyWon: 0
  });

  const [timer, setTimer] = useState(settings.timerDuration);
  const [showPrizeLadder, setShowPrizeLadder] = useState(false);
  const [showAudienceModal, setShowAudienceModal] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false); 

  const currentQ = QUESTIONS[gameState.currentQuestionIndex];

  // Timer Logic
  useEffect(() => {
    let interval: any;
    if (appMode === 'game' && gameState.gameStatus === 'playing' && !gameState.isLocked && !showAudienceModal && !showPhoneModal && !isTransitioning) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            handleTimeOut();
            return 0;
          }
          // Play tick sound for last 10 seconds
          if (prev <= 10) {
            playSound(SOUNDS.TICK);
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [appMode, gameState.gameStatus, gameState.isLocked, showAudienceModal, showPhoneModal, isTransitioning]);

  // Handle Game Over Sounds
  useEffect(() => {
    if (gameState.gameStatus === 'won') {
      playSound(SOUNDS.WIN);
    } else if (gameState.gameStatus === 'lost') {
      playSound(SOUNDS.LOSE);
    }
  }, [gameState.gameStatus]);

  const handleLogin = (userData: User) => {
    playSound(SOUNDS.LOCK);
    setUser(userData);
    setAppMode('menu');
  };

  const handleLogout = () => {
    setUser(null);
    setAppMode('auth');
  };

  const startGame = () => {
    playSound(SOUNDS.LOCK);
    setGameState({
      currentQuestionIndex: 0,
      selectedOption: null,
      isLocked: false,
      isCorrect: null,
      score: 0,
      lifelines: { 
        fiftyFifty: !settings.availableLifelines.fiftyFifty, 
        audiencePoll: !settings.availableLifelines.audiencePoll, 
        phoneAFriend: !settings.availableLifelines.phoneAFriend, 
        doubleDip: !settings.availableLifelines.doubleDip 
      },
      gameStatus: 'playing',
      activeLifeline: null,
      eliminatedOptions: [],
      doubleDipActive: false,
      moneyWon: 0
    });
    setTimer(settings.timerDuration);
    setAppMode('game');
    setIsTransitioning(false);
  };

  const handleTimeOut = () => {
    setGameState(prev => ({ ...prev, gameStatus: 'lost' }));
  };

  const handleOptionClick = (index: number) => {
    if (gameState.isLocked || gameState.eliminatedOptions.includes(index) || isTransitioning) return;

    playSound(SOUNDS.LOCK);

    // Handle Double Dip
    if (gameState.doubleDipActive) {
      if (index === currentQ.correctAnswerIndex) {
        setGameState(prev => ({ ...prev, selectedOption: index, isLocked: true, doubleDipActive: false }));
        setTimeout(() => revealAnswer(index, true), 2000);
      } else {
        playSound(SOUNDS.WRONG);
        setGameState(prev => ({
          ...prev,
          eliminatedOptions: [...prev.eliminatedOptions, index],
          selectedOption: null
        }));
      }
      return;
    }

    // Normal Play
    setGameState(prev => ({ ...prev, selectedOption: index, isLocked: true }));
    setTimeout(() => {
      revealAnswer(index, index === currentQ.correctAnswerIndex);
    }, 2000);
  };

  const revealAnswer = (index: number, isCorrect: boolean) => {
    setGameState(prev => ({ ...prev, isCorrect }));
    
    if (isCorrect) {
      playSound(SOUNDS.CORRECT);
    } else {
      playSound(SOUNDS.WRONG);
    }

    setTimeout(() => {
      if (isCorrect) {
        const newMoney = PRIZE_LADDER[gameState.currentQuestionIndex];
        if (gameState.currentQuestionIndex + 1 >= QUESTIONS.length) {
           setGameState(prev => ({ ...prev, gameStatus: 'won', moneyWon: newMoney }));
        } else {
           // Transition Effect
           setIsTransitioning(true);
           setTimeout(() => {
             setGameState(prev => ({
               ...prev,
               currentQuestionIndex: prev.currentQuestionIndex + 1,
               selectedOption: null,
               isLocked: false,
               isCorrect: null,
               eliminatedOptions: [],
               moneyWon: newMoney
             }));
             setTimer(settings.timerDuration + (gameState.currentQuestionIndex * 2));
             setIsTransitioning(false);
           }, 1000);
        }
      } else {
        let safeMoney = 0;
        SAFE_HAVENS.forEach(idx => {
            if (gameState.currentQuestionIndex > idx) {
                safeMoney = PRIZE_LADDER[idx];
            }
        });
        setGameState(prev => ({ ...prev, gameStatus: 'lost', moneyWon: safeMoney }));
      }
    }, 2500); 
  };

  // Lifelines
  const use5050 = () => {
    playSound(SOUNDS.LIFELINE);
    const wrongOptions = currentQ.options
      .map((_, idx) => idx)
      .filter(idx => idx !== currentQ.correctAnswerIndex);
    const shuffled = wrongOptions.sort(() => 0.5 - Math.random());
    const toEliminate = shuffled.slice(0, 2);
    setGameState(prev => ({
      ...prev,
      lifelines: { ...prev.lifelines, fiftyFifty: true },
      eliminatedOptions: toEliminate
    }));
  };

  const useAudience = () => {
    playSound(SOUNDS.LIFELINE);
    setGameState(prev => ({ ...prev, lifelines: { ...prev.lifelines, audiencePoll: true } }));
    setShowAudienceModal(true);
  };

  const usePhone = () => {
    playSound(SOUNDS.LIFELINE);
    setGameState(prev => ({ ...prev, lifelines: { ...prev.lifelines, phoneAFriend: true } }));
    setShowPhoneModal(true);
  };

  const useDoubleDip = () => {
    playSound(SOUNDS.LIFELINE);
    setGameState(prev => ({
      ...prev,
      lifelines: { ...prev.lifelines, doubleDip: true },
      doubleDipActive: true
    }));
  };

  const getButtonColor = (index: number) => {
    if (gameState.isCorrect === true && index === currentQ.correctAnswerIndex) return 'bg-green-600 border-green-400 text-white animate-flash-correct';
    if (gameState.isCorrect === false && index === gameState.selectedOption) return 'bg-red-600 border-red-400 text-white';
    if (gameState.isCorrect === false && index === currentQ.correctAnswerIndex) return 'bg-green-600 border-green-400 text-white'; 
    if (gameState.selectedOption === index) return 'bg-amber-500 border-amber-300 text-black';
    if (gameState.eliminatedOptions.includes(index)) return 'animate-dissolve pointer-events-none opacity-50';
    
    return 'bg-slate-800 border-slate-500 text-white hover:bg-slate-700 hover:border-amber-400';
  };

  // --- RENDERING FLOW ---

  if (appMode === 'auth') {
    return <AuthScreen onLogin={handleLogin} />;
  }

  if (appMode === 'menu' && user) {
    return (
      <MainMenu 
        user={user} 
        onStartGame={startGame} 
        onLogout={handleLogout} 
        settings={settings}
        onUpdateSettings={setSettings}
      />
    );
  }

  // --- GAME MODE ---

  if (gameState.gameStatus === 'won' || gameState.gameStatus === 'lost') {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-6 relative animate-zoomIn">
              <div className="text-center z-10">
                  <h1 className={`text-5xl md:text-7xl font-bold mb-4 ${gameState.gameStatus === 'won' ? 'text-amber-400' : 'text-slate-400'}`}>
                      {gameState.gameStatus === 'won' ? 'CROREPATI!' : 'GAME OVER'}
                  </h1>
                  <div className="text-2xl text-slate-300 mb-8">
                      You won: <span className="text-green-400 font-bold text-4xl block mt-2">₹ {gameState.moneyWon.toLocaleString('en-IN')}</span>
                  </div>
                  
                  {gameState.gameStatus === 'lost' && (
                      <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 max-w-lg mx-auto mb-8 shadow-xl">
                          <p className="text-slate-400 text-sm uppercase mb-2">Correct Answer was:</p>
                          <p className="text-xl font-bold text-white mb-4">{QUESTIONS[gameState.currentQuestionIndex].options[QUESTIONS[gameState.currentQuestionIndex].correctAnswerIndex]}</p>
                          <div className="p-3 bg-slate-900 rounded text-left text-sm text-slate-300 border-l-4 border-amber-500">
                              {QUESTIONS[gameState.currentQuestionIndex].explanation}
                          </div>
                      </div>
                  )}

                  <div className="flex gap-4 justify-center">
                    <button 
                      onClick={startGame}
                      className="px-8 py-3 bg-amber-600 hover:bg-amber-700 rounded-full font-bold text-lg transition-all shadow-lg"
                    >
                        Play Again
                    </button>
                    <button 
                      onClick={() => setAppMode('menu')}
                      className="px-8 py-3 bg-slate-700 hover:bg-slate-600 rounded-full font-bold text-lg transition-all shadow-lg"
                    >
                        Main Menu
                    </button>
                  </div>
              </div>
              <AdBanner className="mt-8" />
          </div>
      )
  }

  // --- PLAYING ---
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(30,27,75,1)_0%,_rgba(2,6,23,1)_80%)] z-0"></div>

      <div className="md:hidden fixed top-4 right-4 z-40">
        <button 
          onClick={() => setShowPrizeLadder(!showPrizeLadder)}
          className="bg-amber-600 p-2 rounded-full shadow-lg text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <div className={`flex-1 flex flex-col relative z-10 h-screen transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
        
        <div className="p-4 flex justify-between items-center">
             <div className="relative w-20 h-20 flex items-center justify-center">
                 <div className={`absolute inset-0 rounded-full border-4 ${timer < 10 ? 'border-red-500 animate-pulse' : 'border-blue-500'}`}></div>
                 <span className={`text-2xl font-bold font-mono ${timer < 10 ? 'text-red-400' : 'text-white'}`}>{timer}</span>
             </div>
             <div className="md:hidden text-right">
                 <p className="text-xs text-slate-400">Current Prize</p>
                 <p className="text-xl font-bold text-amber-500">₹ {PRIZE_LADDER[gameState.currentQuestionIndex].toLocaleString()}</p>
             </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
            <div className="w-full max-w-4xl text-center mb-8 animate-slideInUp delay-100">
                <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-y-2 border-amber-600/50 py-8 px-6 relative shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                    {currentQ.questionHindi && (
                         <h3 className="text-lg md:text-xl text-slate-400 mb-2 font-serif">{currentQ.questionHindi}</h3>
                    )}
                    <h2 className="text-xl md:text-3xl font-bold text-white leading-relaxed">
                        {currentQ.question}
                    </h2>
                    <div className="absolute top-1/2 -left-3 w-6 h-6 bg-amber-500 transform -translate-y-1/2 rotate-45 border-4 border-slate-900"></div>
                    <div className="absolute top-1/2 -right-3 w-6 h-6 bg-amber-500 transform -translate-y-1/2 rotate-45 border-4 border-slate-900"></div>
                </div>
            </div>

            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 px-2">
                {currentQ.options.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => handleOptionClick(index)}
                        disabled={gameState.isLocked && !gameState.doubleDipActive}
                        className={`
                           relative w-full py-4 px-8 rounded-full border-2 transition-all duration-200
                           text-left flex items-center group animate-slideInUp
                           ${getButtonColor(index)}
                        `}
                        style={{ animationDelay: `${200 + (index * 100)}ms` }}
                    >
                        <span className="text-amber-500 font-bold mr-4 text-xl group-hover:text-white transition-colors">
                            {String.fromCharCode(65 + index)}:
                        </span>
                        <span className="text-lg md:text-xl font-semibold">{option}</span>
                        <div className="absolute top-1/2 -left-4 w-4 h-[1px] bg-slate-600 group-hover:bg-amber-400 hidden md:block"></div>
                        <div className="absolute top-1/2 -right-4 w-4 h-[1px] bg-slate-600 group-hover:bg-amber-400 hidden md:block"></div>
                    </button>
                ))}
            </div>
        </div>

        <div className="p-6 bg-slate-950 border-t border-slate-800 flex flex-col items-center">
            <div className="flex justify-center gap-4 md:gap-8 mb-4">
                <LifelineButton 
                  type="50:50" 
                  label="50:50" 
                  icon={<Icon5050 />} 
                  isUsed={gameState.lifelines.fiftyFifty} 
                  isActive={false}
                  onUse={() => !gameState.isLocked && use5050()} 
                />
                <LifelineButton 
                  type="audience" 
                  label="Audience Poll" 
                  icon={<IconAudience />} 
                  isUsed={gameState.lifelines.audiencePoll} 
                  isActive={showAudienceModal}
                  onUse={() => !gameState.isLocked && useAudience()} 
                />
                <LifelineButton 
                  type="phone" 
                  label="Phone A Friend" 
                  icon={<IconPhone />} 
                  isUsed={gameState.lifelines.phoneAFriend} 
                  isActive={showPhoneModal}
                  onUse={() => !gameState.isLocked && usePhone()} 
                />
                <LifelineButton 
                  type="double" 
                  label="Double Dip" 
                  icon={<IconDouble />} 
                  isUsed={gameState.lifelines.doubleDip} 
                  isActive={gameState.doubleDipActive}
                  onUse={() => !gameState.isLocked && useDoubleDip()} 
                />
            </div>
            <AdBanner className="mt-2" />
        </div>
      </div>

      <PrizeLadder 
        currentQuestionIndex={gameState.currentQuestionIndex} 
        isOpen={showPrizeLadder}
        close={() => setShowPrizeLadder(false)}
      />

      {showAudienceModal && (
        <div onClick={() => setShowAudienceModal(false)} className="animate-zoomIn">
            <AudienceGraph correctIndex={currentQ.correctAnswerIndex} />
        </div>
      )}
      
      {showPhoneModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-zoomIn">
              <div className="bg-slate-800 border-2 border-amber-500 rounded-xl max-w-md w-full p-6 shadow-2xl relative">
                  <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-amber-500 rounded-full p-4 border-4 border-slate-900">
                     <IconPhone />
                  </div>
                  <h3 className="mt-8 text-center text-xl font-bold text-amber-400 mb-4">Calling Dr. Green...</h3>
                  <div className="bg-slate-700 p-4 rounded-lg text-slate-200 italic mb-6 relative">
                      <div className="absolute top-0 left-4 w-3 h-3 bg-slate-700 transform -translate-y-1/2 rotate-45"></div>
                      "Hello {user?.name}! Based on my knowledge, the answer is likely 
                      <strong className="text-white not-italic mx-1">
                        {currentQ.options[currentQ.correctAnswerIndex]}
                      </strong>. 
                      {currentQ.explanation.substring(0, 50)}..."
                  </div>
                  <button 
                    onClick={() => setShowPhoneModal(false)}
                    className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded uppercase"
                  >
                      End Call
                  </button>
              </div>
          </div>
      )}

    </div>
  );
}

export default App;