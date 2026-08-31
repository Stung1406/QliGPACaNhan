import React, { useState } from 'react';
import { X, Check, Calendar, Plus } from 'lucide-react';
import { Semester } from '../types';

interface AddSemesterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (semester: Semester) => void;
  existingCount: number;
}

export const AddSemesterModal: React.FC<AddSemesterModalProps> = ({
  isOpen,
  onClose,
  onSave,
  existingCount,
}) => {
  const [year, setYear] = useState<number>(Math.min(4, Math.floor(existingCount / 2) + 1));
  const [term, setTerm] = useState<1 | 2 | 3>(existingCount % 2 === 0 ? 1 : 2);
  const [academicYear, setAcademicYear] = useState<string>('2024 - 2025');
  const [targetGpa, setTargetGpa] = useState<number>(3.6);

  const termLabel = term === 1 ? 'Học kỳ 1' : term === 2 ? 'Học kỳ 2' : 'Học kỳ Hè';
  const name = `${termLabel} - Năm ${year}`;
  const shortName = term === 3 ? `HK Hè - Y${year}` : `HK${term} - Y${year}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newSemester: Semester = {
      id: `sem-y${year}s${term}-${Date.now()}`,
      year,
      term,
      name,
      shortName,
      academicYear,
      subjects: [],
      targetGpa,
      isCompleted: false,
    };

    onSave(newSemester);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#12161E] border border-white/20 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="p-6 bg-[#161B22] border-b border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[#5EEAD4] text-xs font-bold tracking-widest uppercase font-mono">
              Thêm Học Kỳ Mới
            </span>
            <h3 className="text-xl font-black uppercase text-white mt-0.5">
              Cấu Trúc 4 Năm Đại Học
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono uppercase text-white/60 mb-1">
                Năm Học Thứ
              </label>
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full bg-[#0A0B0E] border border-white/10 rounded-xl px-3 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-[#5EEAD4]"
              >
                <option value={1}>Năm 1 (Freshman)</option>
                <option value={2}>Năm 2 (Sophomore)</option>
                <option value={3}>Năm 3 (Junior)</option>
                <option value={4}>Năm 4 (Senior)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-white/60 mb-1">
                Kỳ Học
              </label>
              <select
                value={term}
                onChange={(e) => setTerm(Number(e.target.value) as 1 | 2 | 3)}
                className="w-full bg-[#0A0B0E] border border-white/10 rounded-xl px-3 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-[#5EEAD4]"
              >
                <option value={1}>Học kỳ 1 (Fall)</option>
                <option value={2}>Học kỳ 2 (Spring)</option>
                <option value={3}>Học kỳ Hè (Summer)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase text-white/60 mb-1">
              Niên Khóa Học
            </label>
            <input
              type="text"
              placeholder="VD: 2024 - 2025"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className="w-full bg-[#0A0B0E] border border-white/10 rounded-xl px-3 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-[#5EEAD4]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase text-white/60 mb-1">
              Mục Tiêu GPA Cho Kỳ Này (0.0 - 4.0)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="4.0"
              value={targetGpa}
              onChange={(e) => setTargetGpa(parseFloat(e.target.value) || 3.5)}
              className="w-full bg-[#0A0B0E] border border-white/10 rounded-xl px-3 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-[#5EEAD4]"
            />
          </div>

          <div className="bg-[#0A0B0E] border border-white/10 rounded-2xl p-3.5 text-xs text-white/70">
            <p className="font-mono text-[11px] text-[#5EEAD4] font-bold mb-1">Xác Nhận Tên Học Kỳ:</p>
            <p className="font-bold text-white text-sm">{name} ({shortName})</p>
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
              <Plus className="w-4 h-4" />
              <span>Tạo Học Kỳ</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
