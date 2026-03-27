import { useState } from 'react';
import { Wallet, ChevronLeft, Info } from 'lucide-react';

interface MoneyManagementCalculatorProps {
  onBack?: () => void;
}

export default function MoneyManagementCalculator({ onBack }: MoneyManagementCalculatorProps) {
  const [balance, setBalance] = useState<number>(0);
  const [riskPercent, setRiskPercent] = useState<number>(1);
  const [entry, setEntry] = useState<number>(0);
  const [sl, setSl] = useState<number>(0);

  const riskAmount = balance * (riskPercent / 100);
  const pips = entry !== 0 && sl !== 0 ? Math.abs(entry - sl) * 10 : 0;
  const lotSize = pips !== 0 ? riskAmount / pips : 0;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500">
            <Wallet size={24} />
          </div>
          <h2 className="text-xl font-bold text-zinc-100">Money Management</h2>
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

      <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 space-y-6">
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Account Balance ($)</label>
            <input
              type="number"
              value={balance || ''}
              onChange={e => setBalance(parseFloat(e.target.value) || 0)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-4 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-lg font-mono"
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Risk Percentage (%)</label>
            <input
              type="number"
              value={riskPercent || ''}
              onChange={e => setRiskPercent(parseFloat(e.target.value) || 0)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-4 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-lg font-mono"
              placeholder="1.00"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Entry Price</label>
              <input
                type="number"
                step="0.00001"
                value={entry || ''}
                onChange={e => setEntry(parseFloat(e.target.value) || 0)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-4 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-lg font-mono"
                placeholder="0.00000"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Stop Loss</label>
              <input
                type="number"
                step="0.00001"
                value={sl || ''}
                onChange={e => setSl(parseFloat(e.target.value) || 0)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-4 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-red-500/50 text-lg font-mono"
                placeholder="0.00000"
              />
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-zinc-800 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-zinc-950/50 p-4 rounded-2xl border border-zinc-800">
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Risk Amount</div>
              <div className="text-xl font-bold text-red-400 font-mono">${riskAmount.toFixed(2)}</div>
              <div className="text-[10px] text-zinc-600 font-medium">{riskPercent}% of balance</div>
            </div>
            <div className="bg-zinc-950/50 p-4 rounded-2xl border border-zinc-800">
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Stop Loss</div>
              <div className="text-xl font-bold text-zinc-100 font-mono">{pips.toFixed(1)}</div>
              <div className="text-[10px] text-zinc-600 font-medium">Pips / Points</div>
            </div>
          </div>
          
          <div className="bg-blue-500/10 p-6 rounded-2xl border border-blue-500/20 flex flex-col items-center justify-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-500/60 text-center">Recommended Position Size</span>
            <div className="text-4xl font-black text-blue-400 font-mono">{lotSize.toFixed(2)}</div>
            <span className="text-[10px] font-bold text-blue-500/40 uppercase tracking-tighter">Lots</span>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800/50 flex items-start gap-3">
        <Info size={18} className="text-zinc-500 mt-0.5 shrink-0" />
        <p className="text-xs text-zinc-500 leading-relaxed">
          Proper money management is the key to trading longevity. Never risk more than you are willing to lose on a single trade.
        </p>
      </div>
    </div>
  );
}
