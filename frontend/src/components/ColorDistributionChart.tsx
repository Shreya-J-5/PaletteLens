import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Colour } from '../types';

interface ColorDistributionChartProps {
  colours: Colour[];
}

export const ColorDistributionChart: React.FC<ColorDistributionChartProps> = ({ colours }) => {
  const chartData = colours.map((c) => ({
    name: c.hex.toUpperCase(),
    usage: c.usage_percentage,
    role: c.colour_role || 'Unspecified',
    hex: c.hex,
  }));

  if (colours.length === 0) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-900 text-sm">Colour Frequency Distribution</h3>
        <span className="text-xs text-slate-500">{colours.length} significant colours</span>
      </div>

      {/* Recharts Bar Chart */}
      <div className="h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis dataKey="name" tick={{ fontSize: 10, fontFamily: 'monospace' }} interval={0} />
            <YAxis tick={{ fontSize: 10 }} unit="%" />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-slate-900 text-white text-xs p-2.5 rounded-lg shadow-lg border border-slate-700 font-mono">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: data.hex }} />
                        <span className="font-bold">{data.name}</span>
                      </div>
                      <div>Usage: {data.usage}%</div>
                      <div className="text-[10px] text-slate-400 font-sans">Role: {data.role}</div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="usage" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.hex} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
