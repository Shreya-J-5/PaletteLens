import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Colour } from '../types';
import { BarChart3 } from 'lucide-react';

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
    <div className="bg-[#16171B] border border-[#262830] rounded-2xl p-6 shadow-xl space-y-4 relative overflow-hidden">
      {/* Background glow accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#262830] pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#1E2026] border border-[#262830] text-[#8B5CF6] flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-[#8B5CF6]" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-sm tracking-tight flex items-center gap-1">
              COLOUR FREQUENCY <span className="font-cursive text-[#A78BFA] text-xl font-normal">Distribution</span>
            </h3>
            <p className="text-[11px] text-[#9CA3AF]">Calculated pixel weight across visual surface area</p>
          </div>
        </div>

        <span className="text-xs font-mono font-medium text-[#9CA3AF] bg-[#1E2026] border border-[#262830] px-2.5 py-1 rounded-lg">
          {colours.length} significant colours
        </span>
      </div>

      {/* Recharts Bar Chart */}
      <div className="h-48 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10, fontFamily: 'monospace', fill: '#9CA3AF' }}
              interval={0}
              stroke="#262830"
            />
            <YAxis
              tick={{ fontSize: 10, fill: '#9CA3AF' }}
              unit="%"
              stroke="#262830"
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-[#1E2026] text-white text-xs p-3 rounded-xl shadow-2xl border border-[#262830] font-mono space-y-1 z-50">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-md border border-white/20 shadow-sm"
                          style={{ backgroundColor: data.hex }}
                        />
                        <span className="font-bold text-sm">{data.name}</span>
                      </div>
                      <div className="text-emerald-400 font-semibold">Usage: {data.usage}%</div>
                      <div className="text-[10px] text-[#9CA3AF] font-sans">Role: {data.role}</div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="usage" radius={[6, 6, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.hex} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
