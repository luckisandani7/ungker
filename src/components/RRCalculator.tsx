import { useState } from 'react';
import { Calculator, ArrowRightLeft, ChevronLeft } from 'lucide-react';

interface RRCalculatorProps {
  onBack?: () => void;
}

export default function RRCalculator({ onBack }: RRCalculatorProps) {
  const [entry, setEntry] = useState<number>(0);
  const [sl, setSl] = useState<number>(0);
  const [tp, setTp] = useState<number>(0);

  const risk = entry !== 0 && sl !== 0 ? Math.abs(entry - sl) : 0;
  const reward = entry !== 0 && tp !== 0 ? Math.abs(tp - entry) : 0;
  const rr = risk !== 0 ? (reward / risk).toFixed(2) : '0.00';

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500">
            <Calculator size={24} />
          </div>
          <h2 className="text-xl font-bold text-white">RR Calculator</h2>
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
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Entry Price</label>
            <input
              type="number"
              step="0.00001"
              value={entry || ''}
              onChange={e => setEntry(parseFloat(e.target.value) || 0)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-lg font-mono"
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
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 text-lg font-mono"
              placeholder="0.00000"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Take Profit</label>
            <input
              type="number"
              step="0.00001"
              value={tp || ''}
              onChange={e => setTp(parseFloat(e.target.value) || 0)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-lg font-mono"
              placeholder="0.00000"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-zinc-800 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-zinc-500">Risk (Pips/Points)</span>
            <span className="text-lg font-bold text-red-400 font-mono">{risk.toFixed(5)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-zinc-500">Reward (Pips/Points)</span>
            <span className="text-lg font-bold text-emerald-400 font-mono">{reward.toFixed(5)}</span>
          </div>
          
          <div className="bg-emerald-500/10 p-6 rounded-2xl border border-emerald-500/20 flex flex-col items-center justify-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-500/60">Risk to Reward Ratio</span>
            <div className="text-4xl font-black text-emerald-400">1 : {rr}</div>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800 flex items-start gap-3">
        <ArrowRightLeft size={18} className="text-zinc-500 mt-0.5 shrink-0" />
        <p className="text-xs text-zinc-500 leading-relaxed">
          The Risk-to-Reward ratio helps you determine if a trade is worth taking. A ratio of 1:2 or higher is generally recommended for long-term profitability.
        </p>
      </div>
    </div>
  );
}
