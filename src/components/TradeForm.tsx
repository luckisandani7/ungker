import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { Trade, TradeResult } from '../types';
import { Trash2, Save, X } from 'lucide-react';

interface TradeFormProps {
  initialDate?: Date;
  existingTrade?: Trade;
  onSave: (trade: Omit<Trade, 'id'>) => void;
  onUpdate: (id: string, trade: Partial<Trade>) => void;
  onDelete: (id: string) => void;
  onCancel: () => void;
}

export default function TradeForm({ 
  initialDate, 
  existingTrade, 
  onSave, 
  onUpdate, 
  onDelete, 
  onCancel 
}: TradeFormProps) {
  const [formData, setFormData] = useState<Omit<Trade, 'id'>>({
    date: format(initialDate || new Date(), "yyyy-MM-dd'T'HH:mm"),
    pair: 'XAUUSD',
    type: 'buy',
    result: 'win',
    entryPrice: 0,
    stopLoss: 0,
    takeProfit: 0,
    exitPrice: 0,
    lotSize: 0.01,
    pips: 0,
    rr: 0,
    profit: 0,
    notes: ''
  });

  useEffect(() => {
    if (existingTrade) {
      const { id, ...rest } = existingTrade;
      setFormData(rest);
    }
  }, [existingTrade]);

  useEffect(() => {
    const risk = Math.abs(formData.entryPrice - formData.stopLoss);
    const reward = Math.abs(formData.takeProfit - formData.entryPrice);
    const calculatedRR = risk !== 0 ? parseFloat((reward / risk).toFixed(2)) : 0;
    
    const calculatedPips = formData.type === 'buy' 
      ? (formData.exitPrice - formData.entryPrice) * 10
      : (formData.entryPrice - formData.exitPrice) * 10;
    
    const calculatedProfit = calculatedPips * 10 * formData.lotSize;
    
    let result: TradeResult = 'none';
    
    const targetPips = formData.type === 'buy' 
      ? (formData.takeProfit - formData.entryPrice) * 10
      : (formData.entryPrice - formData.takeProfit) * 10;

    if (Math.abs(calculatedProfit) < 0.5) {
      result = 'bep';
    } else if (calculatedProfit > 0) {
      if (targetPips > 0 && calculatedPips >= targetPips * 0.9) {
        result = 'win';
      } else {
        result = 'sl_plus';
      }
    } else {
      result = 'loss';
    }

    if (
      calculatedRR !== formData.rr || 
      Math.abs(calculatedPips - formData.pips) > 0.001 || 
      Math.abs(calculatedProfit - formData.profit) > 0.001 ||
      result !== formData.result
    ) {
      setFormData(prev => ({ 
        ...prev, 
        rr: calculatedRR,
        pips: parseFloat(calculatedPips.toFixed(1)),
        profit: parseFloat(calculatedProfit.toFixed(2)),
        result
      }));
    }
  }, [formData.entryPrice, formData.stopLoss, formData.takeProfit, formData.exitPrice, formData.type, formData.lotSize, formData.rr, formData.pips, formData.profit, formData.result]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (existingTrade) {
      onUpdate(existingTrade.id, formData);
    } else {
      onSave(formData);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">
          {existingTrade ? 'Edit Trade' : 'Record New Trade'}
        </h2>
        <button onClick={onCancel} className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400">
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Date & Time</label>
          <input
            type="datetime-local"
            value={formData.date}
            onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Pair</label>
            <input
              type="text"
              value={formData.pair}
              onChange={e => setFormData(prev => ({ ...prev, pair: e.target.value.toUpperCase() }))}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50"
              placeholder="e.g. XAUUSD"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Type</label>
            <select
              value={formData.type}
              onChange={e => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 appearance-none"
            >
              <option value="buy">Buy</option>
              <option value="sell">Sell</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Lot Size</label>
            <input
              type="number"
              step="0.01"
              value={formData.lotSize || ''}
              onChange={e => setFormData(prev => ({ ...prev, lotSize: parseFloat(e.target.value) || 0 }))}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50"
              placeholder="0.01"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Profit ($) (Auto)</label>
            <div className={`w-full border border-zinc-800 rounded-xl px-4 py-3 font-black flex items-center ${
              formData.profit > 0 ? 'text-emerald-400 bg-emerald-500/5' : 
              formData.profit < 0 ? 'text-red-500 bg-red-500/5' : 
              'text-white bg-zinc-950'
            }`}>
              {formData.profit >= 0 ? '+' : ''}${formData.profit.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Entry Price</label>
            <input
              type="number"
              step="0.00001"
              value={formData.entryPrice || ''}
              onChange={e => setFormData(prev => ({ ...prev, entryPrice: parseFloat(e.target.value) || 0 }))}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50"
              placeholder="0.00"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Exit Price</label>
            <input
              type="number"
              step="0.00001"
              value={formData.exitPrice || ''}
              onChange={e => setFormData(prev => ({ ...prev, exitPrice: parseFloat(e.target.value) || 0 }))}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50"
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">SL</label>
            <input
              type="number"
              step="0.00001"
              value={formData.stopLoss || ''}
              onChange={e => setFormData(prev => ({ ...prev, stopLoss: parseFloat(e.target.value) || 0 }))}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50"
              placeholder="0.00"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">TP</label>
            <input
              type="number"
              step="0.00001"
              value={formData.takeProfit || ''}
              onChange={e => setFormData(prev => ({ ...prev, takeProfit: parseFloat(e.target.value) || 0 }))}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50"
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Pips (Auto)</label>
            <div className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-emerald-400 font-mono flex items-center">
              {formData.pips > 0 ? '+' : ''}{formData.pips}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">RR Ratio (Auto)</label>
            <div className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-emerald-400 font-black flex items-center">
              1 : {formData.rr.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Notes</label>
          <textarea
            value={formData.notes}
            onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 min-h-[100px]"
            placeholder="Trade setup, emotions, mistakes..."
          />
        </div>

        <div className="flex gap-3 pt-4">
          {existingTrade && (
            <button
              type="button"
              onClick={() => onDelete(existingTrade.id)}
              className="flex-1 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl py-4 font-bold flex items-center justify-center gap-2 hover:bg-red-500/20 transition-all"
            >
              <Trash2 size={20} />
              Delete
            </button>
          )}
          <button
            type="submit"
            className="flex-[2] bg-red-600 text-white rounded-xl py-4 font-bold flex items-center justify-center gap-2 hover:bg-red-500 transition-all shadow-lg shadow-red-600/20"
          >
            <Save size={20} />
            {existingTrade ? 'Update Trade' : 'Save Trade'}
          </button>
        </div>
      </form>
    </div>
  );
  }
