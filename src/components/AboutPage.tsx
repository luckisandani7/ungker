import { ChevronLeft, Info, CheckCircle2 } from 'lucide-react';

interface AboutPageProps {
  onBack?: () => void;
}

export default function AboutPage({ onBack }: AboutPageProps) {
  const tools = [
    'Trading Checklist',
    'Monthly Outlook',
    'RR Calculator',
    'Money Management Calculator',
    'Session Alarm'
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500">
            <Info size={24} />
          </div>
          <h2 className="text-xl font-bold text-zinc-100">About App</h2>
        </div>
        {onBack && (
          <button 
            onClick={onBack}
            className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400 transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
        )}
      </div>

      <div className="flex flex-col items-center text-center space-y-4">
        <div className="w-24 h-24 bg-zinc-900 rounded-[2rem] border border-zinc-800 flex items-center justify-center overflow-hidden shadow-xl">
          <img 
            src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjDj_-fs4D-viBguBJrXTdRCHkRcmlVm4b8BT4znXL1NcXZ1zvMYz7naC1QbMZ4XrcUROP8omgfD5Jwl8hZRePycM_yE0CFXg71epECUrx58ZhnpM4Lm7KSt3b9eZ-dhraQZi0_ZSBa4BQqNY9EnJ3AT8LuEc95wfQla2qW5C3LJhtRDLg/s1600/1000110094.jpg" 
            alt="Trading Journal Logo" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tighter text-zinc-100">Trading Journal</h1>
          <p className="text-xs font-bold text-emerald-500 uppercase tracking-[0.2em]">by SandaniFX</p>
        </div>
      </div>

      <div className="space-y-6 text-zinc-400 text-sm leading-relaxed px-2">
        <p>
          Aplikasi ini dibuat untuk mereka para trader, entah itu trader baru atau profesional yang membutuhkan tempat untuk mencatat jurnal trading mereka.
        </p>
        
        <p>
          Aplikasi ini sengaja dibuat dengan UI yang sederhana dan ringan, dengan tetap mempertahankan segi estetika dan kelengkapan data yang dibutuhkan untuk evaluasi pada hari mendatang.
        </p>

        <p>
          Kami juga menyediakan beberapa tools di aplikasi ini guna untuk mempermudah para trader dalam menjalankan trading plan mereka.
        </p>

        <div className="bg-zinc-900/50 rounded-3xl border border-zinc-800 p-6 space-y-4">
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Tools yang tersedia:</h3>
          <ul className="grid grid-cols-1 gap-3">
            {tools.map((tool, index) => (
              <li key={index} className="flex items-center gap-3 text-zinc-300">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <span className="font-medium">{tool}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="pt-4 text-center">
          <p className="text-emerald-500 font-bold italic">
            "Selamat menikmati semua fitur yang ada and change your life"
          </p>
        </div>
      </div>

      <div className="text-center pt-8">
        <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold">Version 1.0.0 • 2026</p>
      </div>
    </div>
  );
}
