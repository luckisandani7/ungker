import React, { useState, useEffect } from 'react';
import { CheckSquare, Square, Plus, Trash2, Edit2, X, Check, ChevronLeft } from 'lucide-react';

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

const STORAGE_KEY = 'sandanifx_checklist';

interface ChecklistToolProps {
  onBack?: () => void;
}

export default function ChecklistTool({ onBack }: ChecklistToolProps) {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [newItem, setNewItem] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load checklist', e);
      }
    } else {
      // Default items
      const defaults = [
        { id: '1', text: 'Market structure clear', completed: false },
        { id: '2', text: 'Entry at key level', completed: false },
        { id: '3', text: 'RR minimum 1:2', completed: false },
        { id: '4', text: 'News checked', completed: false },
        { id: '5', text: 'Emotional state stable', completed: false },
      ];
      setItems(defaults);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.trim()) return;
    const item: ChecklistItem = {
      id: crypto.randomUUID(),
      text: newItem.trim(),
      completed: false,
    };
    setItems([...items, item]);
    setNewItem('');
  };

  const toggleItem = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const startEditing = (item: ChecklistItem) => {
    setEditingId(item.id);
    setEditText(item.text);
  };

  const saveEdit = () => {
    if (!editText.trim()) return;
    setItems(items.map(item => 
      item.id === editingId ? { ...item, text: editText.trim() } : item
    ));
    setEditingId(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500">
            <CheckSquare size={24} />
          </div>
          <h2 className="text-xl font-bold text-zinc-100">Trade Plan Checklist</h2>
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

      <form onSubmit={addItem} className="flex gap-2">
        <input
          type="text"
          value={newItem}
          onChange={e => setNewItem(e.target.value)}
          placeholder="Add new rule..."
          className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
        />
        <button
          type="submit"
          className="p-3 bg-emerald-500 text-zinc-950 rounded-xl hover:bg-emerald-400 transition-colors"
        >
          <Plus size={20} />
        </button>
      </form>

      <div className="space-y-3">
        {items.map(item => (
          <div 
            key={item.id}
            className={`group flex items-center gap-3 p-4 rounded-2xl border transition-all ${
              item.completed 
                ? 'bg-zinc-900/30 border-zinc-800/50 opacity-60' 
                : 'bg-zinc-900 border-zinc-800'
            }`}
          >
            <button 
              onClick={() => toggleItem(item.id)}
              className={`shrink-0 transition-colors ${item.completed ? 'text-emerald-500' : 'text-zinc-600'}`}
            >
              {item.completed ? <CheckSquare size={20} /> : <Square size={20} />}
            </button>

            {editingId === item.id ? (
              <div className="flex-1 flex items-center gap-2">
                <input
                  type="text"
                  value={editText}
                  onChange={e => setEditText(e.target.value)}
                  autoFocus
                  className="flex-1 bg-zinc-950 border border-zinc-700 rounded-lg px-2 py-1 text-sm text-zinc-100 focus:outline-none"
                />
                <button onClick={saveEdit} className="text-emerald-500 p-1"><Check size={16} /></button>
                <button onClick={() => setEditingId(null)} className="text-zinc-500 p-1"><X size={16} /></button>
              </div>
            ) : (
              <span className={`flex-1 text-sm font-medium ${item.completed ? 'line-through text-zinc-600' : 'text-zinc-200'}`}>
                {item.text}
              </span>
            )}

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => startEditing(item)}
                className="p-1.5 text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                <Edit2 size={14} />
              </button>
              <button 
                onClick={() => deleteItem(item.id)}
                className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="text-center py-12 text-zinc-600 text-sm italic">
            Your checklist is empty. Add some rules to stay disciplined!
          </div>
        )}
      </div>
    </div>
  );
}
