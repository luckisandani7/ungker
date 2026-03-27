import React, { useState } from 'react';
import { CheckSquare, LayoutList, Calculator, Wallet, BellRing, Info, LogOut, Eye, EyeOff, User, Check, X, BrainCircuit } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface ToolsDashboardProps {
  onSelect: (id: string) => void;
}

export default function ToolsDashboard({ onSelect }: ToolsDashboardProps) {
  const { user, isGuest, logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [hideEmail, setHideEmail] = useState(true);

  const tools = [
    { 
      id: 'ai-mentor', 
      label: 'Lkey7 AI', 
      description: 'Get professional AI analysis for your trading performance', 
      imageUrl: 'https://i.postimg.cc/HnSk64Vk/b8afdbe223638b5eb8e107038ccf5230.jpg', 
      color: 'text-emerald-500', 
      bg: 'bg-emerald-500/10' 
    },
    { 
      id: 'checklist', 
      label: 'Trading Checklist', 
      description: 'Verify your setup before entering a trade', 
      icon: CheckSquare, 
      color: 'text-zinc-400', 
      bg: 'bg-zinc-400/10' 
    },
    { 
      id: 'outlook', 
      label: 'Monthly Outlook', 
      description: 'Review and analyze your monthly performance', 
      icon: LayoutList, 
      color: 'text-zinc-400', 
      bg: 'bg-zinc-400/10' 
    },
    { 
      id: 'calculator', 
      label: 'RR Calculator', 
      description: 'Calculate risk and reward ratio', 
      icon: Calculator, 
      color: 'text-zinc-400', 
      bg: 'bg-zinc-400/10' 
    },
    { 
      id: 'money-management', 
      label: 'Money Management', 
      description: 'Calculate proper risk and position size', 
      icon: Wallet, 
      color: 'text-zinc-400', 
      bg: 'bg-zinc-400/10' 
    },
    { 
      id: 'session-alarm', 
      label: 'Session Alarm', 
      description: 'Get notified when major sessions start', 
      icon: BellRing, 
      color: 'text-zinc-400', 
      bg: 'bg-zinc-400/10' 
    },
    { 
      id: 'about', 
      label: 'About App', 
      description: 'Learn more about Trading Journal', 
      icon: Info, 
      color: 'text-zinc-400', 
      bg: 'bg-zinc-400/10' 
    },
  ];

  const maskEmail = (email: string) => {
    if (!email) return '';
    const [name, domain] = email.split('@');
    return `${name[0]}***@${domain}`;
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Profile Section */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 flex flex-col items-center text-center space-y-4 shadow-xl">
        <div className="relative group">
          <div className="relative p-[1.5px] overflow-hidden rounded-full">
            {/* Moving border beam glow */}
            <div 
              className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_270deg,white_360deg)] animate-border-beam blur-sm"
              style={{ borderRadius: '50%' }}
            />
            
            {/* Moving border beam */}
            <div 
              className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_270deg,white_360deg)] animate-border-beam"
              style={{ borderRadius: '50%' }}
            />
            
            <img 
              src={user?.photoURL || "https://i.ibb.co.com/p6zCSCR6/c210653e54ecf004a6da8fee66da1442.jpg"} 
              alt={user?.displayName || '1% Trader'} 
              className="relative w-24 h-24 rounded-full border-2 border-zinc-900 shadow-2xl object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          {isGuest && (
            <div className="absolute -bottom-1 -right-1 bg-amber-500 text-black text-[10px] font-black px-2 py-0.5 rounded-full border-2 border-zinc-900 z-20">
              GUEST
            </div>
          )}
        </div>

        <div className="space-y-1">
          <h3 className="text-xl font-black text-white tracking-tight">
            {user?.displayName || (isGuest ? 'Guest Trader' : '1% Trader')}
          </h3>
          <div className="flex items-center justify-center gap-2">
            <p className="text-sm text-zinc-500 font-medium">
              {isGuest ? 'Local Storage Mode' : (hideEmail ? maskEmail(user?.email || '') : user?.email)}
            </p>
            {!isGuest && (
              <button 
                onClick={() => setHideEmail(!hideEmail)}
                className="p-1 text-zinc-600 hover:text-emerald-500 transition-colors"
                title={hideEmail ? "Show Email" : "Hide Email"}
              >
                {hideEmail ? <Eye size={14} /> : <EyeOff size={14} />}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2 px-1">
        <h2 className="text-3xl font-black tracking-tight text-white">Trading Tools</h2>
        <p className="text-sm text-zinc-500 font-medium">Essential utilities to sharpen your edge.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => onSelect(tool.id)}
            className="flex items-center gap-5 p-6 bg-zinc-900 border border-zinc-800 rounded-[2rem] hover:border-zinc-600 hover:bg-zinc-800 transition-all text-left group shadow-lg"
          >
            <div className={`${tool.id === 'ai-mentor' ? 'p-0' : 'p-4 ' + tool.bg + ' shadow-inner'} ${tool.color} rounded-2xl group-hover:scale-110 transition-transform flex items-center justify-center overflow-hidden`}>
              {tool.imageUrl ? (
                <img 
                  src={tool.imageUrl} 
                  alt={tool.label} 
                  className={tool.id === 'ai-mentor' ? "w-14 h-14 object-cover" : "w-7 h-7 object-cover rounded-lg"} 
                  referrerPolicy="no-referrer" 
                />
              ) : (
                tool.icon && <tool.icon size={28} />
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-1">{tool.label}</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">{tool.description}</p>
            </div>
          </button>
        ))}

        {!showLogoutConfirm ? (
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center gap-5 p-6 bg-red-500/5 backdrop-blur-sm border border-red-500/10 rounded-[2rem] hover:border-red-500/30 hover:bg-red-500/10 transition-all text-left group shadow-lg"
          >
            <div className="p-4 bg-red-500/10 text-red-400 rounded-2xl group-hover:scale-110 transition-transform shadow-inner">
              <LogOut size={28} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-red-400 mb-1">Log Out</h3>
              <p className="text-xs text-red-500/60 leading-relaxed">Sign out of your account securely</p>
            </div>
          </button>
        ) : (
          <div className="bg-red-500/10 border border-red-500/20 rounded-[2rem] p-6 animate-in zoom-in-95 duration-200">
            <div className="text-center space-y-4">
              <p className="text-red-400 font-bold">Are you sure you want to log out?</p>
              <div className="flex gap-3">
                <button
                  onClick={logout}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-2xl flex items-center justify-center gap-2 transition-colors"
                >
                  <Check size={18} /> Yes
                </button>
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 rounded-2xl flex items-center justify-center gap-2 transition-colors"
                >
                  <X size={18} /> No
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Decorative Card */}
      <div className="bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-800 mt-8">
        <h4 className="text-emerald-400 font-bold mb-2">Trading Tip</h4>
        <p className="text-sm text-zinc-300 leading-relaxed italic">
          "The goal of a successful trader is to make the best trades. Money is secondary."
        </p>
      </div>
    </div>
  );
}
