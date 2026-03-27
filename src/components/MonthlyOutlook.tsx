import { useMemo, useState } from 'react';
import { Trade } from '../types';
import { format, parseISO } from 'date-fns';
import { LayoutList, ChevronRight, ChevronLeft, Calendar as CalendarIcon } from 'lucide-react';

interface MonthlyOutlookProps {
  allTrades: Record<string, Trade[]>;
  onBack?: () => void;
}

export default function MonthlyOutlook({ allTrades, onBack }: MonthlyOutlookProps) {
  const [selectedMonthKey, setSelectedMonthKey] = useState<string | null>(null);

  const availableMonths = useMemo(() => {
    return Object.keys(allTrades)
      .filter(key => allTrades[key].length > 0)
      .sort((a, b) => b.localeCompare(a)); // Newest first
  }, [allTrades]);

  const selectedTrades = useMemo(() => {
    if (!selectedMonthKey) return [];
    return [...(allTrades[selectedMonthKey] || [])].sort(
      (a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime()
    );
  }, [allTrades, selectedMonthKey]);

  if (selectedMonthKey) {
    const monthDate = parseISO(`${selectedMonthKey}-01`);
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="flex items-center justify-between bg-zinc-900 p-4 rounded-2xl border border-zinc-800 shadow-lg">
          <button 
            onClick={() => setSelectedMonthKey(null)}
            className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400"
          >
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-lg font-bold text-white">
            {format(monthDate, 'MMMM yyyy')} Trades
          </h2>
          <div className="w-10" />
        </div>

        <div className="space-y-4">
          {selectedTrades.map(trade => (
            <div key={trade.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
              <div className="bg-zinc-800/50 px-4 py-2 border-b border-zinc-800 flex justify-between items-center">
                <span className="text-xs font-bold text-white">{format(parseISO(trade.date), 'dd MMM yyyy')}</span>
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                  trade.result === 'win' ? 'bg-emerald-500/10 text-emerald-400' : 
                  trade.result === 'sl_plus' ? 'bg-blue-500/10 text-blue-400' :
                  trade.result === 'bep' ? 'bg-zinc-500/10 text-zinc-400' :
                  'bg-red-500/10 text-red-400'
                }`}>
                  {trade.result === 'sl_plus' ? 'SL+' : trade.result.toUpperCase()}
                </span>
              </div>
              <div className="p-4 grid grid-cols-2 gap-y-3 gap-x-4">
                <div>
                  <div className="text-[10px] font-bold text-zinc-500 uppercase">Entry</div>
                  <div className="text-sm font-mono text-zinc-300">{trade.entryPrice}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-zinc-500 uppercase">Exit</div>
                  <div className="text-sm font-mono text-zinc-300">{trade.exitPrice}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-zinc-500 uppercase">Stop Loss</div>
                  <div className="text-sm font-mono text-red-500/70">{trade.stopLoss}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-zinc-500 uppercase">Take Profit</div>
                  <div className="text-sm font-mono text-emerald-500/70">{trade.takeProfit}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-zinc-500 uppercase">RR</div>
                  <div className="text-sm font-bold text-white">{trade.rr}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-zinc-500 uppercase">Pips</div>
                  <div className={`text-sm font-bold ${trade.pips >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {trade.pips > 0 ? '+' : ''}{trade.pips}
                  </div>
                </div>
                <div className="col-span-2 pt-2 border-t border-zinc-800/50 flex justify-between items-center">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase">Profit / Loss</span>
                  <span className={`text-lg font-black ${trade.profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {trade.profit >= 0 ? '+' : ''}${trade.profit.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500">
            <LayoutList size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Monthly Outlook</h2>
            <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">
              Trade History Browser
            </p>
          </div>
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

      <div className="space-y-3">
        {availableMonths.map(monthKey => {
          const monthDate = parseISO(`${monthKey}-01`);
          const tradeCount = allTrades[monthKey].length;
          return (
            <button
              key={monthKey}
              onClick={() => setSelectedMonthKey(monthKey)}
              className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex items-center justify-between hover:border-white/10 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white/5 rounded-xl text-zinc-400 group-hover:text-emerald-500 transition-colors">
                  <CalendarIcon size={20} />
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold text-white">{format(monthDate, 'MMMM yyyy')}</div>
                  <div className="text-[10px] font-bold text-zinc-500 uppercase">{tradeCount} Trades</div>
                </div>
              </div>
              <ChevronRight size={20} className="text-zinc-600 group-hover:text-zinc-400 transition-colors" />
            </button>
          );
        })}

        {availableMonths.length === 0 && (
          <div className="py-12 text-center text-zinc-600 text-sm italic">
            No trade history found.
          </div>
        )}
      </div>
    </div>
  );
}
