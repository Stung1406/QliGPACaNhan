import React from 'react';
import { Semester, StudentProfile, OverallStats } from '../types';
import { calculateSemesterStats } from '../lib/gpaCalculator';

interface PrintableTranscriptProps {
  profile: StudentProfile;
  semesters: Semester[];
  stats: OverallStats;
}

export const PrintableTranscript: React.FC<PrintableTranscriptProps> = ({
  profile,
  semesters,
  stats,
}) => {
  return (
    <div className="hidden print:block text-black bg-white p-8 font-sans max-w-4xl mx-auto">
      {/* Letterhead */}
      <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-6">
        <div>
          <h2 className="text-xl font-bold uppercase">{profile.university || 'TRƯỜNG ĐẠI HỌC'}</h2>
          <p className="text-sm font-medium">BẢNG ĐIỂM KẾT QUẢ HỌC TẬP CÁ NHÂN (4 NĂM)</p>
          <p className="text-xs text-gray-600 mt-1">Hệ đào tạo: Chính quy | Khóa: {profile.classCohort || '2021-2025'}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold">MSSV: {profile.studentId}</p>
          <p className="text-sm">Họ và tên: <strong className="text-base">{profile.name}</strong></p>
          <p className="text-xs text-gray-600">Ngành: {profile.major}</p>
        </div>
      </div>

      {/* Summary Box */}
      <div className="grid grid-cols-4 gap-4 p-4 border border-gray-400 mb-6 bg-gray-50 text-xs">
        <div>
          <p className="text-gray-500 uppercase">CPA Tích lũy (Hệ 4):</p>
          <p className="text-xl font-black text-black">{stats.cpa4.toFixed(2)} / 4.0</p>
        </div>
        <div>
          <p className="text-gray-500 uppercase">CPA Tích lũy (Hệ 10):</p>
          <p className="text-xl font-black text-black">{stats.cpa10.toFixed(2)} / 10</p>
        </div>
        <div>
          <p className="text-gray-500 uppercase">Tín chỉ tích lũy:</p>
          <p className="text-xl font-black text-black">{stats.totalPassedCredits} / {profile.totalProgramCredits || 140}</p>
        </div>
        <div>
          <p className="text-gray-500 uppercase">Xếp loại tốt nghiệp:</p>
          <p className="text-xl font-black text-black">{stats.academicStanding}</p>
        </div>
      </div>

      {/* Semesters and Subjects */}
      <div className="space-y-6">
        {semesters.map((sem) => {
          const semStats = calculateSemesterStats(sem);
          if (sem.subjects.length === 0) return null;

          return (
            <div key={sem.id} className="border border-gray-300 rounded p-3 break-inside-avoid">
              <div className="flex justify-between items-center bg-gray-100 p-2 font-bold text-xs mb-2">
                <span>{sem.name.toUpperCase()} ({sem.academicYear})</span>
                <span>GPA HK: {semStats.gpa4.toFixed(2)} | Tín chỉ: {semStats.passedCredits}/{semStats.totalCredits}</span>
              </div>

              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-300 text-gray-600">
                    <th className="py-1">Mã MH</th>
                    <th className="py-1">Tên Môn Học</th>
                    <th className="py-1 text-center">Số TC</th>
                    <th className="py-1 text-center">Điểm Hệ 10</th>
                    <th className="py-1 text-center">Điểm Chữ</th>
                    <th className="py-1 text-center">Điểm Hệ 4</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sem.subjects.map((sub) => (
                    <tr key={sub.id}>
                      <td className="py-1 font-mono">{sub.code}</td>
                      <td className="py-1">{sub.name}</td>
                      <td className="py-1 text-center font-semibold">{sub.credits}</td>
                      <td className="py-1 text-center">{sub.score10 !== undefined ? Number(sub.score10).toFixed(1) : '-'}</td>
                      <td className="py-1 text-center font-bold">{sub.scoreLetter || '-'}</td>
                      <td className="py-1 text-center font-semibold">{sub.score4 !== undefined ? Number(sub.score4).toFixed(1) : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-gray-300 flex justify-between text-xs text-gray-500">
        <p>Hệ thống GPA Tracker 4 Năm</p>
        <p>Ngày in: {new Date().toLocaleDateString('vi-VN')}</p>
      </div>
    </div>
  );
};
