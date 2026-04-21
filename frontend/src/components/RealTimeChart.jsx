import { useEffect, useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Scatter, ComposedChart
} from 'recharts';

const RealTimeChart = ({ data, loading }) => {
  if (loading && (!data || data.length === 0)) {
    return (
      <div className="h-full w-full">
        <div className="mb-4 animate-pulse">
          <div className="h-6 bg-gray-700 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2"></div>
        </div>
        <div className="h-72 w-full bg-gray-800 rounded animate-pulse"></div>
      </div>
    );
  }

  const chartData = data.map(d => ({
    time: new Date(d.timestamp).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }),
    units_kWh: d.units_kWh,
    anomaly_value: d.isAnomaly ? d.units_kWh : null,
    flatId: d.flatId,
    isAnomaly: d.isAnomaly
  }));

  return (
    <div className="h-full w-full">
      <div className="mb-4">
        <h3 className="text-lg font-medium text-emerald-400">Energy Consumption Flow</h3>
        <p className="text-sm text-neutral-400">Live tracking updated every 5 seconds</p>
      </div>
      
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
              formatter={(value, name, props) => {
                if (name === 'units_kWh') {
                  return [`${value.toFixed(3)} kWh`, props.payload.isAnomaly ? '⚠️ Anomaly' : 'Normal'];
                }
                return value;
              }}
              labelFormatter={(label) => `Time: ${label}`}
            />
            <Area 
              type="monotone" 
              dataKey="units_kWh" 
              name="Units (kWh)"
              stroke="#10b981" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorUsage)" 
              activeDot={{ r: 6, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
            />
            <Scatter 
              dataKey="anomaly_value" 
              fill="#EF4444" 
              shape={(props) => {
                const { cx, cy } = props;
                if (!cx || !cy) return null;
                return (
                  <g>
                    <circle cx={cx} cy={cy} r={9} fill="none" stroke="#EF4444" strokeWidth={2} opacity={0.35} className="animate-ping-custom" />
                    <circle cx={cx} cy={cy} r={5} fill="#EF4444" />
                  </g>
                );
              }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RealTimeChart;
