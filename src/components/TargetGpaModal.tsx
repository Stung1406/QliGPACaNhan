import React, { useState } from 'react';
import { X, Target, Sparkles, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';
import { OverallStats, StudentProfile } from '../types';
import { calculateRequiredGpa } from '../lib/gpaCalculator';

interface TargetGpaModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: OverallStats;
  profile: StudentProfile;
  onUpdateProfileTarget: (targetCpa: number, totalCredits: number) => void;
}

export const TargetGpaModal: React.FC<TargetGpaModalProps> = ({
  isOpen,
  onClose,
  stats,
  profile,
  onUpdateProfileTarget,
}) => {
  const [targetCpa, setTargetCpa] = useState<number>(profile.targetCpa || 3.6);
  const [totalProgramCredits, setTotalProgramCredits] = useState<number>(
    profile.totalProgramCredits || 140
  );

  const simulation = calculateRequiredGpa(
    stats.cpa4,
    stats.totalPassedCredits,
    totalProgramCredits,
    targetCpa
  );

  const handleSave = () => {
    onUpdateProfileTarget(targetCpa, totalProgramCredits);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#12161E] border border-white/20 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
        <div className="p-6 bg-[#161B22] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#5EEAD4]/10 border border-[#5EEAD4]/30 flex items-center justify-center text-[#5EEAD4]">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[#5EEAD4] text-xs font-bold tracking-widest uppercase font-mono">
                Công Cụ Giả Lập GPA
              </span>
              <h3 className="text-xl font-black uppercase text-white mt-0.5">
                Tính Mục Tiêu Tốt Nghiệp
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Current vs Target banner */}
          <div className="grid grid-cols-2 gap-3 bg-[#0A0B0E] p-4 rounded-2xl border border-white/10">
            <div className="text-center border-r border-white/10 pr-2">
              <span className="text-[10px] uppercase font-mono text-white/50">CPA Hiện Tại</span>
              <p className="text-3xl font-black text-white font-mono mt-0.5">
                {stats.cpa4.toFixed(2)}
              </p>
              <span className="text-[10px] text-[#5EEAD4] font-mono">
                {stats.totalPassedCredits} / {totalProgramCredits} TC
              </span>
            </div>

            <div className="text-center pl-2">
              <span className="text-[10px] uppercase font-mono text-[#5EEAD4]">Mục Tiêu CPA</span>
              <p className="text-3xl font-black text-[#5EEAD4] font-mono mt-0.5">
                {targetCpa.toFixed(2)}
              </p>
              <span className="text-[10px] text-white/50 font-mono">
                {targetCpa >= 3.6 ? 'Xuất Sắc' : targetCpa >= 3.2 ? 'Giỏi' : 'Khá'}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-mono uppercase text-white/70">
                  Mục tiêu CPA Tốt Nghiệp Hệ 4:
                </label>
                <span className="text-sm font-mono font-bold text-[#5EEAD4]">{targetCpa.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="2.0"
                max="4.0"
                step="0.05"
                value={targetCpa}
                onChange={(e) => setTargetCpa(parseFloat(e.target.value))}
                className="w-full accent-[#5EEAD4] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-white/40 mt-1">
                <span onClick={() => setTargetCpa(2.5)} className="cursor-pointer hover:text-white">2.5 (Khá)</span>
                <span onClick={() => setTargetCpa(3.2)} className="cursor-pointer hover:text-white">3.2 (Giỏi)</span>
                <span onClick={() => setTargetCpa(3.6)} className="cursor-pointer hover:text-white">3.6 (Xuất sắc)</span>
                <span onClick={() => setTargetCpa(4.0)} className="cursor-pointer hover:text-white">4.0 (Tối đa)</span>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-white/60 mb-1">
                Tổng Số Tín Chỉ Chương Trình Đào Tạo
              </label>
              <input
                type="number"
                value={totalProgramCredits}
                onChange={(e) => setTotalProgramCredits(Number(e.target.value) || 140)}
                className="w-full bg-[#0A0B0E] border border-white/10 rounded-xl px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-[#5EEAD4]"
              />
            </div>
          </div>

          {/* Simulation Output Result Box */}
          <div className={`p-4 rounded-2xl border ${
            simulation.isAchievable
              ? 'bg-[#5EEAD4]/10 border-[#5EEAD4]/40'
              : 'bg-red-950/20 border-red-500/40'
          }`}>
            <div className="flex items-start gap-3">
              {simulation.isAchievable ? (
                <CheckCircle className="w-5 h-5 text-[#5EEAD4] shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-mono uppercase text-white/80 font-bold">
                    GPA Cần Đạt Mỗi Kỳ Tiếp Theo:
                  </span>
                  <span className={`text-xl font-black font-mono ${
                    simulation.isAchievable ? 'text-[#5EEAD4]' : 'text-red-400'
                  }`}>
                    {simulation.requiredGpa4.toFixed(2)}
                  </span>
                  <span className="text-xs text-white/50">/ 4.0</span>
                </div>
                <p className="text-xs text-white/70 leading-relaxed">{simulation.messageVi}</p>
                <p className="text-[11px] font-mono text-white/50 pt-1">
                  Số tín chỉ còn lại cần tích lũy: <strong>{simulation.remainingCredits} TC</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold font-mono text-white/60 hover:text-white"
            >
              ĐÓNG
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-2 bg-white text-black hover:bg-[#5EEAD4] px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
            >
              <span>Lưu Mục Tiêu Này</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
