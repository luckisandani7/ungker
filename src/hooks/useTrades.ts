import { useState, useEffect, useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { Trade } from '../types';
import { db, collection, query, onSnapshot, doc, setDoc, deleteDoc, updateDoc, getDocs, writeBatch } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

const STORAGE_KEY = 'sandanifx_journal_data';
const MIGRATION_KEY = 'sandanifx_migration_complete';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null, userId: string | undefined) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path,
    userId
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export function useTrades(currentMonth: Date) {
  const { user, isGuest } = useAuth();
  const [allTradesList, setAllTradesList] = useState<Trade[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const monthKey = format(currentMonth, 'yyyy-MM');

  // Migration logic (only for logged in users)
  useEffect(() => {
    if (!user || localStorage.getItem(MIGRATION_KEY)) return;

    const migrateData = async () => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        localStorage.setItem(MIGRATION_KEY, 'true');
        return;
      }

      try {
        const localJournal: Record<string, Trade[]> = JSON.parse(saved);
        const batch = writeBatch(db);
        let count = 0;

        Object.values(localJournal).flat().forEach(trade => {
          const tradeRef = doc(db, 'users', user.uid, 'trades', trade.id);
          batch.set(tradeRef, { ...trade, userId: user.uid });
          count++;
        });

        if (count > 0) {
          await batch.commit();
          // Clear guest data after successful migration
          localStorage.removeItem(STORAGE_KEY);
        }
        localStorage.setItem(MIGRATION_KEY, 'true');
        console.log(`Migrated ${count} trades to Firestore`);
      } catch (e) {
        console.error('Migration failed', e);
      }
    };

    migrateData();
  }, [user]);

  // Data listener/loader
  useEffect(() => {
    if (user) {
      const tradesPath = `users/${user.uid}/trades`;
      const q = query(collection(db, tradesPath));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const tradesData: Trade[] = [];
        snapshot.forEach((doc) => {
          tradesData.push(doc.data() as Trade);
        });
        setAllTradesList(tradesData);
        setIsLoaded(true);
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, tradesPath, user.uid);
      });

      return () => unsubscribe();
    } else if (isGuest) {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const localJournal: Record<string, Trade[]> = JSON.parse(saved);
          setAllTradesList(Object.values(localJournal).flat());
        } catch (e) {
          console.error('Failed to parse local journal data', e);
        }
      }
      setIsLoaded(true);
    } else {
      setAllTradesList([]);
      setIsLoaded(true);
    }
  }, [user, isGuest]);

  // Save to localStorage for guest users
  useEffect(() => {
    if (isGuest && isLoaded) {
      const grouped: Record<string, Trade[]> = {};
      allTradesList.forEach(trade => {
        const tradeMonthKey = format(parseISO(trade.date), 'yyyy-MM');
        if (!grouped[tradeMonthKey]) grouped[tradeMonthKey] = [];
        grouped[tradeMonthKey].push(trade);
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(grouped));
    }
  }, [allTradesList, isGuest, isLoaded]);

  const journal = useMemo(() => {
    const grouped: Record<string, Trade[]> = {};
    allTradesList.forEach(trade => {
      const tradeMonthKey = format(parseISO(trade.date), 'yyyy-MM');
      if (!grouped[tradeMonthKey]) grouped[tradeMonthKey] = [];
      grouped[tradeMonthKey].push(trade);
    });
    return grouped;
  }, [allTradesList]);

  const trades = useMemo(() => {
    return journal[monthKey] || [];
  }, [journal, monthKey]);

  const addTrade = async (trade: Omit<Trade, 'id'>) => {
    const id = crypto.randomUUID();
    if (user) {
      const tradePath = `users/${user.uid}/trades/${id}`;
      try {
        const tradeRef = doc(db, 'users', user.uid, 'trades', id);
        await setDoc(tradeRef, { ...trade, id, userId: user.uid });
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, tradePath, user.uid);
      }
    } else if (isGuest) {
      const newTrade = { ...trade, id } as Trade;
      setAllTradesList(prev => [...prev, newTrade]);
    }
  };

  const updateTrade = async (id: string, updatedTrade: Partial<Trade>) => {
    if (user) {
      const tradePath = `users/${user.uid}/trades/${id}`;
      try {
        const tradeRef = doc(db, 'users', user.uid, 'trades', id);
        await updateDoc(tradeRef, updatedTrade);
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, tradePath, user.uid);
      }
    } else if (isGuest) {
      setAllTradesList(prev => prev.map(t => t.id === id ? { ...t, ...updatedTrade } : t));
    }
  };

  const deleteTrade = async (id: string) => {
    if (user) {
      const tradePath = `users/${user.uid}/trades/${id}`;
      try {
        const tradeRef = doc(db, 'users', user.uid, 'trades', id);
        await deleteDoc(tradeRef);
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, tradePath, user.uid);
      }
    } else if (isGuest) {
      setAllTradesList(prev => prev.filter(t => t.id !== id));
    }
  };

  return { trades, allTrades: journal, allTradesList, addTrade, updateTrade, deleteTrade, isLoaded };
}
