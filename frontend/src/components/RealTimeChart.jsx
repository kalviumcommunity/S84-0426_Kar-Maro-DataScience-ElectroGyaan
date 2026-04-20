import { useEffect, useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { format } from 'date-fns';
import { energyApi } from '../api/apiClient';

const RealTimeChart = ({ userId }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch initial data & setup polling for real-time
  useEffect(() => {
    if (!userId) return;

    const loadData = async () => {
      try {
        const response = await energyApi.getEnergyData(userId, 48); // Fetch last 48 hours for graph density
        if (response.success) {
          // Format data for Recharts
          const formatted = response.data.map(item => ({
            time: format(new Date(item.timestamp), 'HH:mm (MMM dd)'),
            timestamp: new Date(item.timestamp).getTime(),
            usage: item.units_kWh,
            isAnomaly: item.isAnomaly
          }));
          setData(formatted);
        }
      } catch (err) {
        console.error('Failed fetching graph data', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    
    // Poll every 10 seconds to align with our simulator
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
    
  }, [userId]);

  if (loading) {
     return <div className="text-neutral-400 mt-20">Loading real-time usage data...</div>;
  }

  // Custom coloring: if an area is anomalous, we can render dots red.
  // In a robust Recharts setup, multiple series might be used, but here we'll visually plot the standard curve.
  return (
    <div className="h-full w-full">
      <div className="mb-4">
        <h3 className="text-lg font-medium text-emerald-400">Energy Consumption Flow</h3>
        <p className="text-sm text-neutral-400">Live hourly tracking updated every 10 seconds</p>
      </div>
      
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#404040" vertical={false} />
            <XAxis 
              dataKey="time" 
              stroke="#a3a3a3" 
              fontSize={12} 
              tickMargin={10} 
              minTickGap={30}
            />
            <YAxis 
              stroke="#a3a3a3" 
              fontSize={12} 
              tickFormatter={(value) => `${value} kWh`}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#262626', borderColor: '#404040', borderRadius: '8px' }}
              itemStyle={{ color: '#10b981' }}
            />
            <Area 
              type="monotone" 
              dataKey="usage" 
              name="Units (kWh)"
              stroke="#10b981" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorUsage)" 
              activeDot={{ r: 6, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RealTimeChart;
