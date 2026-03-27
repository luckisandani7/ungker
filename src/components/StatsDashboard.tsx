import { useMemo, useState } from 'react';
import { Trade } from '../types';
import { usePrivacy } from '../contexts/PrivacyContext';
import { calculateMonthlyStats, calculateWeeklyStats } from '../utils';
import { 
  Target, 
  ChevronLeft, 
  LayoutList, 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  ShieldAlert, 
  BarChart3,
  Award,
  Skull,
  Activity,
  DollarSign,
  Eye,
  EyeOff
} from 'lucide-react';
import EquityCurve from './EquityCurve';
import { getWeek, parseISO, format } from 'date-fns';

interface StatsDashboardProps {
  trades: Trade[];
  currentMonth: Date;
}

export default function StatsDashboard({ trades, currentMonth }: StatsDashboardProps) {
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const { formatMoney, hideMoney, toggleHideMoney } = usePrivacy();

  const stats = useMemo(() => calculateMonthlyStats(trades, currentMonth), [trades, currentMonth]);
  const weeklyStats = useMemo(() => calculateWeeklyStats(trades, currentMonth), [trades, currentMonth]);

  const netProfit = stats.totalProfit - stats.totalLoss;

  const weeklyTrades = useMemo(() => {
    if (selectedWeek === null) return [];
    return trades
      .filter(t => getWeek(parseISO(t.date)) === selectedWeek)
      .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime());
  }, [trades, selectedWeek]);

  if (selectedWeek !== null) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="flex items-center justify-between bg-zinc-900 p-4 rounded-2xl border border-zinc-800 shadow-lg">
          <button 
            onClick={() => setSelectedWeek(null)}
            className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400"
          >
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-lg font-bold text-white">
            Week {selectedWeek} Trades
          </h2>
          <div className="w-10" />
        </div>

        <div className="space-y-3">
          {weeklyTrades.map(trade => (
            <div
              key={trade.id}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex justify-between items-center"
            >
              <div>
                <div className="text-sm font-bold text-white">
                  {format(parseISO(trade.date), 'MMM d')} • {trade.pair}
                </div>
                <div className="text-[10px] text-zinc-500 uppercase font-bold">
                  {trade.pips > 0 ? '+' : ''}{trade.pips} pips • {trade.result === 'sl_plus' ? 'SL+' : trade.result}
                </div>
              </div>
              <div className={`text-lg font-black ${trade.profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {trade.profit >= 0 ? '+' : ''}{formatMoney(trade.profit)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Primary Overview Card */}
      <div className="bg-zinc-900 rounded-3xl border border-zinc-800 overflow-hidden shadow-2xl">
        <div className="p-6 bg-gradient-to-br from-emerald-500/10 to-transparent">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-1">Net Profit</p>
              <div className="flex items-center gap-3">
                <h2 className={`text-4xl font-black tracking-tighter ${netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {formatMoney(netProfit)}
                </h2>
                <button 
                  onClick={toggleHideMoney}
                  className="p-1.5 rounded-lg bg-zinc-800/50 border border-zinc-700/50 text-zinc-500 hover:text-zinc-100 hover:bg-zinc-700 transition-all backdrop-blur-sm"
                  title={hideMoney ? "Show Money" : "Hide Money"}
                >
                  {hideMoney ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
            <div className="bg-zinc-800/50 p-3 rounded-2xl border border-zinc-700/50">
              <DollarSign className={netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'} size={24} />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-zinc-800/50">
            <div>
              <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-0.5">Win Rate</p>
              <p className="text-lg font-black text-white">{stats.winRate.toFixed(1)}%</p>
            </div>
            <div>
              <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-0.5">Trades</p>
              <p className="text-lg font-black text-white">{stats.totalTrades}</p>
            </div>
            <div>
              <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-0.5">Total Pips</p>
              <p className="text-lg font-black text-white">{stats.totalPips.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Efficiency Metrics Grid */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 px-1">Efficiency & Consistency</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-zinc-900 p-5 rounded-3xl border border-zinc-800 space-y-3">
            <div className="flex items-center gap-2 text-zinc-500">
              <Zap size={14} />
              <span className="text-[9px] font-bold uppercase tracking-wider">Profit Factor</span>
            </div>
            <div className="text-2xl font-black text-white">
              {stats.profitFactor === Infinity ? '∞' : stats.profitFactor.toFixed(2)}
            </div>
          </div>
          
          <div className="bg-zinc-900 p-5 rounded-3xl border border-zinc-800 space-y-3">
            <div className="flex items-center gap-2 text-zinc-500">
              <Activity size={14} />
              <span className="text-[9px] font-bold uppercase tracking-wider">Consistency</span>
            </div>
            <div className={`text-2xl font-black ${
              stats.consistencyScore <= 30 ? "text-emerald-400" :
              stats.consistencyScore <= 50 ? "text-emerald-500/80" :
              stats.consistencyScore <= 70 ? "text-orange-400" :
              "text-red-400"
            }`}>
              {stats.consistencyScore.toFixed(2)}%
            </div>
          </div>

          <div className="bg-zinc-900 p-5 rounded-3xl border border-zinc-800 space-y-3">
            <div className="flex items-center gap-2 text-zinc-500">
              <TrendingUp size={14} />
              <span className="text-[9px] font-bold uppercase tracking-wider">Avg RR</span>
            </div>
            <div className="text-2xl font-black text-white">1:{stats.averageRR.toFixed(2)}</div>
          </div>

          <div className="bg-zinc-900 p-5 rounded-3xl border border-zinc-800 space-y-3">
            <div className="flex items-center gap-2 text-zinc-500">
              <ShieldAlert size={14} />
              <span className="text-[9px] font-bold uppercase tracking-wider">Max Drawdown</span>
            </div>
            <div className="text-2xl font-black text-red-400">-{formatMoney(stats.maxDrawdown)}</div>
          </div>
        </div>
      </div>

      {/* Streaks & Records */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 px-1">Streaks & Records</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-zinc-900 p-5 rounded-3xl border border-zinc-800 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Win Streak</p>
              <p className="text-2xl font-black text-emerald-400">{stats.maxWinStreak}</p>
            </div>
            <Award className="text-emerald-500/20" size={32} />
          </div>
          
          <div className="bg-zinc-900 p-5 rounded-3xl border border-zinc-800 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Loss Streak</p>
              <p className="text-2xl font-black text-red-400">{stats.maxLossStreak}</p>
            </div>
            <Skull className="text-red-500/20" size={32} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="bg-zinc-900 p-5 rounded-3xl border border-zinc-800 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500">
                <TrendingUp size={20} />
              </div>
              <div>
                <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Best Day</p>
                <p className="text-sm font-bold text-white">
                  {stats.bestDay ? `${format(parseISO(stats.bestDay.date), 'MMMM d, yyyy')}` : 'N/A'}
                </p>
              </div>
            </div>
            <div className="text-lg font-black text-emerald-400">
              {stats.bestDay ? `+${formatMoney(stats.bestDay.profit)}` : formatMoney(0)}
            </div>
          </div>

          <div className="bg-zinc-900 p-5 rounded-3xl border border-zinc-800 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-500/10 rounded-2xl text-red-500">
                <TrendingDown size={20} />
              </div>
              <div>
                <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Worst Day</p>
                <p className="text-sm font-bold text-white">
                  {stats.worstDay ? `${format(parseISO(stats.worstDay.date), 'MMMM d, yyyy')}` : 'N/A'}
                </p>
              </div>
            </div>
            <div className="text-lg font-black text-red-400">
              {stats.worstDay ? `-${formatMoney(Math.abs(stats.worstDay.profit))}` : formatMoney(0)}
            </div>
          </div>
        </div>
      </div>

      {/* Equity Curve */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <BarChart3 size={14} className="text-zinc-500" />
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Equity Curve</h3>
        </div>
        <div className="bg-zinc-900 p-6 rounded-[2rem] border border-zinc-800 h-72 shadow-xl focus:outline-none outline-none [&_*]:outline-none">
          <EquityCurve trades={trades} />
        </div>
      </div>

      {/* Weekly Performance */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <LayoutList size={14} className="text-zinc-500" />
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Weekly Performance</h3>
        </div>
        <div className="space-y-3">
          {weeklyStats.map(week => (
            <button 
              key={week.weekNumber} 
              onClick={() => setSelectedWeek(week.weekNumber)}
              className="w-full bg-zinc-900 p-5 rounded-3xl border border-zinc-800 flex justify-between items-center hover:border-zinc-600 hover:bg-zinc-800 transition-all text-left group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-zinc-800 flex items-center justify-center text-xs font-black text-zinc-400 group-hover:bg-zinc-700 transition-colors">
                  W{week.weekNumber}
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{week.trades} Trades</div>
                  <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{week.winRate.toFixed(0)}% Winrate</div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-lg font-black ${week.profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {week.profit >= 0 ? '+' : ''}{formatMoney(week.profit)}
                </div>
                <div className="text-[9px] font-bold text-zinc-600 uppercase tracking-tighter">View Details</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
