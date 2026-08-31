import React, { useState } from 'react';
import { X, User, Check, Building, GraduationCap, Calendar, Award } from 'lucide-react';
import { StudentProfile } from '../types';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  onSave: (updatedProfile: StudentProfile) => void;
}

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave,
}) => {
  const [name, setName] = useState(profile.name);
  const [studentId, setStudentId] = useState(profile.studentId);
  const [university, setUniversity] = useState(profile.university);
  const [major, setMajor] = useState(profile.major);
  const [classCohort, setClassCohort] = useState(profile.classCohort);
  const [startYear, setStartYear] = useState<number>(profile.startYear || 2021);
  const [totalProgramCredits, setTotalProgramCredits] = useState<number>(
    profile.totalProgramCredits || 140
  );
  const [targetCpa, setTargetCpa] = useState<number>(profile.targetCpa || 3.6);
  const [academicStandingNote, setAcademicStandingNote] = useState(
    profile.academicStandingNote || ''
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: name.trim(),
      studentId: studentId.trim().toUpperCase(),
      university: university.trim(),
      major: major.trim(),
      classCohort: classCohort.trim(),
      startYear: Number(startYear) || 2021,
      totalProgramCredits: Number(totalProgramCredits) || 140,
      targetCpa: Number(targetCpa) || 3.6,
      academicStandingNote: academicStandingNote.trim() || undefined,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#12161E] border border-white/20 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
        <div className="p-6 bg-[#161B22] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#5EEAD4]/10 border border-[#5EEAD4]/30 flex items-center justify-center text-[#5EEAD4]">
              <User className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[#5EEAD4] text-xs font-bold tracking-widest uppercase font-mono">
                Thông Tin Sinh Viên
              </span>
              <h3 className="text-xl font-black uppercase text-white mt-0.5">
                Hồ Sơ Cá Nhân & Chương Trình
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono uppercase text-white/60 mb-1">
                Họ và Tên *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#0A0B0E] border border-white/10 rounded-xl px-3 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-[#5EEAD4]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-white/60 mb-1">
                Mã Số Sinh Viên (MSSV) *
              </label>
              <input
                type="text"
                required
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full bg-[#0A0B0E] border border-white/10 rounded-xl px-3 py-2.5 text-sm font-mono uppercase text-[#5EEAD4] focus:outline-none focus:border-[#5EEAD4]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase text-white/60 mb-1">
              Trường Đại Học
            </label>
            <input
              type="text"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              placeholder="VD: Trường ĐH Bách Khoa / ĐH Quốc Gia / ĐH Ngoại Thương"
              className="w-full bg-[#0A0B0E] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#5EEAD4]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono uppercase text-white/60 mb-1">
                Chuyên Ngành Đào Tạo
              </label>
              <input
                type="text"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                placeholder="VD: Khoa học Máy tính"
                className="w-full bg-[#0A0B0E] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#5EEAD4]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-white/60 mb-1">
                Lớp / Khóa Học
              </label>
              <input
                type="text"
                value={classCohort}
                onChange={(e) => setClassCohort(e.target.value)}
                placeholder="VD: K66-CNTT"
                className="w-full bg-[#0A0B0E] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#5EEAD4]"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-mono uppercase text-white/60 mb-1">
                Năm Nhập Học
              </label>
              <input
                type="number"
                value={startYear}
                onChange={(e) => setStartYear(Number(e.target.value))}
                className="w-full bg-[#0A0B0E] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#5EEAD4]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-white/60 mb-1">
                Tổng TC Ra Trường
              </label>
              <input
                type="number"
                value={totalProgramCredits}
                onChange={(e) => setTotalProgramCredits(Number(e.target.value))}
                className="w-full bg-[#0A0B0E] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#5EEAD4]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-white/60 mb-1">
                Mục Tiêu CPA (Hệ 4)
              </label>
              <input
                type="number"
                step="0.05"
                min="0"
                max="4.0"
                value={targetCpa}
                onChange={(e) => setTargetCpa(parseFloat(e.target.value) || 3.6)}
                className="w-full bg-[#0A0B0E] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-[#5EEAD4] focus:outline-none focus:border-[#5EEAD4]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase text-white/60 mb-1">
              Ghi Chú Tiến Độ / Kế Hoạch Tốt Nghiệp
            </label>
            <input
              type="text"
              value={academicStandingNote}
              onChange={(e) => setAcademicStandingNote(e.target.value)}
              placeholder="VD: Dự kiến hoàn thành 8 kỳ và tốt nghiệp Xuất sắc"
              className="w-full bg-[#0A0B0E] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#5EEAD4]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold font-mono text-white/60 hover:text-white"
            >
              HỦY
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 bg-white text-black hover:bg-[#5EEAD4] px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Lưu Thông Tin</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
