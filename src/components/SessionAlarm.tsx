import { useState, useEffect } from 'react';
import { Bell, BellRing, Clock, ChevronLeft, Info, AlertTriangle } from 'lucide-react';

interface Session {
  id: string;
  name: string;
  startUTC: string; // HH:mm
  endUTC: string;
  color: string;
}

const SESSIONS: Session[] = [
  { id: 'asia', name: 'Asia Session', startUTC: '00:00', endUTC: '09:00', color: 'text-emerald-400' },
  { id: 'london', name: 'London Session', startUTC: '07:00', endUTC: '16:00', color: 'text-blue-400' },
  { id: 'newyork', name: 'New York Session', startUTC: '12:00', endUTC: '21:00', color: 'text-orange-400' },
];

interface SessionAlarmProps {
  onBack?: () => void;
}

export default function SessionAlarm({ onBack }: SessionAlarmProps) {
  const [enabledSessions, setEnabledSessions] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('session_alarms');
    return saved ? JSON.parse(saved) : { asia: false, london: false, newyork: false };
  });

  const [preAlert, setPreAlert] = useState<boolean>(() => {
    return localStorage.getItem('session_pre_alert') === 'true';
  });

  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('session_alarms', JSON.stringify(enabledSessions));
  }, [enabledSessions]);

  useEffect(() => {
    localStorage.setItem('session_pre_alert', preAlert.toString());
  }, [preAlert]);

  const requestPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
    }
  };

  const toggleSession = (id: string) => {
    setEnabledSessions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const formatToLocal = (utcTime: string) => {
    const [hours, minutes] = utcTime.split(':').map(Number);
    const date = new Date();
    date.setUTCHours(hours, minutes, 0, 0);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  // Notification Logic
  useEffect(() => {
    if (notificationPermission !== 'granted') return;

    const checkSessions = () => {
      const now = new Date();
      const currentUTC = `${now.getUTCHours().toString().padStart(2, '0')}:${now.getUTCMinutes().toString().padStart(2, '0')}`;
      
      // Check 15 mins before
      const fifteenMinsLater = new Date(now.getTime() + 15 * 60000);
      const preUTC = `${fifteenMinsLater.getUTCHours().toString().padStart(2, '0')}:${fifteenMinsLater.getUTCMinutes().toString().padStart(2, '0')}`;

      SESSIONS.forEach(session => {
        if (!enabledSessions[session.id]) return;

        // Exact start
        if (currentUTC === session.startUTC && now.getUTCSeconds() === 0) {
          new Notification(`${session.name} Open`, {
            body: 'Prepare your setup and check the charts.',
            icon: '/favicon.ico'
          });
        }

        // Pre-alert
        if (preAlert && preUTC === session.startUTC && now.getUTCSeconds() === 0) {
          new Notification(`${session.name} Starting Soon`, {
            body: 'Session starts in 15 minutes.',
            icon: '/favicon.ico'
          });
        }
      });
    };

    const interval = setInterval(checkSessions, 1000);
    return () => clearInterval(interval);
  }, [enabledSessions, preAlert, notificationPermission]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-500">
            <BellRing size={24} />
          </div>
          <h2 className="text-xl font-bold text-zinc-100">Session Alarm</h2>
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

      {notificationPermission !== 'granted' && (
        <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl flex items-start gap-3">
          <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={18} />
          <div className="space-y-2">
            <p className="text-xs text-amber-200 font-medium">
              Notifications are currently disabled. Enable them to receive session alerts.
            </p>
            <button 
              onClick={requestPermission}
              className="text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-amber-950 px-3 py-1.5 rounded-lg hover:bg-amber-400 transition-colors"
            >
              Enable Notifications
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Active Sessions</h3>
          <button 
            onClick={() => setPreAlert(!preAlert)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${
              preAlert 
                ? 'bg-purple-500/10 border-purple-500/30 text-purple-400' 
                : 'bg-zinc-900 border-zinc-800 text-zinc-500'
            }`}
          >
            <Clock size={14} />
            <span className="text-[10px] font-bold uppercase tracking-wider">15m Pre-Alert</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {SESSIONS.map((session) => (
            <div 
              key={session.id}
              className={`p-5 rounded-[2rem] border transition-all flex items-center justify-between ${
                enabledSessions[session.id] 
                  ? 'bg-zinc-900 border-zinc-700 shadow-lg' 
                  : 'bg-zinc-900/30 border-zinc-800/50 opacity-60'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl bg-zinc-950 border border-zinc-800 ${session.color}`}>
                  <Clock size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-zinc-100">{session.name}</h4>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 uppercase tracking-tight">
                    <span>{formatToLocal(session.startUTC)}</span>
                    <span>—</span>
                    <span>{formatToLocal(session.endUTC)}</span>
                    <span className="ml-1 text-zinc-700 italic">(Local)</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => toggleSession(session.id)}
                className={`w-12 h-6 rounded-full relative transition-colors ${
                  enabledSessions[session.id] ? 'bg-emerald-500' : 'bg-zinc-800'
                }`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                  enabledSessions[session.id] ? 'left-7' : 'left-1'
                }`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800/50 flex items-start gap-3">
        <Info size={18} className="text-zinc-500 mt-0.5 shrink-0" />
        <div className="space-y-1">
          <p className="text-xs text-zinc-500 leading-relaxed">
            Times are automatically converted from UTC+0 to your local time zone.
          </p>
          <p className="text-[10px] text-zinc-600 italic">
            Note: Browser must remain open to trigger notifications.
          </p>
        </div>
      </div>
    </div>
  );
}
