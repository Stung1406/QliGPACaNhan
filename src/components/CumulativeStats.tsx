import React from 'react';
import { Award, BookOpen, TrendingUp, Sparkles, Plus, Download, Target, RefreshCw } from 'lucide-react';
import { OverallStats, StudentProfile } from '../types';

interface CumulativeStatsProps {
  stats: OverallStats;
  profile: StudentProfile;
  onOpenAddSemester: () => void;
  onOpenExport: () => void;
  onOpenTarget: () => void;
  onResetSampleData: () => void;
}

export const CumulativeStats: React.FC<CumulativeStatsProps> = ({
  stats,
  profile,
  onOpenAddSemester,
  onOpenExport,
  onOpenTarget,
  onResetSampleData,
}) => {
  const creditProgress = Math.min(
    100,
    Math.round((stats.totalPassedCredits / (profile.totalProgramCredits || 140)) * 100)
  );

  return (
    <section className="flex flex-col justify-between h-full bg-[#12161E] border border-white/10 rounded-3xl p-6 lg:p-8">
      <div>
        {/* Main Huge CPA Display */}
        <div className="mb-8">
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-mono font-bold tracking-widest text-[#5EEAD4] uppercase">
              GPA TÍCH LŨY (CPA HỆ 4)
            </span>
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-[#161B22] border border-white/10 text-white/70">
              Hệ 10: <strong className="text-white font-bold">{stats.cpa10.toFixed(2)}</strong> / 10
            </span>
          </div>

          <div className="flex items-baseline gap-2 mt-1">
            <h2 className="text-[85px] sm:text-[100px] lg:text-[115px] font-black leading-none text-[#5EEAD4] tracking-tighter">
              {stats.cpa4.toFixed(2)}
            </h2>
            <span className="text-2xl sm:text-3xl font-bold text-white/30 font-mono">/ 4.0</span>
          </div>

          <p className="text-sm font-bold uppercase tracking-[0.2em] -mt-1 text-white/80 flex items-center gap-2">
            <span>{profile.academicStandingNote || 'CUMULATIVE GPA'}</span>
          </p>
        </div>

        {/* 3 Metric Rows with Left Border Accent */}
        <div className="space-y-4 mb-8">
          {/* Total Credits */}
          <div className="border-l-4 border-[#5EEAD4] pl-4 py-1 bg-white/[0.02] rounded-r-xl">
            <div className="flex justify-between items-center mb-1">
              <p className="text-xs uppercase tracking-wider text-white/50 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#5EEAD4]" />
                Tín chỉ tích lũy / Tổng số
              </p>
              <span className="text-xs font-mono font-bold text-[#5EEAD4]">
                {creditProgress}%
              </span>
            </div>
            <p className="text-2xl font-bold text-white tracking-tight">
              {stats.totalPassedCredits}{' '}
              <span className="text-base font-normal text-white/40">
                / {profile.totalProgramCredits || 140} tín chỉ
              </span>
            </p>
            {/* Progress bar */}
            <div className="w-full bg-[#161B22] h-2 rounded-full overflow-hidden mt-2 border border-white/5">
              <div
                className="bg-[#5EEAD4] h-full transition-all duration-500 rounded-full"
                style={{ width: `${creditProgress}%` }}
              ></div>
            </div>
          </div>

          {/* Academic Standing */}
          <div className="border-l-4 border-white/20 pl-4 py-1 bg-white/[0.02] rounded-r-xl">
            <p className="text-xs uppercase tracking-wider text-white/50 flex items-center gap-1.5 mb-1">
              <Award className="w-3.5 h-3.5 text-white/60" />
              Xếp loại học lực
            </p>
            <div className="flex items-center gap-3">
              <p className="text-2xl font-bold text-white tracking-tight">
                {stats.academicStanding}
              </p>
              <span className="text-xs uppercase tracking-widest px-2 py-0.5 rounded bg-white/10 text-white/70 font-mono">
                {stats.academicStandingEn}
              </span>
            </div>
          </div>

          {/* Class Rank / Milestone */}
          <div className="border-l-4 border-white/20 pl-4 py-1 bg-white/[0.02] rounded-r-xl">
            <p className="text-xs uppercase tracking-wider text-white/50 flex items-center gap-1.5 mb-1">
              <TrendingUp className="w-3.5 h-3.5 text-white/60" />
              Mục tiêu & Xếp hạng dự kiến
            </p>
            <div className="flex items-center justify-between">
              <p className="text-xl font-bold font-mono tracking-tight text-[#5EEAD4]">
                {stats.rankBadge}
              </p>
              <span className="text-xs text-white/60 font-mono">
                Mục tiêu: <strong className="text-white">{profile.targetCpa?.toFixed(2) || '3.60'}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Box */}
      <div className="bg-[#161B22] border border-white/10 p-5 rounded-2xl">
        <p className="text-[10px] uppercase tracking-widest text-white/50 font-bold mb-3">
          Thao tác nhanh
        </p>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            id="btn-quick-add-sem"
            onClick={onOpenAddSemester}
            className="flex items-center justify-center gap-1.5 bg-white text-black text-xs font-bold py-3 px-2 rounded-xl uppercase tracking-wider hover:bg-[#5EEAD4] transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm HK</span>
          </button>

          <button
            id="btn-quick-target"
            onClick={onOpenTarget}
            className="flex items-center justify-center gap-1.5 bg-[#21262D] text-white text-xs font-bold py-3 px-2 rounded-xl uppercase tracking-wider border border-white/10 hover:border-[#5EEAD4]/60 transition-all"
          >
            <Target className="w-3.5 h-3.5 text-[#5EEAD4]" />
            <span>Tính Target</span>
          </button>

          <button
            id="btn-quick-export"
            onClick={onOpenExport}
            className="flex items-center justify-center gap-1.5 bg-[#21262D] text-white text-xs font-bold py-2.5 px-2 rounded-xl uppercase tracking-wider border border-white/10 hover:border-white/30 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Xuất PDF</span>
          </button>

          <button
            id="btn-quick-reset"
            onClick={onResetSampleData}
            className="flex items-center justify-center gap-1.5 bg-[#21262D] text-white/70 hover:text-white text-xs font-bold py-2.5 px-2 rounded-xl uppercase tracking-wider border border-white/10 hover:border-white/30 transition-all"
            title="Khôi phục dữ liệu mẫu 4 năm chuẩn"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Dữ liệu mẫu</span>
          </button>
        </div>
      </div>
    </section>
  );
};
