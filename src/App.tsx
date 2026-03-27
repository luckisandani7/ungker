import { useState, useMemo } from 'react';
import Layout from './components/Layout';
import CalendarDashboard from './components/CalendarDashboard';
import TradeForm from './components/TradeForm';
import StatsDashboard from './components/StatsDashboard';
import RRCalculator from './components/RRCalculator';
import MoneyManagementCalculator from './components/MoneyManagementCalculator';
import SessionAlarm from './components/SessionAlarm';
import AboutPage from './components/AboutPage';
import ChecklistTool from './components/ChecklistTool';
import MonthlyOutlook from './components/MonthlyOutlook';
import AIJournalMentor from './components/AIJournalMentor';
import ToolsDashboard from './components/ToolsDashboard';
import { useTrades } from './hooks/useTrades';
import { PrivacyProvider } from './contexts/PrivacyContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Login } from './components/Login';
import { Trade } from './types';
import { exportToCSV, calculateMonthlyStats } from './utils';
import { isSameDay, parseISO } from 'date-fns';

function AppContent() {
  const [activeTab, setActiveTab] = useState('calendar');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const { user, isGuest, loading } = useAuth();
  const { trades, allTrades, allTradesList, addTrade, updateTrade, deleteTrade, isLoaded } = useTrades(currentMonth);

  const stats = useMemo(() => calculateMonthlyStats(allTradesList, currentMonth), [allTradesList, currentMonth]);

  const handleDateSelect = (date: Date) => {
    setEditingTrade(null);
    setSelectedDate(date);
    setActiveTab('add');
  };

  const handleTradeSelect = (trade: Trade) => {
    setEditingTrade(trade);
    setActiveTab('add');
  };

  const handleSave = (trade: Omit<Trade, 'id'>) => {
    addTrade(trade);
    setActiveTab('calendar');
    setEditingTrade(null);
    setSelectedDate(null);
  };

  const handleUpdate = (id: string, trade: Partial<Trade>) => {
    updateTrade(id, trade);
    setActiveTab('calendar');
    setEditingTrade(null);
    setSelectedDate(null);
  };

  const handleDelete = (id: string) => {
    deleteTrade(id);
    setActiveTab('calendar');
    setEditingTrade(null);
    setSelectedDate(null);
  };

  const handleCancel = () => {
    setActiveTab('calendar');
    setEditingTrade(null);
    setSelectedDate(null);
  };

  if (loading || !isLoaded) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user && !isGuest) {
    return <Login />;
  }

  return (
    <PrivacyProvider>
      <Layout 
        activeTab={activeTab} 
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab !== 'add') {
            setEditingTrade(null);
            setSelectedDate(null);
          }
        }}
        onExport={() => exportToCSV(trades)}
      >
        {activeTab === 'calendar' && (
          <CalendarDashboard 
            trades={trades} 
            currentMonth={currentMonth}
            onMonthChange={setCurrentMonth}
            onDateSelect={handleDateSelect} 
            onTradeSelect={handleTradeSelect}
          />
        )}
        
        {activeTab === 'add' && (
          <TradeForm 
            initialDate={selectedDate || undefined}
            existingTrade={editingTrade || undefined}
            onSave={handleSave}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            onCancel={handleCancel}
          />
        )}
        
        {activeTab === 'stats' && (
          <StatsDashboard trades={trades} currentMonth={currentMonth} />
        )}

        {activeTab === 'other' && (
          <ToolsDashboard onSelect={setActiveTab} />
        )}
        
        {activeTab === 'ai-mentor' && (
          <AIJournalMentor 
            trades={allTradesList} 
            stats={stats} 
            onBack={() => setActiveTab('other')} 
          />
        )}
        
        {activeTab === 'calculator' && (
          <RRCalculator onBack={() => setActiveTab('other')} />
        )}

        {activeTab === 'money-management' && (
          <MoneyManagementCalculator onBack={() => setActiveTab('other')} />
        )}

        {activeTab === 'session-alarm' && (
          <SessionAlarm onBack={() => setActiveTab('other')} />
        )}

        {activeTab === 'about' && (
          <AboutPage onBack={() => setActiveTab('other')} />
        )}

        {activeTab === 'checklist' && (
          <ChecklistTool onBack={() => setActiveTab('other')} />
        )}

        {activeTab === 'outlook' && (
          <MonthlyOutlook allTrades={allTrades} onBack={() => setActiveTab('other')} />
        )}
      </Layout>
    </PrivacyProvider>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
}
