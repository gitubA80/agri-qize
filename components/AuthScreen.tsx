import React, { useState } from 'react';
import { User } from '../types';
import AdBanner from './AdBanner';

interface AuthScreenProps {
  onLogin: (user: User) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError('Please fill in all fields to enter the Hot Seat.');
      return;
    }
    onLogin({ name, phone });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-950 via-slate-950 to-black relative overflow-hidden p-6">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      
      <div className="z-10 w-full max-w-md animate-zoomIn flex flex-col">
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-purple-700 to-indigo-900 border-4 border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.5)] flex items-center justify-center mb-4">
             <span className="text-4xl">🌾</span>
          </div>
          <h1 className="text-3xl font-bold text-amber-500 tracking-widest uppercase mb-1">Agri KBC</h1>
          <p className="text-slate-400 text-sm tracking-wider">Authentication Required</p>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-md border border-amber-600/30 rounded-xl p-8 shadow-2xl relative overflow-hidden mb-8">
          {/* Top accent line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
          
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Contestant Login</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-amber-500 text-sm font-bold mb-2 uppercase tracking-wider">Full Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-white p-3 rounded focus:outline-none focus:border-amber-500 focus:shadow-[0_0_10px_rgba(245,158,11,0.3)] transition-all"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="block text-amber-500 text-sm font-bold mb-2 uppercase tracking-wider">Mobile Number</label>
              <input 
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-white p-3 rounded focus:outline-none focus:border-amber-500 focus:shadow-[0_0_10px_rgba(245,158,11,0.3)] transition-all"
                placeholder="+91 XXXXX XXXXX"
              />
            </div>

            {error && <p className="text-red-400 text-sm text-center">{error}</p>}

            <button 
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-lg uppercase tracking-widest rounded shadow-[0_4px_15px_rgba(0,0,0,0.5)] transform hover:scale-105 transition-all duration-300 relative overflow-hidden group"
            >
              <span className="relative z-10">Enter Game</span>
              <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1s_infinite]"></div>
            </button>
          </form>
        </div>
        
        <AdBanner className="mt-auto" />
        
        <div className="mt-4 text-center text-slate-500 text-xs">
          By logging in, you agree to the Terms of Service. <br/>
          This is an educational agriculture quiz.
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;