import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  AreaChart,
  Area,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { BarChart3, LineChart, TrendingUp, Info, Scale } from 'lucide-react';
import { SemesterStats, StudentProfile } from '../types';

interface SemesterChartProps {
  semesterStats: SemesterStats[];
  profile: StudentProfile;
  onSelectSemester?: (semId: string) => void;
}

export const SemesterChart: React.FC<SemesterChartProps> = ({
  semesterStats,
  profile,
  onSelectSemester,
}) => {
  const [chartMode, setChartMode] = useState<'brutalist' | 'analytics' | 'trend'>('analytics');
  const [scaleMode, setScaleMode] = useState<'scale4' | 'scale10'>('scale4');

  const targetCpa = scaleMode === 'scale4' ? (profile.targetCpa || 3.6) : (profile.targetCpa ? profile.targetCpa * 2.5 : 8.5);

  // Format data for Recharts
  const chartData = semesterStats.map((item) => ({
    name: item.shortName,
    fullName: item.semesterName,
    gpa4: item.gpa4,
    cpa4: item.cumulativeGpa4,
    gpa10: item.gpa10,
    cpa10: item.cumulativeGpa10,
    credits: item.totalCredits,
    passedCredits: item.passedCredits,
    id: item.semesterId,
    activeScore: scaleMode === 'scale4' ? item.gpa4 : item.gpa10,
    activeCumulative: scaleMode === 'scale4' ? item.cumulativeGpa4 : item.cumulativeGpa10,
  }));

  const maxDomain = scaleMode === 'scale4' ? 4.0 : 10.0;
  const yTicks = scaleMode === 'scale4' ? [0, 1.0, 2.0, 2.5, 3.0, 3.5, 4.0] : [0, 2.0, 4.0, 5.0, 6.5, 8.0, 10.0];

  return (
    <section className="bg-[#12161E] border border-white/10 rounded-3xl p-6 lg:p-8 flex flex-col justify-between">
      {/* Chart Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[#5EEAD4] text-xs font-bold tracking-[0.2em] uppercase">
              BIỂU ĐỒ TIẾN ĐỘ 4 NĂM
            </span>
          </div>
          <h3 className="text-xl font-bold uppercase tracking-widest text-white mt-1">
            Biểu Đồ GPA Theo Học Kỳ
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Scale Mode Switcher */}
          <button
            onClick={() => setScaleMode((prev) => (prev === 'scale4' ? 'scale10' : 'scale4'))}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#161B22] border border-white/10 hover:border-[#5EEAD4]/60 text-xs font-mono text-white transition-all"
            title="Chuyển đổi giữa Thang 4.0 và Thang 10.0"
          >
            <Scale className="w-3.5 h-3.5 text-[#5EEAD4]" />
            <span className="font-bold text-[#5EEAD4]">{scaleMode === 'scale4' ? 'Hệ 4 (4.0)' : 'Hệ 10 (10.0)'}</span>
          </button>

          {/* Legend */}
          <div className="hidden md:flex items-center gap-3 text-[11px] uppercase tracking-wider font-mono">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-[#5EEAD4] rounded-xs"></div>
              <span className="text-white/70">GPA HK</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-white/30 border border-white/60 rounded-xs"></div>
              <span className="text-white/70">CPA Tích lũy</span>
            </div>
          </div>

          {/* Toggle view mode */}
          <div className="flex items-center bg-[#161B22] p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setChartMode('analytics')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                chartMode === 'analytics'
                  ? 'bg-white text-black'
                  : 'text-white/60 hover:text-white'
              }`}
              title="Biểu đồ Recharts kết hợp Cột & Đường"
            >
              <LineChart className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setChartMode('trend')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                chartMode === 'trend'
                  ? 'bg-white text-black'
                  : 'text-white/60 hover:text-white'
              }`}
              title="Biểu đồ Recharts Vùng xu hướng"
            >
              <TrendingUp className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setChartMode('brutalist')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                chartMode === 'brutalist'
                  ? 'bg-white text-black'
                  : 'text-white/60 hover:text-white'
              }`}
              title="Xem giao diện Cột Bold"
            >
              <BarChart3 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Chart Canvas */}
      {chartMode === 'brutalist' ? (
        <div className="h-[280px] w-full flex flex-col justify-end relative pt-6 pb-2">
          {/* Horizontal Grid lines */}
          <div className="absolute inset-x-0 top-6 bottom-10 flex flex-col justify-between pointer-events-none">
            <div className="border-t border-white/10 w-full flex justify-between items-center text-[10px] text-white/30 font-mono">
              <span>{scaleMode === 'scale4' ? '4.0 (Max)' : '10.0 (Max)'}</span>
              <span className="border-t border-dashed border-[#5EEAD4]/40 w-1/3"></span>
            </div>
            <div className="border-t border-white/5 w-full flex justify-between items-center text-[10px] text-white/30 font-mono">
              <span>{scaleMode === 'scale4' ? '3.5' : '8.5'}</span>
            </div>
            <div className="border-t border-white/5 w-full flex justify-between items-center text-[10px] text-white/30 font-mono">
              <span>{scaleMode === 'scale4' ? '3.0' : '7.0'}</span>
            </div>
            <div className="border-t border-white/5 w-full flex justify-between items-center text-[10px] text-white/30 font-mono">
              <span>{scaleMode === 'scale4' ? '2.5' : '5.5'}</span>
            </div>
            <div className="border-t border-white/10 w-full flex justify-between items-center text-[10px] text-white/30 font-mono">
              <span>{scaleMode === 'scale4' ? '2.0 (TB)' : '5.0 (TB)'}</span>
            </div>
          </div>

          {/* Bar Columns Container */}
          <div className="grid grid-cols-8 items-end gap-2 sm:gap-3 h-full z-10">
            {semesterStats.map((sem, index) => {
              const val = scaleMode === 'scale4' ? sem.gpa4 : sem.gpa10;
              const max = scaleMode === 'scale4' ? 4.0 : 10.0;
              const heightPercent = Math.min(100, Math.max(10, Math.round((val / max) * 100)));
              const isFuture = sem.totalCredits === 0;

              return (
                <div
                  key={sem.semesterId}
                  onClick={() => onSelectSemester && onSelectSemester(sem.semesterId)}
                  className="relative flex flex-col items-center h-full justify-end group cursor-pointer"
                >
                  {/* Tooltip on Hover */}
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#0A0B0E] border border-[#5EEAD4] text-white text-[11px] px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-30 whitespace-nowrap shadow-xl">
                    <span className="font-bold text-[#5EEAD4]">
                      GPA: {scaleMode === 'scale4' ? sem.gpa4.toFixed(2) : sem.gpa10.toFixed(1)}
                    </span>
                    <span className="text-white/60 ml-1.5">
                      | CPA: {scaleMode === 'scale4' ? sem.cumulativeGpa4.toFixed(2) : sem.cumulativeGpa10.toFixed(1)}
                    </span>
                    <div className="text-[9px] text-white/50">{sem.totalCredits} Tín chỉ</div>
                  </div>

                  {/* The Bar */}
                  <div
                    className={`w-full transition-all duration-300 rounded-t-sm relative ${
                      isFuture
                        ? 'bg-white/5 border-2 border-dashed border-white/20'
                        : index % 2 === 0
                        ? 'bg-[#5EEAD4]/30 border-t-2 border-[#5EEAD4] group-hover:bg-[#5EEAD4]/60'
                        : 'bg-[#5EEAD4]/60 border-t-2 border-white group-hover:bg-[#5EEAD4]/90'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  >
                    {!isFuture && (
                      <div className="absolute top-1 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white font-mono opacity-80 group-hover:opacity-100">
                        {val.toFixed(1)}
                      </div>
                    )}
                  </div>

                  {/* Label */}
                  <p className="text-[10px] sm:text-[11px] font-mono font-bold mt-3 rotate-45 sm:rotate-0 origin-left sm:origin-center whitespace-nowrap text-white/60 group-hover:text-[#5EEAD4] uppercase transition-colors">
                    {sem.shortName}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      ) : chartMode === 'trend' ? (
        <div className="h-[280px] w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 15, right: 15, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5EEAD4" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#5EEAD4" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="#ffffff50"
                tick={{ fill: '#ffffff80', fontSize: 11, fontFamily: 'monospace' }}
              />
              <YAxis
                domain={[0, maxDomain]}
                ticks={yTicks}
                stroke="#ffffff50"
                tick={{ fill: '#ffffff80', fontSize: 11, fontFamily: 'monospace' }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-[#0A0B0E] border border-white/20 p-3 rounded-xl shadow-2xl text-xs font-mono">
                        <p className="font-bold text-white mb-1.5">{data.fullName}</p>
                        <p className="text-[#5EEAD4]">
                          GPA HK: <strong>{scaleMode === 'scale4' ? Number(data.gpa4).toFixed(2) : Number(data.gpa10).toFixed(1)}</strong>
                        </p>
                        <p className="text-white/80">
                          CPA Tích Lũy: <strong>{scaleMode === 'scale4' ? Number(data.cpa4).toFixed(2) : Number(data.cpa10).toFixed(1)}</strong>
                        </p>
                        <p className="text-white/50 text-[10px] mt-1">
                          Số tín chỉ: {data.passedCredits}/{data.credits} TC
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <ReferenceLine
                y={targetCpa}
                stroke="#5EEAD4"
                strokeDasharray="4 4"
                label={{
                  value: `Mục tiêu ${targetCpa.toFixed(scaleMode === 'scale4' ? 2 : 1)}`,
                  fill: '#5EEAD4',
                  fontSize: 10,
                  position: 'insideTopRight',
                }}
              />
              <Area
                type="monotone"
                dataKey="activeCumulative"
                stroke="#5EEAD4"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#areaGradient)"
              />
              <Line
                type="monotone"
                dataKey="activeScore"
                stroke="#FFFFFF"
                strokeWidth={2}
                dot={{ r: 4, fill: '#5EEAD4' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-[280px] w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 15, right: 15, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="#ffffff50"
                tick={{ fill: '#ffffff80', fontSize: 11, fontFamily: 'monospace' }}
              />
              <YAxis
                domain={[0, maxDomain]}
                ticks={yTicks}
                stroke="#ffffff50"
                tick={{ fill: '#ffffff80', fontSize: 11, fontFamily: 'monospace' }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-[#0A0B0E] border border-white/20 p-3 rounded-xl shadow-2xl text-xs font-mono">
                        <p className="font-bold text-white mb-1.5">{data.fullName}</p>
                        <p className="text-[#5EEAD4]">
                          GPA Học kỳ: <strong>{scaleMode === 'scale4' ? Number(data.gpa4).toFixed(2) : Number(data.gpa10).toFixed(1)}</strong> / {maxDomain.toFixed(1)}
                        </p>
                        <p className="text-white/80">
                          CPA Tích lũy: <strong>{scaleMode === 'scale4' ? Number(data.cpa4).toFixed(2) : Number(data.cpa10).toFixed(1)}</strong> / {maxDomain.toFixed(1)}
                        </p>
                        <p className="text-white/50 text-[10px] mt-1">
                          Số tín chỉ: {data.passedCredits}/{data.credits} TC
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <ReferenceLine
                y={targetCpa}
                stroke="#5EEAD4"
                strokeDasharray="4 4"
                label={{
                  value: `Mục tiêu ${targetCpa.toFixed(scaleMode === 'scale4' ? 2 : 1)}`,
                  fill: '#5EEAD4',
                  fontSize: 10,
                  position: 'insideTopRight',
                }}
              />
              <Bar dataKey="activeScore" fill="#5EEAD4" radius={[4, 4, 0, 0]} barSize={26} opacity={0.85} />
              <Line
                type="monotone"
                dataKey="activeCumulative"
                stroke="#FFFFFF"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#FFFFFF' }}
                activeDot={{ r: 6, fill: '#5EEAD4' }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Footer Info Box */}
      <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-white/50">
        <div className="flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-[#5EEAD4]" />
          <span>Biểu đồ Recharts tự động vẽ lại khi môn học hoặc điểm số thay đổi và đồng bộ với Firebase</span>
        </div>
        <div className="font-mono text-[11px] text-[#5EEAD4]">
          Quy đổi: A+ (4.0), A (3.8), B+ (3.5), B (3.0), C+ (2.5), C (2.0), D+ (1.5), D (1.0), F (0)
        </div>
      </div>
    </section>
  );
};

