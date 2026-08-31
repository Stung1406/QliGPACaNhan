import React from 'react';
import { GradeLetter, OverallStats } from '../types';

interface GradeDistributionProps {
  stats: OverallStats;
}

export const GradeDistribution: React.FC<GradeDistributionProps> = ({ stats }) => {
  const dist = stats.gradeDistribution;
  const total = stats.totalSubjects || 1;

  const aPlusCount = dist['A+'] || 0;
  const aCount = dist['A'] || 0;
  const bPlusCount = dist['B+'] || 0;
  const bCount = dist['B'] || 0;
  const cCount = (dist['C+'] || 0) + (dist['C'] || 0);
  const dCount = (dist['D+'] || 0) + (dist['D'] || 0);
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

      {/* Main 4 Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {/* A+ */}
        <div className="bg-[#161B22] border border-[#5EEAD4]/30 rounded-2xl p-4 text-center group hover:border-[#5EEAD4] transition-all">
          <p className="text-3xl lg:text-4xl font-black text-[#5EEAD4] tracking-tight">{aPlusCount}</p>
          <div className="flex items-center justify-center gap-1.5 mt-1">
            <span className="text-xs font-bold font-mono text-white">Điểm A+</span>
            <span className="text-[10px] uppercase tracking-widest text-white/40">
              ({Math.round((aPlusCount / total) * 100)}%)
            </span>
          </div>
          <p className="text-[10px] text-white/50 mt-1 uppercase font-mono">Xuất sắc (4.0)</p>
        </div>

        {/* A */}
        <div className="bg-[#161B22] border border-white/10 rounded-2xl p-4 text-center group hover:border-white/30 transition-all">
          <p className="text-3xl lg:text-4xl font-black text-white tracking-tight">{aCount}</p>
          <div className="flex items-center justify-center gap-1.5 mt-1">
            <span className="text-xs font-bold font-mono text-white">Điểm A</span>
            <span className="text-[10px] uppercase tracking-widest text-white/40">
              ({Math.round((aCount / total) * 100)}%)
            </span>
          </div>
          <p className="text-[10px] text-white/50 mt-1 uppercase font-mono">Giỏi (3.8)</p>
        </div>

        {/* B+ & B */}
        <div className="bg-[#161B22] border border-white/10 rounded-2xl p-4 text-center group hover:border-white/30 transition-all">
          <p className="text-3xl lg:text-4xl font-black text-white tracking-tight">
            {bPlusCount + bCount}
          </p>
          <div className="flex items-center justify-center gap-1.5 mt-1">
            <span className="text-xs font-bold font-mono text-white">Điểm B / B+</span>
            <span className="text-[10px] uppercase tracking-widest text-white/40">
              ({Math.round(((bPlusCount + bCount) / total) * 100)}%)
            </span>
          </div>
          <p className="text-[10px] text-white/50 mt-1 uppercase font-mono">Khá (3.0 - 3.5)</p>
        </div>

        {/* Fails */}
        <div className={`bg-[#161B22] border rounded-2xl p-4 text-center transition-all ${
          failCount > 0 ? 'border-red-500/50 bg-red-950/10' : 'border-white/10'
        }`}>
          <p className={`text-3xl lg:text-4xl font-black tracking-tight ${failCount > 0 ? 'text-red-400' : 'text-white'}`}>
            {failCount}
          </p>
          <div className="flex items-center justify-center gap-1.5 mt-1">
            <span className={`text-xs font-bold font-mono ${failCount > 0 ? 'text-red-400' : 'text-white'}`}>
              Điểm F (Học lại)
            </span>
          </div>
          <p className="text-[10px] text-white/50 mt-1 uppercase font-mono">0.0 (Fails)</p>
        </div>
      </div>

      {/* Breakdown Bar */}
      <div className="w-full bg-[#161B22] h-3 rounded-full overflow-hidden flex border border-white/10 mb-4">
        <div
          style={{ width: `${(aPlusCount / total) * 100}%` }}
          className="bg-[#5EEAD4] h-full"
          title={`A+: ${aPlusCount} môn`}
        ></div>
        <div
          style={{ width: `${(aCount / total) * 100}%` }}
          className="bg-[#2DD4BF] h-full"
          title={`A: ${aCount} môn`}
        ></div>
        <div
          style={{ width: `${(bPlusCount / total) * 100}%` }}
          className="bg-[#38BDF8] h-full"
          title={`B+: ${bPlusCount} môn`}
        ></div>
        <div
          style={{ width: `${(bCount / total) * 100}%` }}
          className="bg-[#818CF8] h-full"
          title={`B: ${bCount} môn`}
        ></div>
        <div
          style={{ width: `${(cCount / total) * 100}%` }}
          className="bg-[#FBBF24] h-full"
          title={`C+/C: ${cCount} môn`}
        ></div>
        <div
          style={{ width: `${(dCount / total) * 100}%` }}
          className="bg-[#FB923C] h-full"
          title={`D+/D: ${dCount} môn`}
        ></div>
        <div
          style={{ width: `${(failCount / total) * 100}%` }}
          className="bg-[#F87171] h-full"
          title={`F: ${failCount} môn`}
        ></div>
      </div>

      {/* Detailed Pill badges */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-white/60">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#5EEAD4]"></span>
          <span>A+ ({dist['A+']})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#2DD4BF]"></span>
          <span>A ({dist['A']})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8]"></span>
          <span>B+ ({dist['B+']})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#818CF8]"></span>
          <span>B ({dist['B']})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FBBF24]"></span>
          <span>C+ ({dist['C+']})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]"></span>
          <span>C ({dist['C']})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FB923C]"></span>
          <span>D+/D ({(dist['D+'] || 0) + (dist['D'] || 0)})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F87171]"></span>
          <span className="text-red-300">F ({dist['F']})</span>
        </div>
      </div>
    </div>
  );
};
