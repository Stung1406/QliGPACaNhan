import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Trash2,
  Edit2,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Calendar,
  Layers,
  Search,
  Filter,
  X,
  Sparkles,
} from 'lucide-react';
import { Semester, Subject, SubjectCategory, GradeLetter } from '../types';
import { calculateSemesterStats } from '../lib/gpaCalculator';

interface SemesterManagerProps {
  semesters: Semester[];
  onAddSubject: (semesterId: string) => void;
  onEditSubject: (semesterId: string, subject: Subject) => void;
  onDeleteSubject: (semesterId: string, subjectId: string) => void;
  onDeleteSemester: (semesterId: string) => void;
  onOpenAddSemester: () => void;
}

const CATEGORY_LABELS: Record<SubjectCategory, { label: string; bg: string; text: string }> = {
  daicuong: { label: 'Đại cương', bg: 'bg-blue-500/10 border-blue-500/30', text: 'text-blue-300' },
  coso: { label: 'Cơ sở ngành', bg: 'bg-teal-500/10 border-teal-500/30', text: 'text-teal-300' },
  chuyennganh: { label: 'Chuyên ngành', bg: 'bg-indigo-500/10 border-indigo-500/30', text: 'text-indigo-300' },
  tuchon: { label: 'Tự chọn', bg: 'bg-purple-500/10 border-purple-500/30', text: 'text-purple-300' },
  thuctap_khoaluan: { label: 'Khóa luận/TT', bg: 'bg-emerald-500/10 border-emerald-500/30', text: 'text-emerald-300' },
  khac: { label: 'Khác', bg: 'bg-gray-500/10 border-gray-500/30', text: 'text-gray-300' },
};

export const SemesterManager: React.FC<SemesterManagerProps> = ({
  semesters,
  onAddSubject,
  onEditSubject,
  onDeleteSubject,
  onDeleteSemester,
  onOpenAddSemester,
}) => {
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<SubjectCategory | 'all'>('all');
  const [gradeFilter, setGradeFilter] = useState<string>('all');
  const [collapsedSemesters, setCollapsedSemesters] = useState<Record<string, boolean>>({});

  const toggleCollapse = (semId: string) => {
    setCollapsedSemesters((prev) => ({
      ...prev,
      [semId]: !prev[semId],
    }));
  };

  const toggleAllCollapse = () => {
    const allCollapsed = filteredSemesters.every((s) => collapsedSemesters[s.id]);
    const newState: Record<string, boolean> = {};
    filteredSemesters.forEach((s) => {
      newState[s.id] = !allCollapsed;
    });
    setCollapsedSemesters(newState);
  };

  const filteredSemesters = (
    selectedYear === 'all'
      ? semesters
      : semesters.filter((sem) => sem.year === selectedYear)
  ).map((sem) => {
    const matchingSubjects = sem.subjects.filter((sub) => {
      // Search text
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = sub.name.toLowerCase().includes(q);
        const matchCode = sub.code.toLowerCase().includes(q);
        if (!matchName && !matchCode) return false;
      }
      // Category filter
      if (categoryFilter !== 'all' && sub.category !== categoryFilter) {
        return false;
      }
      // Grade filter
      if (gradeFilter !== 'all') {
        if (gradeFilter === 'A' && sub.scoreLetter !== 'A') return false;
        if (gradeFilter === 'B' && sub.scoreLetter !== 'B') return false;
        if (gradeFilter === 'C' && sub.scoreLetter !== 'C') return false;
        if (gradeFilter === 'D' && sub.scoreLetter !== 'D') return false;
        if (gradeFilter === 'F' && sub.scoreLetter !== 'F') return false;
      }
      return true;
    });

    return {
      ...sem,
      filteredSubjects: matchingSubjects,
    };
  });

  const totalFilteredCount = filteredSemesters.reduce((acc, sem) => acc + sem.filteredSubjects.length, 0);

  return (
    <div className="space-y-6">
      {/* Top Header & Filters */}
      <div className="flex flex-col gap-4 border-b border-white/10 pb-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-[#5EEAD4] text-xs font-bold tracking-[0.2em] uppercase">
              BẢNG ĐIỂM CHI TIẾT
            </span>
            <h3 className="text-2xl font-black uppercase tracking-tight text-white mt-1">
              Quản Lý Môn Học 4 Năm ({semesters.length} Học Kỳ)
            </h3>
          </div>

          {/* Year Filter Buttons */}
          <div className="flex items-center gap-1.5 bg-[#12161E] border border-white/10 p-1.5 rounded-2xl">
            <button
              onClick={() => setSelectedYear('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono transition-all ${
                selectedYear === 'all'
                  ? 'bg-white text-black'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Tất Cả 4 Năm
            </button>
            {[1, 2, 3, 4].map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono transition-all ${
                  selectedYear === year
                    ? 'bg-[#5EEAD4] text-black font-extrabold'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Năm {year}
              </button>
            ))}
          </div>
        </div>

        {/* Search & Subject Category Filter Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-[#12161E] p-3 rounded-2xl border border-white/10">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm kiếm môn học theo tên hoặc mã môn (VD: Giải tích, INT2204...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0A0B0E] border border-white/10 rounded-xl pl-9 pr-8 py-2 text-xs font-mono text-white placeholder-white/40 focus:outline-none focus:border-[#5EEAD4]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Category */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as any)}
              className="bg-[#0A0B0E] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#5EEAD4]"
            >
              <option value="all">Tất cả khối KT</option>
              <option value="daicuong">Đại cương</option>
              <option value="coso">Cơ sở ngành</option>
              <option value="chuyennganh">Chuyên ngành</option>
              <option value="tuchon">Tự chọn</option>
              <option value="thuctap_khoaluan">Khóa luận / Thực tập</option>
            </select>

            {/* Grade Filter */}
            <select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              className="bg-[#0A0B0E] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#5EEAD4]"
            >
              <option value="all">Tất cả mức điểm</option>
              <option value="A">Điểm A (4.0 - Giỏi)</option>
              <option value="B">Điểm B (3.0 - Khá)</option>
              <option value="C">Điểm C (2.0 - TB)</option>
              <option value="D">Điểm D (1.0 - Yếu)</option>
              <option value="F">Điểm F (0.0 - Học lại)</option>
            </select>

            {/* Batch Collapse */}
            <button
              onClick={toggleAllCollapse}
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-white/70 hover:text-white transition-all whitespace-nowrap"
            >
              Đóng/Mở Tất Cả
            </button>
          </div>
        </div>
      </div>

      {/* Semesters List */}
      <div className="space-y-6">
        {filteredSemesters.length === 0 ? (
          <div className="bg-[#12161E] border border-dashed border-white/10 rounded-3xl p-12 text-center">
            <Layers className="w-12 h-12 text-white/20 mx-auto mb-3" />
            <p className="text-base font-bold text-white mb-2">Chưa có học kỳ nào cho Năm {selectedYear}</p>
            <p className="text-xs text-white/50 mb-6">Thêm học kỳ mới để bắt đầu nhập điểm môn học.</p>
            <button
              onClick={onOpenAddSemester}
              className="bg-white text-black hover:bg-[#5EEAD4] px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
            >
              + Tạo Học Kỳ Mới
            </button>
          </div>
        ) : (
          filteredSemesters.map((sem) => {
            const stats = calculateSemesterStats(sem);
            const isCollapsed = !!collapsedSemesters[sem.id];
            const subjectsToDisplay = sem.filteredSubjects || sem.subjects;

            return (
              <div
                key={sem.id}
                id={`semester-${sem.id}`}
                className="bg-[#12161E] border border-white/10 rounded-3xl overflow-hidden transition-all hover:border-white/20"
              >
                {/* Semester Header Card */}
                <div className="p-5 lg:p-6 bg-[#161B22]/70 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <button
                      onClick={() => toggleCollapse(sem.id)}
                      className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all"
                      title={isCollapsed ? 'Mở rộng' : 'Thu gọn'}
                    >
                      {isCollapsed ? (
                        <ChevronRight className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-[#5EEAD4]/10 border border-[#5EEAD4]/30 text-[#5EEAD4] text-[10px] font-mono font-bold uppercase">
                          {sem.shortName}
                        </span>
                        <span className="text-xs text-white/50 font-mono flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {sem.academicYear}
                        </span>
                      </div>
                      <h4 className="text-lg lg:text-xl font-black uppercase text-white mt-1">
                        {sem.name}
                      </h4>
                    </div>
                  </div>

                  {/* Semester Mini Stats & Actions */}
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                    {/* GPA Metric Pill */}
                    <div className="bg-[#0A0B0E] border border-white/10 px-4 py-2 rounded-2xl flex items-baseline gap-2">
                      <span className="text-[10px] uppercase font-mono text-white/50">GPA HK:</span>
                      <span className="text-xl font-black text-[#5EEAD4] font-mono leading-none">
                        {stats.gpa4.toFixed(2)}
                      </span>
                      <span className="text-xs text-white/40 font-mono">
                        ({stats.gpa10.toFixed(1)}/10)
                      </span>
                    </div>

                    {/* Credits pill */}
                    <div className="bg-[#0A0B0E] border border-white/10 px-3.5 py-2 rounded-2xl text-xs font-mono">
                      <span className="text-white/50">Tín chỉ: </span>
                      <strong className="text-white">{stats.passedCredits}</strong>
                      <span className="text-white/40">/{stats.totalCredits} TC</span>
                    </div>

                    {/* Add Subject Button */}
                    <button
                      onClick={() => onAddSubject(sem.id)}
                      className="bg-white text-black hover:bg-[#5EEAD4] px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Thêm môn</span>
                    </button>

                    {/* Delete Semester */}
                    <button
                      onClick={() => onDeleteSemester(sem.id)}
                      className="p-2 rounded-xl text-white/30 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/30 transition-all"
                      title="Xóa học kỳ này"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Subjects Table */}
                {!isCollapsed && (
                  <div className="p-4 lg:p-6 overflow-x-auto">
                    {subjectsToDisplay.length === 0 ? (
                      <div className="py-8 text-center border border-dashed border-white/10 rounded-2xl">
                        <p className="text-xs text-white/40 mb-3">
                          {searchQuery || categoryFilter !== 'all' || gradeFilter !== 'all'
                            ? 'Không tìm thấy môn học nào khớp với bộ lọc.'
                            : 'Chưa có môn học nào trong học kỳ này.'}
                        </p>
                        <button
                          onClick={() => onAddSubject(sem.id)}
                          className="text-[#5EEAD4] hover:underline text-xs font-bold uppercase tracking-wider"
                        >
                          + Nhập môn học mới
                        </button>
                      </div>
                    ) : (
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-white/10 text-[11px] font-mono uppercase tracking-wider text-white/40">
                            <th className="pb-3 pl-2">Mã MH</th>
                            <th className="pb-3">Tên Môn Học</th>
                            <th className="pb-3 text-center">Số TC</th>
                            <th className="pb-3">Khối KT</th>
                            <th className="pb-3 text-center">Điểm Hệ 10</th>
                            <th className="pb-3 text-center">Điểm Chữ</th>
                            <th className="pb-3 text-center">Điểm Hệ 4</th>
                            <th className="pb-3 text-right pr-2">Thao tác</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm">
                          {subjectsToDisplay.map((subject) => {
                            const catStyle = subject.category
                              ? CATEGORY_LABELS[subject.category] || CATEGORY_LABELS.khac
                              : CATEGORY_LABELS.khac;

                            const isFailed = subject.scoreLetter === 'F' || (subject.score4 !== undefined && subject.score4 < 1.0);

                            return (
                              <tr
                                key={subject.id}
                                className={`group hover:bg-white/[0.02] transition-colors ${
                                  isFailed ? 'bg-red-950/10' : ''
                                }`}
                              >
                                {/* Code */}
                                <td className="py-3.5 pl-2 font-mono font-bold text-xs text-[#5EEAD4]">
                                  {subject.code || '---'}
                                </td>

                                {/* Name */}
                                <td className="py-3.5 font-medium text-white max-w-xs sm:max-w-md">
                                  <div className="flex items-center gap-2">
                                    <span>{subject.name}</span>
                                    {subject.note && (
                                      <span className="text-[10px] text-white/40 italic">
                                        ({subject.note})
                                      </span>
                                    )}
                                  </div>
                                </td>

                                {/* Credits */}
                                <td className="py-3.5 text-center font-mono font-bold text-white/90">
                                  {subject.credits}
                                </td>

                                {/* Category */}
                                <td className="py-3.5">
                                  <span
                                    className={`px-2 py-0.5 rounded-md text-[10px] font-mono border ${catStyle.bg} ${catStyle.text}`}
                                  >
                                    {catStyle.label}
                                  </span>
                                </td>

                                {/* Score 10 */}
                                <td className="py-3.5 text-center font-mono font-bold text-white">
                                  {subject.score10 !== undefined ? Number(subject.score10).toFixed(1) : '-'}
                                </td>

                                {/* Letter Grade */}
                                <td className="py-3.5 text-center">
                                  <span
                                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-black ${
                                      subject.scoreLetter === 'A'
                                        ? 'bg-[#5EEAD4]/20 text-[#5EEAD4] border border-[#5EEAD4]/40'
                                        : subject.scoreLetter === 'B'
                                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                                        : subject.scoreLetter === 'C'
                                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                        : subject.scoreLetter === 'D'
                                        ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40'
                                        : subject.scoreLetter === 'F'
                                        ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                                        : 'bg-white/10 text-white/80'
                                    }`}
                                  >
                                    {subject.scoreLetter || 'N/A'}
                                  </span>
                                </td>

                                {/* Score 4 */}
                                <td className="py-3.5 text-center font-mono font-black text-sm text-white">
                                  {subject.score4 !== undefined ? Number(subject.score4).toFixed(1) : '-'}
                                </td>

                                {/* Actions */}
                                <td className="py-3.5 text-right pr-2">
                                  <div className="flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                                    <button
                                      onClick={() => onEditSubject(sem.id, subject)}
                                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-[#5EEAD4] transition-all"
                                      title="Sửa điểm/thông tin môn"
                                    >
                                      <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => onDeleteSubject(sem.id, subject.id)}
                                      className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 border border-white/10 text-white/50 hover:text-red-400 hover:border-red-500/30 transition-all"
                                      title="Xóa môn"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
