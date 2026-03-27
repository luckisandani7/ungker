import { useMemo } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Trade } from '../types';
import { parseISO, format } from 'date-fns';

interface EquityCurveProps {
  trades: Trade[];
}

export default function EquityCurve({ trades }: EquityCurveProps) {
  const data = useMemo(() => {
    const sorted = [...trades].sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime());
    
    let cumulative = 0;
    return sorted.map((t, index) => {
      cumulative += t.profit;
      return {
        name: index + 1,
        equity: cumulative,
        date: format(parseISO(t.date), 'MMM d')
      };
    });
  }, [trades]);

  if (data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-zinc-600 text-sm font-medium">
        No trades recorded yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%" style={{ outline: 'none' }}>
      <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }} style={{ outline: 'none' }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
        <XAxis 
          dataKey="name" 
          stroke="#52525b" 
          fontSize={10} 
          tickLine={false} 
          axisLine={false}
        />
        <YAxis 
          stroke="#52525b" 
          fontSize={10} 
          tickLine={false} 
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip
          contentStyle={{ 
            backgroundColor: '#18181b', 
            border: '1px solid #27272a', 
            borderRadius: '12px',
            fontSize: '12px'
          }}
          itemStyle={{ color: '#10b981' }}
          labelStyle={{ color: '#71717a', marginBottom: '4px' }}
          formatter={(value: number) => [`$${value.toFixed(2)}`, 'Equity']}
          labelFormatter={(label) => `Trade #${label}`}
        />
        <Line 
          type="monotone" 
          dataKey="equity" 
          stroke="#10b981" 
          strokeWidth={3} 
          dot={false}
          activeDot={{ r: 6, fill: '#10b981', stroke: '#09090b', strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
