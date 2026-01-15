import React, { useState } from 'react';
import { User, GameSettings } from '../types';
import { playSound, SOUNDS } from '../utils/sounds';
import AdBanner from './AdBanner';

interface MainMenuProps {
  user: User;
  onStartGame: () => void;
  onLogout: () => void;
  settings: GameSettings;
  onUpdateSettings: (newSettings: GameSettings) => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ user, onStartGame, onLogout, settings, onUpdateSettings }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] bg-slate-950 text-white relative flex flex-col">
       {/* Background Effects */}
       <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-slate-950 to-slate-950 z-0 pointer-events-none"></div>

       {/* Header */}
       <header className="relative z-10 p-4 flex justify-between items-center bg-slate-900/80 backdrop-blur border-b border-slate-700">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center font-bold text-slate-900 text-xl">
                {user.name.charAt(0).toUpperCase()}
             </div>
             <div>
                <p className="text-xs text-amber-400 uppercase tracking-wider">Welcome,</p>
                <p className="font-bold text-white leading-none">{user.name}</p>
             </div>
          </div>
          <button onClick={onLogout} className="text-slate-400 hover:text-white text-sm underline">Logout</button>
       </header>

       {/* Main Content */}
       <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 animate-slideInUp overflow-y-auto no-scrollbar">
          
          {/* Logo Section */}
          <div className="mb-10 text-center relative">
             <div className="w-32 h-32 md:w-48 md:h-48 mx-auto rounded-full bg-gradient-to-br from-indigo-600 to-purple-900 border-4 border-amber-400 shadow-[0_0_50px_rgba(124,58,237,0.6)] flex items-center justify-center animate-heartbeat z-20 relative">
                <span className="text-6xl md:text-8xl filter drop-shadow-lg">🌾</span>
             </div>
             <div className="absolute -inset-4 bg-amber-500/20 rounded-full blur-xl animate-pulse"></div>
             <h1 className="mt-6 text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 uppercase tracking-widest drop-shadow-sm">
                Agri KBC
             </h1>
             <p className="text-blue-300 mt-2 font-light">The Path to 1 Crore Starts Here</p>
          </div>

          {/* Big Play Button */}
          <button 
             onClick={onStartGame}
             className="group relative w-full max-w-xs mb-12"
          >
             <div className="absolute inset-0 bg-amber-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
             <div className="relative px-7 py-6 bg-slate-900 rounded-full leading-none flex items-center justify-center border-2 border-amber-500 shadow-2xl overflow-hidden">
                <span className="text-amber-500 group-hover:text-amber-300 font-bold text-2xl uppercase tracking-[0.2em] z-10 transition-colors">Play Now</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-800/0 via-purple-800/50 to-purple-800/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
             </div>
          </button>

          {/* Grid Options */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-8">
             <MenuButton icon="🏆" label="Leaderboard" onClick={() => playSound(SOUNDS.MENU_CLICK)} />
             <MenuButton icon="⚙️" label="Settings" onClick={() => { playSound(SOUNDS.MENU_CLICK); setIsSettingsOpen(true); }} />
             <MenuButton icon="📘" label="Learn Rules" onClick={() => playSound(SOUNDS.MENU_CLICK)} />
             <MenuButton icon="👤" label="Profile" onClick={() => playSound(SOUNDS.MENU_CLICK)} />
          </div>

          <AdBanner className="mb-4" />
       </main>
       
       {/* Footer */}
       <footer className="relative z-10 p-4 text-center text-slate-600 text-xs border-t border-slate-900/50">
          Agri KBC © 2024. Designed for Agriculture Students.
       </footer>

       {/* Settings Modal */}
       {isSettingsOpen && (
         <SettingsModal 
           settings={settings} 
           onSave={(newSettings) => {
             playSound(SOUNDS.LOCK);
             onUpdateSettings(newSettings);
             setIsSettingsOpen(false);
           }}
           onClose={() => setIsSettingsOpen(false)}
         />
       )}
    </div>
  );
};

const MenuButton: React.FC<{icon: string, label: string, onClick: () => void}> = ({ icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-center justify-center p-4 bg-slate-800/50 hover:bg-slate-700 border border-slate-700 hover:border-amber-500/50 rounded-lg backdrop-blur-sm transition-all duration-300 group"
  >
    <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">{icon}</span>
    <span className="text-sm text-slate-300 font-medium">{label}</span>
  </button>
);

const SettingsModal: React.FC<{
  settings: GameSettings; 
  onSave: (s: GameSettings) => void; 
  onClose: () => void;
}> = ({ settings, onSave, onClose }) => {
  const [localSettings, setLocalSettings] = useState(settings);

  const toggleLifeline = (key: keyof GameSettings['availableLifelines']) => {
    playSound(SOUNDS.MENU_CLICK);
    setLocalSettings(prev => ({
      ...prev,
      availableLifelines: {
        ...prev.availableLifelines,
        [key]: !prev.availableLifelines[key]
      }
    }));
  };

  const timerOptions = [30, 45, 60, 90];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-zoomIn">
      <div className="bg-slate-900 border border-amber-500 rounded-xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-800 p-4 border-b border-slate-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-amber-500 uppercase tracking-widest">Game Settings</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">&times;</button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto no-scrollbar space-y-8">
          
          {/* Timer Section */}
          <div>
            <label className="block text-sm font-bold text-slate-300 uppercase mb-3 tracking-wider">Timer Duration (Seconds)</label>
            <div className="grid grid-cols-4 gap-2">
              {timerOptions.map(time => (
                <button
                  key={time}
                  onClick={() => { playSound(SOUNDS.MENU_CLICK); setLocalSettings(prev => ({...prev, timerDuration: time})); }}
                  className={`py-2 rounded font-bold transition-all ${
                    localSettings.timerDuration === time 
                      ? 'bg-amber-600 text-white shadow-[0_0_10px_rgba(245,158,11,0.5)]' 
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {time}s
                </button>
              ))}
            </div>
          </div>

          {/* Lifelines Section */}
          <div>
            <label className="block text-sm font-bold text-slate-300 uppercase mb-3 tracking-wider">Enable Lifelines</label>
            <div className="space-y-3">
              {[
                { key: 'fiftyFifty', label: '50:50', icon: '✂️' },
                { key: 'audiencePoll', label: 'Audience Poll', icon: '📊' },
                { key: 'phoneAFriend', label: 'Phone A Friend', icon: '📞' },
                { key: 'doubleDip', label: 'Double Dip', icon: 'x2' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium text-slate-200">{item.label}</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={localSettings.availableLifelines[item.key as keyof GameSettings['availableLifelines']]}
                      onChange={() => toggleLifeline(item.key as keyof GameSettings['availableLifelines'])}
                    />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-800 border-t border-slate-700">
          <button 
            onClick={() => onSave(localSettings)}
            className="w-full py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-bold rounded shadow-lg uppercase tracking-wider"
          >
            Save & Apply
          </button>
        </div>

      </div>
    </div>
  );
};

export default MainMenu;