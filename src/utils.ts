import { Trade, MonthlyStats, WeeklyStats } from './types';
import { 
  startOfMonth, 
  endOfMonth, 
  isSameMonth, 
  startOfWeek, 
  endOfWeek, 
  getWeek,
  parseISO,
  isSameDay,
  format
} from 'date-fns';

export function calculateMonthlyStats(trades: Trade[], monthDate: Date): MonthlyStats {
  // Sort all trades by date for streaks and equity
  const sortedAllTrades = [...trades].sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime());
  
  let totalProfit = 0;
  let totalLoss = 0;
  let totalPips = 0;
  let winCount = 0;
  let lossCount = 0;
  let bepCount = 0;
  let slPlusCount = 0;
  
  const dailyProfits: Record<string, number> = {};

  trades.forEach(t => {
    if (t.result === 'win') {
      totalProfit += t.profit;
      winCount++;
    } else if (t.result === 'sl_plus') {
      totalProfit += t.profit;
      winCount++;
      slPlusCount++;
    } else if (t.result === 'loss') {
      totalLoss += Math.abs(t.profit);
      lossCount++;
    } else if (t.result === 'bep') {
      bepCount++;
      // BEP is neutral, but we still add its profit (which should be near 0)
      if (t.profit > 0) totalProfit += t.profit;
      else totalLoss += Math.abs(t.profit);
    }
    
    totalPips += t.pips;
    
    const dateStr = format(parseISO(t.date), 'yyyy-MM-dd');
    dailyProfits[dateStr] = (dailyProfits[dateStr] || 0) + t.profit;
  });

  const sortedDaily = Object.entries(dailyProfits).sort((a, b) => b[1] - a[1]);
  const bestDay = sortedDaily.length > 0 ? { date: sortedDaily[0][0], profit: sortedDaily[0][1] } : null;
  const worstDay = sortedDaily.length > 0 ? { date: sortedDaily[sortedDaily.length - 1][0], profit: sortedDaily[sortedDaily.length - 1][1] } : null;

  // Streaks
  let maxWinStreak = 0;
  let maxLossStreak = 0;
  let tempWin = 0;
  let tempLoss = 0;

  sortedAllTrades.forEach(t => {
    if (t.result === 'win' || t.result === 'sl_plus') {
      tempWin++;
      tempLoss = 0;
      maxWinStreak = Math.max(maxWinStreak, tempWin);
    } else if (t.result === 'loss') {
      tempLoss++;
      tempWin = 0;
      maxLossStreak = Math.max(maxLossStreak, tempLoss);
    } else if (t.result === 'bep') {
      // BEP doesn't break a win streak, but doesn't increment it either?
      // Actually, many traders consider BEP as "neutral" so it doesn't break the streak.
      // Let's keep streaks as they are (BEP doesn't reset them).
    }
  });

  // Average RR
  const averageRR = trades.length > 0 
    ? trades.reduce((acc, t) => acc + (t.rr || 0), 0) / trades.length 
    : 0;

  // Profit Factor
  const profitFactor = totalLoss > 0 ? totalProfit / totalLoss : totalProfit > 0 ? Infinity : 0;

  // Max Drawdown
  let peak = 0;
  let currentBalance = 0;
  let maxDrawdown = 0;
  
  sortedAllTrades.forEach(t => {
    currentBalance += t.profit;
    if (currentBalance > peak) {
      peak = currentBalance;
    }
    const drawdown = peak - currentBalance;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }
  });

  // Consistency Score = (Highest Daily Profit / Total Profit) * 100
  const netTotalProfit = Object.values(dailyProfits).reduce((acc, p) => acc + p, 0);
  const highestDailyProfit = bestDay ? Math.max(0, bestDay.profit) : 0;
  const consistencyScore = netTotalProfit > 0 ? Math.min(100, (highestDailyProfit / netTotalProfit) * 100) : 0;

  // Win Rate (never 100% if there's at least one loss)
  let winRate = trades.length > 0 ? (winCount / trades.length) * 100 : 0;
  if (winRate === 100 && lossCount > 0) {
    winRate = 99.99;
  }

  return {
    totalTrades: trades.length,
    totalWinningTrades: winCount,
    totalLosingTrades: lossCount,
    totalBEP: bepCount,
    totalSLPlus: slPlusCount,
    totalPips,
    winRate,
    maxWinStreak,
    maxLossStreak,
    averageRR,
    profitFactor,
    maxDrawdown,
    consistencyScore,
    totalProfit,
    totalLoss,
    bestDay,
    worstDay
  };
}

export function calculateWeeklyStats(trades: Trade[], monthDate: Date): WeeklyStats[] {
  const weeks: Record<number, { profit: number, trades: number, wins: number }> = {};
  
  trades.filter(t => isSameMonth(parseISO(t.date), monthDate)).forEach(t => {
    const date = parseISO(t.date);
    const weekNum = getWeek(date);
    
    if (!weeks[weekNum]) {
      weeks[weekNum] = { profit: 0, trades: 0, wins: 0 };
    }
    
    weeks[weekNum].trades++;
    weeks[weekNum].profit += t.profit;
    if (t.profit > 0) {
      weeks[weekNum].wins++;
    }
  });

  return Object.entries(weeks).map(([num, data]) => ({
    weekNumber: parseInt(num),
    profit: data.profit,
    trades: data.trades,
    winRate: data.trades > 0 ? (data.wins / data.trades) * 100 : 0
  }));
}

export function exportToCSV(trades: Trade[]) {
  const headers = ['Date', 'Pair', 'Type', 'Result', 'Profit', 'Pips', 'Entry', 'Exit', 'SL', 'TP', 'RR', 'Notes'];
  const rows = trades.map(t => [
    format(parseISO(t.date), 'yyyy-MM-dd HH:mm'),
    t.pair,
    t.type,
    t.result,
    t.profit,
    t.pips,
    t.entryPrice,
    t.exitPrice,
    t.stopLoss,
    t.takeProfit,
    t.rr,
    t.notes.replace(/,/g, ';')
  ]);

  const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `sandanifx_journal_${format(new Date(), 'yyyy-MM-dd')}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
