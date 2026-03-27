import React, { useState } from 'react';
import { Calendar, PlusCircle, BarChart3, Calculator, Download, MoreHorizontal, CheckSquare, LayoutList, X, LogOut, AlertCircle } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAuth } from '../contexts/AuthContext';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onExport: () => void;
}

export default function Layout({ children, activeTab, onTabChange, onExport }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isGuest, logout } = useAuth();

  const tabs = [
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'add', label: 'Add Trade', icon: PlusCircle },
    { id: 'stats', label: 'Stats', icon: BarChart3 },
  ];

  const isOtherActive = activeTab === 'other' || ['checklist', 'outlook', 'calculator', 'money-management', 'session-alarm', 'about'].includes(activeTab);

  return (
    <div className="min-h-screen bg-[#050505] text-white pb-20 font-sans relative overflow-hidden">
      {/* Watermark */}
      <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-0 select-none opacity-[0.03]">
        <span className="text-8xl font-black rotate-[-35deg] whitespace-nowrap">
          SandaniFx
        </span>
      </div>

      {isGuest && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 flex items-center justify-between gap-4 z-20 relative">
          <div className="flex items-center gap-2 text-amber-500">
            <AlertCircle size={16} />
            <p className="text-[11px] font-medium">
              Guest Mode: Data is stored locally and may be lost if the app is uninstalled. 
            </p>
          </div>
          <button 
            onClick={logout}
            className="text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-black px-2 py-1 rounded hover:bg-amber-400 transition-colors whitespace-nowrap"
          >
            Sign In to Sync
          </button>
        </div>
      )}

      <header className="sticky top-0 z-10 bg-zinc-900 border-b border-zinc-800 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h1 className="text-base font-bold tracking-tight text-zinc-500 italic">"The less you know, the better you trade"</h1>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => onTabChange('other')}
            className={cn(
              "p-2 rounded-full transition-all",
              isOtherActive ? "bg-emerald-500/10 text-emerald-500" : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
            )}
            title="Tools & More"
          >
            <MoreHorizontal size={20} />
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 px-2 py-1 flex justify-around items-center z-20">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                onTabChange(tab.id);
              }}
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-xl transition-all w-full",
                isActive ? "text-emerald-500 bg-emerald-500/10" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              <Icon size={24} />
              <span className="text-[10px] font-medium uppercase tracking-wider">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
