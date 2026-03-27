export type TradeResult = 'win' | 'loss' | 'bep' | 'sl_plus' | 'none';
export type TradeType = 'buy' | 'sell';

export interface Trade {
  id: string;
  date: string; // ISO string
  pair: string;
  type: TradeType;
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  exitPrice: number;
  lotSize: number;
  pips: number;
  rr: number;
  profit: number;
  result: TradeResult;
  notes: string;
}

export interface DailyStats {
  date: string;
  totalProfit: number;
  totalPips: number;
  trades: Trade[];
  result: TradeResult;
}

export interface MonthlyStats {
  totalTrades: number;
  totalWinningTrades: number;
  totalLosingTrades: number;
  totalBEP: number;
  totalSLPlus: number;
  totalPips: number;
  winRate: number;
  maxWinStreak: number;
  maxLossStreak: number;
  averageRR: number;
  profitFactor: number;
  maxDrawdown: number;
  consistencyScore: number;
  totalProfit: number;
  totalLoss: number;
  bestDay: { date: string; profit: number } | null;
  worstDay: { date: string; profit: number } | null;
}

export interface WeeklyStats {
  weekNumber: number;
  profit: number;
  trades: number;
  winRate: number;
}
