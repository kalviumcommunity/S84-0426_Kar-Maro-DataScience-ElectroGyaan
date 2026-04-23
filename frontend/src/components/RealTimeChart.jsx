import { useEffect, useState } from 'react';
import {
  Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Scatter, ComposedChart
} from 'recharts';
import { useTheme } from '../context/ThemeContext';

/**
 * RealTimeChart — theme-aware energy consumption chart.
 * Adapts grid, tick, tooltip, and area fill colors to dark/light mode.
 */
const RealTimeChart = ({ data, loading }) => {
  const { isDark } = useTheme();

  // Theme-aware chart colors
  const gridColor    = isDark ? 'rgba(55,65,81,0.35)'  : 'rgba(203,213,225,0.7)';
  const tickColor    = isDark ? '#6B7280'               : '#64748B';
  const tooltipBg    = isDark ? '#1A2235'               : '#FFFFFF';
  const tooltipBorder = isDark ? '#374151'              : '#CBD5E1';
  const tooltipText  = isDark ? '#D1D5DB'               : '#1E293B';
  const areaStroke   = '#10B981';
  const areaFillId   = 'colorUsage';
  const areaFillStart = isDark ? 'rgba(16,185,129,0.25)' : 'rgba(16,185,129,0.15)';
  const dotBorder    = isDark ? '#0A0F1E'               : '#FFFFFF';

  if (loading && (!data || data.length === 0)) {
    return (
      <div className="h-full w-full">
        <div className="mb-4 animate-pulse">
          <div className="h-5 bg-level-3 rounded w-1/3 mb-2"></div>
          <div className="h-3 bg-level-3 rounded w-1/2"></div>
        </div>
        <div className="h-72 w-full bg-level-3 rounded-lg animate-pulse"></div>
      </div>
    );
  }

  const chartData = data.map(d => ({
    time: new Date(d.timestamp).toLocaleTimeString('en-IN', {
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    }),
    units_kWh: d.units_kWh,
    anomaly_value: d.isAnomaly ? d.units_kWh : null,
    flatId: d.flatId,
    isAnomaly: d.isAnomaly
  }));

  return (
    <div className="h-full w-full">
      <div className="mb-4">
        <h3 className="text-[16px] font-semibold text-green-500">Energy Consumption Flow</h3>
        <p className="text-[13px] text-[var(--color-text-muted)] mt-[2px]">Live tracking updated every 5 seconds</p>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={areaFillId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={areaStroke} stopOpacity={isDark ? 0.25 : 0.15} />
                <stop offset="95%" stopColor={areaStroke} stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />

            <XAxis
              dataKey="time"
              stroke={tickColor}
              fontSize={11}
              tickMargin={10}
              minTickGap={30}
              tick={{ fill: tickColor, fontFamily: 'JetBrains Mono' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              stroke={tickColor}
              fontSize={11}
              tickFormatter={v => `${v} kWh`}
              tick={{ fill: tickColor, fontFamily: 'JetBrains Mono' }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: tooltipBg,
                borderColor: tooltipBorder,
                borderRadius: '8px',
                fontSize: '12px',
                boxShadow: isDark
                  ? '0 4px 16px rgba(0,0,0,0.4)'
                  : '0 4px 16px rgba(0,0,0,0.1)',
              }}
              labelStyle={{ color: tooltipText, fontWeight: 600, marginBottom: 4 }}
              itemStyle={{ color: areaStroke }}
              formatter={(value, name, props) => {
                if (name === 'units_kWh') {
                  return [
                    `${value.toFixed(3)} kWh`,
                    props.payload.isAnomaly ? '⚠️ Anomaly' : 'Normal'
                  ];
                }
                return value;
              }}
              labelFormatter={label => `Time: ${label}`}
            />

            <Area
              type="monotone"
              dataKey="units_kWh"
              name="Units (kWh)"
              stroke={areaStroke}
              strokeWidth={2.5}
              fillOpacity={1}
              fill={`url(#${areaFillId})`}
              activeDot={{ r: 6, fill: areaStroke, stroke: dotBorder, strokeWidth: 2 }}
            />

            <Scatter
              dataKey="anomaly_value"
              fill="#EF4444"
              shape={(props) => {
                const { cx, cy } = props;
                if (!cx || !cy) return null;
                return (
                  <g>
                    <circle cx={cx} cy={cy} r={10} fill="none" stroke="#EF4444" strokeWidth={1.5} opacity={0.3} />
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
