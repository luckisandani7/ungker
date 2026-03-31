import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Trade, MonthlyStats } from '../types';
import { BrainCircuit, Sparkles, AlertCircle, ChevronLeft, Send, Loader2, TrendingUp, TrendingDown, Target, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';

interface AIJournalMentorProps {
  trades: Trade[];
  stats: MonthlyStats;
  onBack: () => void;
}

export default function AIJournalMentor({ trades, stats, onBack }: AIJournalMentorProps) {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzePerformance = async () => {
    // Mendukung process.env (AI Studio) dan import.meta.env (Vite/GitHub Pages)
    const apiKey = process.env.GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
      setError("Konfigurasi AI belum lengkap (API Key tidak ditemukan). Jika menggunakan GitHub Pages, pastikan VITE_GEMINI_API_KEY sudah diatur di GitHub Secrets.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const ai = new GoogleGenAI({ apiKey });
      const model = ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `
          Analyze this trading performance data and provide professional, actionable advice for the trader.
          PLEASE PROVIDE THE ENTIRE ANALYSIS IN INDONESIAN.
          
          MONTHLY STATISTICS:
          - Total Trades: ${stats.totalTrades}
          - Win Rate: ${stats.winRate.toFixed(1)}%
          - Total Winning Trades (Full Win): ${stats.totalWinningTrades - stats.totalSLPlus}
          - Total SL+ (Stop Loss in Profit): ${stats.totalSLPlus}
          - Total BEP (Break Even): ${stats.totalBEP}
          - Total Losing Trades (Full Loss): ${stats.totalLosingTrades}
          - Total Profit: ${stats.totalProfit}
          - Total Loss: ${stats.totalLoss}
          - Net Profit: ${stats.totalProfit - stats.totalLoss}
          - Profit Factor: ${stats.profitFactor.toFixed(2)}
          - Average R:R: ${stats.averageRR.toFixed(2)}
          - Max Win Streak: ${stats.maxWinStreak}
          - Max Loss Streak: ${stats.maxLossStreak}
          - Max Drawdown: ${stats.maxDrawdown.toFixed(2)}
          - Consistency Score: ${stats.consistencyScore}/100
          
          RECENT TRADES (Last 10):
          ${trades.slice(-10).map(t => `- ${t.date}: ${t.pair} (${t.type}) Result: ${t.result}, Profit: ${t.profit}, Notes: ${t.notes}`).join('\n')}
          
          NOTE ON RESULTS:
          - 'win': Full win.
          - 'loss': Full loss.
          - 'bep': Break Even Point (Excellent risk management).
          - 'sl_plus': Stop Loss in Profit (Secured profit before hitting TP).
          
          Please provide:
          1. A summary of the current performance.
          2. Identification of strengths and weaknesses.
          3. Specific advice on risk management or psychology based on the streaks and drawdown.
          4. One "Golden Tip" for the next month.
          
          Keep the tone professional, encouraging, and concise. Use Markdown for formatting.
          IMPORTANT: Do not use excessive symbols. Provide a clean, readable output dalam Bahasa Indonesia.
        `,
        config: {
          systemInstruction: "Anda adalah mentor trading ahli dan psikolog performa bernama Lkey7 AI. Anda menganalisis jurnal trading untuk membantu trader mencapai konsistensi dan disiplin tingkat profesional. Akui 'BEP' (Break Even) dan 'SL+' (Stop Loss in Profit) sebagai bentuk manajemen risiko yang sangat baik dan disiplin, bukan sebagai kegagalan, BEP dan SL+ adalah transaksi yang close di bawah 30% dari target pada statik. Berikan semua jawaban dalam Bahasa Indonesia yang bersih, profesional, dan mudah dibaca tanpa simbol-simbol teknis yang mengganggu.",
        }
      });

      const response = await model;
      setAnalysis(response.text || "No analysis generated.");
    } catch (err) {
      console.error("AI Analysis Error:", err);
      setError("Gagal menghasilkan analisis. Silakan coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between bg-black/40 p-4 rounded-2xl border border-zinc-800/50 backdrop-blur-sm">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-white tracking-tight">Lkey7 AI</h2>
        </div>
        <div className="w-10" /> {/* Spacer to keep title centered */}
      </div>

      {!analysis && !loading && (
        <div className="bg-black border border-zinc-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
          <div className="flex items-center justify-center mx-auto">
            <img src="https://i.postimg.cc/HnSk64Vk/b8afdbe223638b5eb8e107038ccf5230.jpg" alt="Lkey7 AI" className="w-20 h-20 rounded-2xl object-cover" referrerPolicy="no-referrer" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">
              Siap untuk Analisis?
            </h3>
            <p className="text-zinc-400 text-sm max-w-xs mx-auto">
              Dapatkan analisis mendalam berbasis AI untuk performa trading Anda. Saya akan meninjau statistik, pola psikologi, dan memberikan saran strategis untuk membantu Anda mencapai konsistensi.
            </p>
          </div>
          <button
            onClick={analyzePerformance}
            disabled={stats.totalTrades < 5}
            className="w-full bg-white hover:bg-zinc-200 disabled:opacity-50 disabled:hover:bg-white text-black font-black py-4 rounded-2xl transition-all flex items-center justify-center shadow-lg shadow-white/10"
          >
            ANALYSIS NOW
          </button>
          {stats.totalTrades < 5 && (
            <div className="flex flex-col items-center gap-2">
              <p className="text-[10px] text-amber-500 font-bold uppercase tracking-wider">
                Minimal 5 transaksi diperlukan ({stats.totalTrades}/5)
              </p>
              <p className="text-[9px] text-zinc-500 italic">
                Tambahkan lebih banyak transaksi untuk mendapatkan analisis yang akurat.
              </p>
            </div>
          )}
        </div>
      )}

      {loading && (
        <div className="bg-black border border-zinc-800 rounded-3xl p-12 text-center space-y-4">
          <Loader2 className="text-white animate-spin mx-auto" size={48} />
          <div className="space-y-1">
            <p className="text-white font-bold">
              Menganalisis data Anda...
            </p>
            <p className="text-zinc-500 text-xs">
              Meninjau Win Rate, Risk/Reward, dan pola Psikologi.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-3 text-red-400">
          <AlertCircle size={20} />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <AnimatePresence>
        {analysis && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-black border border-zinc-800 p-4 rounded-2xl space-y-1">
                <div className="flex items-center gap-2 text-emerald-500 mb-1">
                  <TrendingUp size={14} />
                  <span className="text-[10px] font-black uppercase tracking-wider">
                    Tingkat Kemenangan
                  </span>
                </div>
                <p className="text-2xl font-black text-white">{stats.winRate.toFixed(1)}%</p>
              </div>
              <div className="bg-black border border-zinc-800 p-4 rounded-2xl space-y-1">
                <div className="flex items-center gap-2 text-zinc-400 mb-1">
                  <Target size={14} />
                  <span className="text-[10px] font-black uppercase tracking-wider">
                    Faktor Profit
                  </span>
                </div>
                <p className="text-2xl font-black text-white">{stats.profitFactor.toFixed(2)}</p>
              </div>
            </div>

            <div className="bg-black border border-zinc-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
              <div className="markdown-body prose prose-invert prose-emerald max-w-none text-sm leading-relaxed text-zinc-400">
                <Markdown>
                  {analysis}
                </Markdown>
              </div>
            </div>

            <button
              onClick={() => setAnalysis(null)}
              className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 font-bold py-3 rounded-2xl transition-all text-sm"
            >
              ANALISIS BARU
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
