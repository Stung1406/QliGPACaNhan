import React from 'react';
import { Database, Target, FileDown, PlusCircle, User, Sparkles } from 'lucide-react';
import { StudentProfile } from '../types';

interface HeaderProps {
  profile: StudentProfile;
  onOpenProfile: () => void;
  onOpenTargetModal: () => void;
  onOpenFirebaseModal: () => void;
  onOpenExportModal: () => void;
  onOpenAddSemesterModal: () => void;
  isCloudSynced: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  onOpenProfile,
  onOpenTargetModal,
  onOpenFirebaseModal,
  onOpenExportModal,
  onOpenAddSemesterModal,
  isCloudSynced,
}) => {
  return (
    <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-8 border-b border-white/10 pb-6">
      <div className="flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[#5EEAD4] text-xs font-bold tracking-[0.25em] uppercase">
            Hệ Thống Quản Lý Điểm & GPA 4 Năm Học
          </span>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white/10 text-white/70">
            Next.js / Tailwind
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter text-white uppercase leading-none">
          GPA Tracker<span className="text-[#5EEAD4]">.</span>
        </h1>
        <p className="text-xs text-white/50 mt-2 max-w-xl">
          Theo dõi tiến độ học tập, quy đổi thang 4 & thang 10, phân tích thống kê từng học kỳ và giả lập mục tiêu tốt nghiệp.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Student Profile pill */}
        <button
          id="btn-header-profile"
          onClick={onOpenProfile}
          className="flex items-center gap-3 bg-[#161B22] border border-white/10 hover:border-[#5EEAD4]/60 px-4 py-2.5 rounded-xl text-left transition-all group"
        >
          <div className="w-8 h-8 rounded-lg bg-[#5EEAD4]/10 border border-[#5EEAD4]/30 flex items-center justify-center text-[#5EEAD4] group-hover:scale-105 transition-transform">
            <User className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] text-white/50 uppercase tracking-widest leading-none mb-1">
              {profile.studentId || 'Chưa đặt MSSV'}
            </p>
            <p className="text-sm font-bold text-white group-hover:text-[#5EEAD4] transition-colors leading-none">
              {profile.name || 'Sinh viên'}
            </p>
          </div>
        </button>

        {/* Firebase Cloud Sync Button */}
        <button
          id="btn-header-firebase"
          onClick={onOpenFirebaseModal}
          className={`flex items-center gap-2 text-xs font-bold px-3.5 py-2.5 rounded-xl border transition-all ${
            isCloudSynced
              ? 'bg-[#5EEAD4]/10 border-[#5EEAD4] text-[#5EEAD4]'
              : 'bg-[#161B22] border-white/10 text-white/80 hover:border-white/30'
          }`}
          title="Kết nối Firebase Firestore để lưu trữ đám mây"
        >
          <Database className="w-4 h-4" />
          <span className="hidden sm:inline">Firebase DB</span>
          {isCloudSynced && (
            <span className="w-2 h-2 rounded-full bg-[#5EEAD4] animate-pulse"></span>
          )}
        </button>

        {/* Target GPA Simulator Button */}
        <button
          id="btn-header-target"
          onClick={onOpenTargetModal}
          className="flex items-center gap-2 bg-[#161B22] text-white hover:text-[#5EEAD4] border border-white/10 hover:border-[#5EEAD4]/40 text-xs font-bold px-3.5 py-2.5 rounded-xl transition-all"
        >
          <Target className="w-4 h-4 text-[#5EEAD4]" />
          <span className="hidden sm:inline">Mục tiêu CPA</span>
        </button>

        {/* Export / Print Button */}
        <button
          id="btn-header-export"
          onClick={onOpenExportModal}
          className="flex items-center gap-2 bg-[#21262D] text-white border border-white/10 hover:border-white/30 text-xs font-bold px-3.5 py-2.5 rounded-xl transition-all"
        >
          <FileDown className="w-4 h-4 text-white/70" />
          <span className="hidden sm:inline">Xuất bảng điểm</span>
        </button>

        {/* Add Semester Button */}
        <button
          id="btn-header-add-semester"
          onClick={onOpenAddSemesterModal}
          className="flex items-center gap-2 bg-white text-black hover:bg-[#5EEAD4] text-xs font-bold px-4 py-2.5 rounded-xl uppercase tracking-wider transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Thêm Học Kỳ</span>
        </button>
      </div>
    </header>
  );
};
