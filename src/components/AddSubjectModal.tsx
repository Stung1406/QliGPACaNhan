import React, { useState, useEffect } from 'react';
import { X, Check, Calculator, BookOpen, AlertCircle } from 'lucide-react';
import { Subject, GradeLetter, SubjectCategory } from '../types';
import { convertScore10ToDetails, convertLetterToScore4 } from '../lib/gpaCalculator';

interface AddSubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (subject: Subject) => void;
  semesterId: string;
  semesterName: string;
  initialData?: Subject | null;
}

export const AddSubjectModal: React.FC<AddSubjectModalProps> = ({
  isOpen,
  onClose,
  onSave,
  semesterId,
  semesterName,
  initialData,
}) => {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [credits, setCredits] = useState<number>(3);
  const [score10, setScore10] = useState<string>('8.5');
  const [scoreLetter, setScoreLetter] = useState<GradeLetter>('A');
  const [score4, setScore4] = useState<number>(4.0);
  const [category, setCategory] = useState<SubjectCategory>('chuyennganh');
  const [note, setNote] = useState('');
  const [autoConvert, setAutoConvert] = useState(true);

  useEffect(() => {
    if (initialData) {
      setCode(initialData.code || '');
      setName(initialData.name || '');
      setCredits(initialData.credits || 3);
      setScore10(initialData.score10 !== undefined ? String(initialData.score10) : '8.5');
      setScoreLetter(initialData.scoreLetter || 'A');
      setScore4(initialData.score4 !== undefined ? initialData.score4 : 4.0);
      setCategory(initialData.category || 'chuyennganh');
      setNote(initialData.note || '');
    } else {
      setCode('');
      setName('');
      setCredits(3);
      setScore10('8.5');
      setScoreLetter('A');
      setScore4(4.0);
      setCategory('chuyennganh');
      setNote('');
    }
  }, [initialData, isOpen]);

  // Handle Score 10 change with auto conversion
  const handleScore10Change = (valStr: string) => {
    setScore10(valStr);
    const num = parseFloat(valStr);
    if (!isNaN(num) && autoConvert) {
      const details = convertScore10ToDetails(num);
      setScoreLetter(details.letter);
      setScore4(details.score4);
    }
  };

  const handleLetterChange = (letter: GradeLetter) => {
    setScoreLetter(letter);
    if (autoConvert) {
      setScore4(convertLetterToScore4(letter));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const num10 = parseFloat(score10);
    const valid10 = !isNaN(num10) ? Math.max(0, Math.min(10, num10)) : undefined;

    const newSubject: Subject = {
      id: initialData?.id || `subj-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      code: code.trim().toUpperCase() || 'MH' + Math.floor(1000 + Math.random() * 9000),
      name: name.trim(),
      credits: Number(credits) || 3,
      score10: valid10,
      scoreLetter,
      score4: Number(score4) || 0,
      category,
      note: note.trim() || undefined,
      isPassed: scoreLetter !== 'F' && score4 >= 1.0,
    };

    onSave(newSubject);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#12161E] border border-white/20 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="p-6 bg-[#161B22] border-b border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[#5EEAD4] text-xs font-bold tracking-widest uppercase font-mono">
              {initialData ? 'Cập Nhật Môn Học' : 'Thêm Môn Học Mới'}
            </span>
            <h3 className="text-xl font-black uppercase text-white mt-0.5">
              {semesterName}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-mono uppercase text-white/60 mb-1">
                Mã Môn Học
              </label>
              <input
                type="text"
                placeholder="VD: INT2202"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full bg-[#0A0B0E] border border-white/10 rounded-xl px-3 py-2.5 text-sm font-mono uppercase text-white focus:outline-none focus:border-[#5EEAD4]"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-[11px] font-mono uppercase text-white/60 mb-1">
                Tên Môn Học *
              </label>
              <input
                type="text"
                required
                placeholder="VD: Lập trình Hướng đối tượng"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#0A0B0E] border border-white/10 rounded-xl px-3 py-2.5 text-sm font-medium text-white focus:outline-none focus:border-[#5EEAD4]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono uppercase text-white/60 mb-1">
                Số Tín Chỉ (Credits) *
              </label>
              <select
                value={credits}
                onChange={(e) => setCredits(Number(e.target.value))}
                className="w-full bg-[#0A0B0E] border border-white/10 rounded-xl px-3 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-[#5EEAD4]"
              >
                {[1, 2, 3, 4, 5, 6, 8, 10].map((c) => (
                  <option key={c} value={c} className="bg-[#12161E]">
                    {c} Tín chỉ
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-white/60 mb-1">
                Khối Kiến Thức
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as SubjectCategory)}
                className="w-full bg-[#0A0B0E] border border-white/10 rounded-xl px-3 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-[#5EEAD4]"
              >
                <option value="daicuong" className="bg-[#12161E]">Đại cương</option>
                <option value="coso" className="bg-[#12161E]">Cơ sở ngành</option>
                <option value="chuyennganh" className="bg-[#12161E]">Chuyên ngành</option>
                <option value="tuchon" className="bg-[#12161E]">Tự chọn</option>
                <option value="thuctap_khoaluan" className="bg-[#12161E]">Khóa luận / Thực tập</option>
                <option value="khac" className="bg-[#12161E]">Khác</option>
              </select>
            </div>
          </div>

          {/* Grade Conversion Box */}
          <div className="bg-[#0A0B0E] border border-white/10 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase text-[#5EEAD4] font-bold flex items-center gap-1.5">
                <Calculator className="w-3.5 h-3.5" />
                Nhập Điểm & Tự Động Quy Đổi
              </span>
              <label className="flex items-center gap-1.5 text-xs text-white/60 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoConvert}
                  onChange={(e) => setAutoConvert(e.target.checked)}
                  className="rounded accent-[#5EEAD4]"
                />
                <span>Tự động quy đổi</span>
              </label>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {/* Score 10 */}
              <div>
                <label className="block text-[10px] uppercase font-mono text-white/50 mb-1">
                  Điểm Hệ 10 (0 - 10)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={score10}
                  onChange={(e) => handleScore10Change(e.target.value)}
                  className="w-full bg-[#161B22] border border-white/20 rounded-xl px-3 py-2 text-center text-base font-mono font-bold text-white focus:outline-none focus:border-[#5EEAD4]"
                />
              </div>

              {/* Letter Grade */}
              <div>
                <label className="block text-[10px] uppercase font-mono text-white/50 mb-1">
                  Điểm Chữ
                </label>
                <select
                  value={scoreLetter}
                  onChange={(e) => handleLetterChange(e.target.value as GradeLetter)}
                  className="w-full bg-[#161B22] border border-white/20 rounded-xl px-2 py-2 text-center text-base font-mono font-black text-[#5EEAD4] focus:outline-none focus:border-[#5EEAD4]"
                >
                  {['A', 'B', 'C', 'D', 'F'].map((lg) => (
                    <option key={lg} value={lg} className="bg-[#12161E]">
                      {lg}
                    </option>
                  ))}
                </select>
              </div>

              {/* Score 4 */}
              <div>
                <label className="block text-[10px] uppercase font-mono text-white/50 mb-1">
                  Điểm Hệ 4 (0 - 4.0)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="4.0"
                  value={score4}
                  onChange={(e) => setScore4(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#161B22] border border-white/20 rounded-xl px-3 py-2 text-center text-base font-mono font-bold text-white focus:outline-none focus:border-[#5EEAD4]"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase text-white/60 mb-1">
              Ghi Chú (Tùy chọn)
            </label>
            <input
              type="text"
              placeholder="VD: Môn học lại, Đạt điểm cao, Thi đợt 1..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-[#0A0B0E] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#5EEAD4]"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold font-mono text-white/60 hover:text-white transition-colors"
            >
              HỦY BỎ
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 bg-white text-black hover:bg-[#5EEAD4] px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg"
            >
              <Check className="w-4 h-4" />
              <span>{initialData ? 'Lưu Thay Đổi' : 'Thêm Vào Học Kỳ'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
