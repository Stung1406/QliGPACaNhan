import React, { useRef } from 'react';
import { X, Printer, FileSpreadsheet, FileJson, Upload, Download, CheckCircle2 } from 'lucide-react';
import { Semester, StudentProfile, OverallStats } from '../types';
import { calculateSemesterStats } from '../lib/gpaCalculator';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  semesters: Semester[];
  stats: OverallStats;
  onImportData: (profile: StudentProfile, semesters: Semester[]) => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  profile,
  semesters,
  stats,
  onImportData,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Print Transcript
  const handlePrint = () => {
    window.print();
  };

  // Export CSV
  const handleExportCSV = () => {
    let csv = `Học kỳ,Mã môn,Tên môn học,Số tín chỉ,Khối kiến thức,Điểm hệ 10,Điểm chữ,Điểm hệ 4,Kết quả\n`;

    for (const sem of semesters) {
      for (const sub of sem.subjects) {
        csv += `"${sem.name}","${sub.code}","${sub.name.replace(/"/g, '""')}",${sub.credits},"${sub.category || ''}",${sub.score10 || ''},"${sub.scoreLetter || ''}",${sub.score4 || ''},"${sub.scoreLetter === 'F' ? 'Không đạt' : 'Đạt'}"\n`;
      }
    }

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Bang_Diem_GPA_${profile.studentId || '4_Nam'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export JSON Backup
  const handleExportJSON = () => {
    const data = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      profile,
      semesters,
      overallStats: stats,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GPA_Backup_${profile.studentId || 'Data'}_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON Backup
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const content = evt.target?.result as string;
        const parsed = JSON.parse(content);
        if (parsed.semesters && Array.isArray(parsed.semesters)) {
          onImportData(parsed.profile || profile, parsed.semesters);
          alert('Đã khôi phục dữ liệu bảng điểm thành công!');
          onClose();
        } else {
          alert('File JSON không đúng định dạng sao lưu GPA.');
        }
      } catch (err) {
        alert('Không thể đọc file JSON.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#12161E] border border-white/20 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl">
        <div className="p-6 bg-[#161B22] border-b border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[#5EEAD4] text-xs font-bold tracking-widest uppercase font-mono">
              Xuất / Sao Lưu Dữ Liệu
            </span>
            <h3 className="text-xl font-black uppercase text-white mt-0.5">
              Bảng Điểm & Báo Cáo GPA
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Print Option */}
          <div className="flex items-center justify-between p-4 bg-[#0A0B0E] border border-white/10 rounded-2xl group hover:border-[#5EEAD4]/50 transition-all">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#5EEAD4]">
                <Printer className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white uppercase">In Bảng Điểm / Xuất PDF Trình Duyệt</h4>
                <p className="text-xs text-white/50">Định dạng chuẩn trang A4 in ấn đầy đủ 4 năm học</p>
              </div>
            </div>
            <button
              onClick={handlePrint}
              className="bg-white text-black hover:bg-[#5EEAD4] px-4 py-2 rounded-xl text-xs font-bold font-mono uppercase transition-all"
            >
              In / PDF
            </button>
          </div>

          {/* CSV Export */}
          <div className="flex items-center justify-between p-4 bg-[#0A0B0E] border border-white/10 rounded-2xl group hover:border-[#5EEAD4]/50 transition-all">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white uppercase">Xuất File Excel (CSV)</h4>
                <p className="text-xs text-white/50">Mở trên Microsoft Excel, Google Sheets đầy đủ điểm số</p>
              </div>
            </div>
            <button
              onClick={handleExportCSV}
              className="bg-[#21262D] text-white hover:bg-white hover:text-black border border-white/10 px-4 py-2 rounded-xl text-xs font-bold font-mono uppercase transition-all"
            >
              Tải CSV
            </button>
          </div>

          {/* JSON Backup */}
          <div className="flex items-center justify-between p-4 bg-[#0A0B0E] border border-white/10 rounded-2xl group hover:border-[#5EEAD4]/50 transition-all">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400">
                <FileJson className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white uppercase">Sao Lưu Toàn Bộ Dữ Liệu (JSON)</h4>
                <p className="text-xs text-white/50">Lưu file backup để chuyển thiết bị hoặc khôi phục</p>
              </div>
            </div>
            <button
              onClick={handleExportJSON}
              className="bg-[#21262D] text-white hover:bg-white hover:text-black border border-white/10 px-4 py-2 rounded-xl text-xs font-bold font-mono uppercase transition-all"
            >
              Tải JSON
            </button>
          </div>

          {/* JSON Restore */}
          <div className="p-4 bg-[#0A0B0E] border border-dashed border-white/20 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-purple-400">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white uppercase">Khôi Phục Từ File Backup</h4>
                <p className="text-xs text-white/50">Chọn file .json đã tải về trước đó</p>
              </div>
            </div>
            <input
              type="file"
              accept=".json"
              ref={fileInputRef}
              onChange={handleImportFile}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-[#21262D] text-white hover:bg-[#5EEAD4] hover:text-black border border-white/10 px-4 py-2 rounded-xl text-xs font-bold font-mono uppercase transition-all"
            >
              Chọn File
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
