import { useState, useEffect } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameDay, 
  addMonths, 
  subMonths,
  parseISO
} from 'date-fns';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Trade } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const TRADING_QUOTES = [
  "Jangan biarkan emosi mengendalikan trading Anda. Disiplin adalah kunci.",
  "Pasar tidak peduli dengan apa yang Anda pikirkan. Ikuti apa yang pasar lakukan.",
  "Trading bukan tentang seberapa banyak Anda menghasilkan, tapi seberapa sedikit Anda merugi saat salah.",
  "Rencana trading yang baik adalah setengah dari kemenangan.",
  "Kesabaran dalam menunggu setup yang tepat jauh lebih berharga daripada mengejar harga.",
  "Manajemen risiko adalah satu-satunya hal yang bisa Anda kendalikan sepenuhnya.",
  "Fokus pada proses, bukan pada hasil uangnya. Uang akan mengikuti proses yang benar.",
  "Belajarlah untuk mencintai kerugian kecil, itu akan menyelamatkan Anda dari kerugian besar.",
  "Tren adalah teman Anda sampai ia berakhir.",
  "Jangan pernah mempertaruhkan lebih dari yang Anda sanggup untuk kehilangan.",
  "Pasar adalah alat untuk mentransfer uang dari yang tidak sabar ke yang sabar.",
  "Kualitas trading Anda jauh lebih penting daripada kuantitas trading Anda.",
  "Jangan mencoba membalas dendam pada pasar. Pasar tidak punya perasaan.",
  "Trading yang sukses adalah tentang mengelola probabilitas, bukan mencari kepastian.",
  "Selalu gunakan stop loss. Itu adalah asuransi untuk modal Anda.",
  "Trading adalah maraton, bukan sprint. Jaga stamina modal Anda.",
  "Jangan biarkan satu kerugian menghancurkan rencana jangka panjang Anda.",
  "Pasar selalu benar, pendapat Anda bisa saja salah.",
  "Keberhasilan dalam trading datang dari disiplin yang membosankan.",
  "Lebih baik kehilangan peluang daripada kehilangan uang.",
  "Trading tanpa rencana adalah rencana untuk gagal.",
  "Emosi adalah musuh terbesar trader. Logika adalah sahabat terbaik.",
  "Kuasai satu strategi sebelum mencoba menguasai semuanya.",
  "Pasar tidak berhutang apa pun pada Anda. Hormati pergerakannya.",
  "Catat setiap trade Anda. Jurnal adalah guru terbaik bagi trader."
];

interface CalendarDashboardProps {
  trades: Trade[];
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
  onDateSelect: (date: Date) => void;
  onTradeSelect: (trade: Trade) => void;
}

export default function CalendarDashboard({ 
  trades, 
  currentMonth,
  onMonthChange,
  onDateSelect, 
  onTradeSelect 
}: CalendarDashboardProps) {
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [shuffledQuotes, setShuffledQuotes] = useState<string[]>([]);
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    // Shuffle quotes on initial load
    const shuffled = [...TRADING_QUOTES].sort(() => Math.random() - 0.5);
    setShuffledQuotes(shuffled);
    
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % TRADING_QUOTES.length);
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  const currentQuote = shuffledQuotes.length > 0 ? shuffledQuotes[quoteIndex] : TRADING_QUOTES[0];

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getDayTrades = (day: Date) => {
    return trades.filter(t => isSameDay(parseISO(t.date), day));
  };

  const getDayResult = (day: Date) => {
    const dayTrades = getDayTrades(day);
    if (dayTrades.length === 0) return 'none';
    
    const total = dayTrades.reduce((acc, t) => acc + t.profit, 0);
    if (total > 0) return 'profit';
    if (total < 0) return 'loss';
    return 'none';
  };

  const getDayProfit = (day: Date) => {
    const dayTrades = getDayTrades(day);
    return dayTrades.reduce((acc, t) => acc + t.profit, 0);
  };

  const getDayPips = (day: Date) => {
    const dayTrades = getDayTrades(day);
    return dayTrades.reduce((acc, t) => acc + t.pips, 0);
  };

  if (selectedDay) {
    const dayTrades = getDayTrades(selectedDay);
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="flex items-center justify-between bg-zinc-900 p-4 rounded-2xl border border-zinc-800 shadow-lg">
          <button 
            onClick={() => setSelectedDay(null)}
            className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400"
          >
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-lg font-bold text-white">
            {format(selectedDay, 'MMMM d, yyyy')}
          </h2>
          <div className="w-10" />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              Trades ({dayTrades.length})
            </h3>
            <button 
              onClick={() => onDateSelect(selectedDay)}
              className="text-xs font-bold text-emerald-500 hover:text-emerald-400 uppercase tracking-wider"
            >
              + Add Trade
            </button>
          </div>

          <div className="space-y-3">
            {dayTrades.length === 0 ? (
              <div className="bg-zinc-900 border border-dashed border-zinc-800 rounded-2xl p-8 text-center text-zinc-500 text-sm">
                No trades recorded for this day
              </div>
            ) : (
              dayTrades.map(trade => (
                <button
                  key={trade.id}
                  onClick={() => onTradeSelect(trade)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex justify-between items-center hover:border-zinc-700 transition-all text-left"
                >
                  <div>
                    <div className="text-sm font-bold text-white">{trade.pair} <span className="text-[10px] font-medium opacity-50 uppercase">{trade.type}</span></div>
                    <div className="text-[10px] text-zinc-500 uppercase font-bold">{format(parseISO(trade.date), 'HH:mm')} • {trade.lotSize} Lot • RR {trade.rr} • {trade.pips > 0 ? '+' : ''}{trade.pips} pips</div>
                  </div>
                  <div className={`text-lg font-black ${trade.profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {trade.profit >= 0 ? '+' : ''}{trade.profit.toFixed(2)}
                  </div>
                </button>
              ))
            )}
          </div>

          {dayTrades.length > 0 && (
            <div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-zinc-500 uppercase">Daily Profit</span>
                <span className={`text-xl font-black ${getDayProfit(selectedDay) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {getDayProfit(selectedDay) >= 0 ? '+' : ''}{getDayProfit(selectedDay).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center border-t border-zinc-800 pt-2">
                <span className="text-xs font-bold text-zinc-500 uppercase">Daily Pips</span>
                <span className={`text-sm font-bold ${getDayPips(selectedDay) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {getDayPips(selectedDay) >= 0 ? '+' : ''}{getDayPips(selectedDay).toFixed(1)} pips
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-zinc-900 p-4 rounded-2xl border border-zinc-800 shadow-lg">
        <button 
          onClick={() => onMonthChange(subMonths(currentMonth, 1))}
          className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400"
        >
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-lg font-bold text-white">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <button 
          onClick={() => onMonthChange(addMonths(currentMonth, 1))}
          className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
          <div key={`${day}-${i}`} className="text-center text-[10px] font-bold text-zinc-500 uppercase py-2">
            {day}
          </div>
        ))}
        
        {/* Padding for start of month */}
        {Array.from({ length: monthStart.getDay() }).map((_, i) => (
          <div key={`pad-${i}`} className="aspect-square" />
        ))}

        {days.map(day => {
          const result = getDayResult(day);
          const profit = getDayProfit(day);
          const dayTrades = getDayTrades(day);
          
          return (
            <button
              key={day.toString()}
              onClick={() => setSelectedDay(day)}
              className={cn(
                "aspect-square rounded-xl flex flex-col items-center justify-center relative transition-all active:scale-95 border",
                result === 'profit' ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400" :
                result === 'loss' ? "bg-red-500/20 border-red-500/30 text-red-400" :
                "bg-zinc-900 border-zinc-800 text-zinc-500"
              )}
            >
              <span className="text-sm font-bold">{format(day, 'd')}</span>
              {dayTrades.length > 0 && (
                <div className="flex flex-col items-center mt-0.5">
                  <span className="text-[8px] font-mono opacity-80 leading-none">
                    {profit > 0 ? '+' : ''}{profit.toFixed(0)}
                  </span>
                  <span className="text-[7px] font-mono opacity-80 leading-none mt-0.5">
                    {getDayPips(day) > 0 ? '+' : ''}{getDayPips(day).toFixed(0)}p
                  </span>
                  <span className="text-[7px] font-bold uppercase opacity-50 leading-none mt-0.5">
                    {dayTrades.length}T
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex gap-4 justify-center text-[10px] font-medium uppercase tracking-widest text-zinc-500 pb-2">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Profit</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <span>Loss</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-zinc-700" />
          <span>No Trade</span>
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-zinc-800">
        <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800 flex flex-col items-center text-center space-y-4 animate-in fade-in duration-700">
          <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500">
            <Quote size={20} />
          </div>
          <div className="space-y-2 max-w-xs">
            <p className="text-sm font-medium text-zinc-300 leading-relaxed italic">
              "{currentQuote}"
            </p>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 pt-2">
              - SandaniFX
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
