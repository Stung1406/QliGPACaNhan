import React from 'react';
import { GradeLetter, OverallStats } from '../types';

interface GradeDistributionProps {
  stats: OverallStats;
}

export const GradeDistribution: React.FC<GradeDistributionProps> = ({ stats }) => {
  const dist = stats.gradeDistribution;
  const total = stats.totalSubjects || 1;

  const aCount = dist['A'] || 0;
  const bCount = dist['B'] || 0;
  const cCount = dist['C'] || 0;
  const dCount = dist['D'] || 0;
  const failCount = dist['F'] || 0;

  return (
    <div className="bg-[#12161E] border border-white/10 rounded-3xl p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <span className="text-[#5EEAD4] text-xs font-bold tracking-[0.2em] uppercase">
            PHÂN BỐ ĐIỂM HỌC PHẦN
          </span>
          <h3 className="text-xl font-bold uppercase tracking-widest text-white mt-1">
            Tổng Quan Điểm Chữ ({stats.totalSubjects} Môn Học)
          </h3>
        </div>

        <span className="text-xs font-mono px-3 py-1 bg-[#161B22] border border-white/10 rounded-full text-white/70">
          Tỷ lệ qua môn: <strong className="text-[#5EEAD4]">{(100 - (failCount / total) * 100).toFixed(0)}%</strong>
        </span>
      </div>

      {/* Main Metric Cards: A, B, C, D, F */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {/* A */}
        <div className="bg-[#161B22] border border-[#5EEAD4]/30 rounded-2xl p-4 text-center group hover:border-[#5EEAD4] transition-all">
          <p className="text-3xl lg:text-4xl font-black text-[#5EEAD4] tracking-tight">{aCount}</p>
          <div className="flex items-center justify-center gap-1.5 mt-1">
            <span className="text-xs font-bold font-mono text-white">Điểm A</span>
            <span className="text-[10px] uppercase tracking-widest text-white/40">
              ({Math.round((aCount / total) * 100)}%)
            </span>
          </div>
          <p className="text-[10px] text-white/50 mt-1 uppercase font-mono">Giỏi (4.0)</p>
        </div>

        {/* B */}
        <div className="bg-[#161B22] border border-white/10 rounded-2xl p-4 text-center group hover:border-white/30 transition-all">
          <p className="text-3xl lg:text-4xl font-black text-blue-300 tracking-tight">{bCount}</p>
          <div className="flex items-center justify-center gap-1.5 mt-1">
            <span className="text-xs font-bold font-mono text-white">Điểm B</span>
            <span className="text-[10px] uppercase tracking-widest text-white/40">
              ({Math.round((bCount / total) * 100)}%)
            </span>
          </div>
          <p className="text-[10px] text-white/50 mt-1 uppercase font-mono">Khá (3.0)</p>
        </div>

        {/* C */}
        <div className="bg-[#161B22] border border-white/10 rounded-2xl p-4 text-center group hover:border-white/30 transition-all">
          <p className="text-3xl lg:text-4xl font-black text-amber-300 tracking-tight">
            {cCount}
          </p>
          <div className="flex items-center justify-center gap-1.5 mt-1">
            <span className="text-xs font-bold font-mono text-white">Điểm C</span>
            <span className="text-[10px] uppercase tracking-widest text-white/40">
              ({Math.round((cCount / total) * 100)}%)
            </span>
          </div>
          <p className="text-[10px] text-white/50 mt-1 uppercase font-mono">Trung bình (2.0)</p>
        </div>

        {/* D */}
        <div className="bg-[#161B22] border border-white/10 rounded-2xl p-4 text-center group hover:border-white/30 transition-all">
          <p className="text-3xl lg:text-4xl font-black text-orange-300 tracking-tight">
            {dCount}
          </p>
          <div className="flex items-center justify-center gap-1.5 mt-1">
            <span className="text-xs font-bold font-mono text-white">Điểm D</span>
            <span className="text-[10px] uppercase tracking-widest text-white/40">
              ({Math.round((dCount / total) * 100)}%)
            </span>
          </div>
          <p className="text-[10px] text-white/50 mt-1 uppercase font-mono">Yếu / Đạt (1.0)</p>
        </div>

        {/* F */}
        <div className={`bg-[#161B22] border rounded-2xl p-4 text-center transition-all ${
          failCount > 0 ? 'border-red-500/50 bg-red-950/10' : 'border-white/10'
        }`}>
          <p className={`text-3xl lg:text-4xl font-black tracking-tight ${failCount > 0 ? 'text-red-400' : 'text-white'}`}>
            {failCount}
          </p>
          <div className="flex items-center justify-center gap-1.5 mt-1">
            <span className={`text-xs font-bold font-mono ${failCount > 0 ? 'text-red-400' : 'text-white'}`}>
              Điểm F
            </span>
            <span className="text-[10px] uppercase tracking-widest text-white/40">
              ({Math.round((failCount / total) * 100)}%)
            </span>
          </div>
          <p className="text-[10px] text-white/50 mt-1 uppercase font-mono">Học lại (0.0)</p>
        </div>
      </div>

      {/* Breakdown Bar */}
      <div className="w-full bg-[#161B22] h-3 rounded-full overflow-hidden flex border border-white/10 mb-4">
        <div
          style={{ width: `${(aCount / total) * 100}%` }}
          className="bg-[#5EEAD4] h-full"
          title={`A (4.0): ${aCount} môn`}
        ></div>
        <div
          style={{ width: `${(bCount / total) * 100}%` }}
          className="bg-[#38BDF8] h-full"
          title={`B (3.0): ${bCount} môn`}
        ></div>
        <div
          style={{ width: `${(cCount / total) * 100}%` }}
          className="bg-[#FBBF24] h-full"
          title={`C (2.0): ${cCount} môn`}
        ></div>
        <div
          style={{ width: `${(dCount / total) * 100}%` }}
          className="bg-[#FB923C] h-full"
          title={`D (1.0): ${dCount} môn`}
        ></div>
        <div
          style={{ width: `${(failCount / total) * 100}%` }}
          className="bg-[#F87171] h-full"
          title={`F (0.0): ${failCount} môn`}
        ></div>
      </div>

      {/* Detailed Pill badges */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-white/60">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#5EEAD4]"></span>
          <span>A = 4.0 ({dist['A'] || 0})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8]"></span>
          <span>B = 3.0 ({dist['B'] || 0})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FBBF24]"></span>
          <span>C = 2.0 ({dist['C'] || 0})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FB923C]"></span>
          <span>D = 1.0 ({dist['D'] || 0})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F87171]"></span>
          <span className="text-red-300">F = 0.0 ({dist['F'] || 0})</span>
        </div>
      </div>
    </div>
  );
};
