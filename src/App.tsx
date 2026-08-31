import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  StudentProfile,
  Semester,
  Subject,
  OverallStats,
  SemesterStats,
} from './types';
import {
  INITIAL_STUDENT_PROFILE,
  INITIAL_SEMESTERS_DATA,
} from './lib/sampleData';
import {
  calculateOverallStats,
  calculateAllSemestersStats,
} from './lib/gpaCalculator';
import {
  loadLocalData,
  saveLocalData,
  getStoredFirebaseConfig,
  syncToFirestore,
} from './lib/firebase';
import { Header } from './components/Header';
import { CumulativeStats } from './components/CumulativeStats';
import { SemesterChart } from './components/SemesterChart';
import { GradeDistribution } from './components/GradeDistribution';
import { SemesterManager } from './components/SemesterManager';
import { AddSubjectModal } from './components/AddSubjectModal';
import { AddSemesterModal } from './components/AddSemesterModal';
import { TargetGpaModal } from './components/TargetGpaModal';
import { FirebaseModal } from './components/FirebaseModal';
import { ProfileEditModal } from './components/ProfileEditModal';
import { ExportModal } from './components/ExportModal';
import { PrintableTranscript } from './components/PrintableTranscript';
import { CheckCircle2, CloudUpload } from 'lucide-react';

export default function App() {
  // Initialize state from LocalStorage fallback
  const [profile, setProfile] = useState<StudentProfile>(() => {
    const loaded = loadLocalData(INITIAL_STUDENT_PROFILE, INITIAL_SEMESTERS_DATA);
    return loaded.profile;
  });

  const [semesters, setSemesters] = useState<Semester[]>(() => {
    const loaded = loadLocalData(INITIAL_STUDENT_PROFILE, INITIAL_SEMESTERS_DATA);
    return loaded.semesters;
  });

  const [isCloudSynced, setIsCloudSynced] = useState<boolean>(() => {
    return !!getStoredFirebaseConfig();
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = (msg: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Modals state
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isTargetOpen, setIsTargetOpen] = useState(false);
  const [isFirebaseOpen, setIsFirebaseOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isAddSemesterOpen, setIsAddSemesterOpen] = useState(false);

  // Add/Edit Subject Modal state
  const [subjectModalState, setSubjectModalState] = useState<{
    isOpen: boolean;
    semesterId: string;
    semesterName: string;
    initialData: Subject | null;
  }>({
    isOpen: false,
    semesterId: '',
    semesterName: '',
    initialData: null,
  });

  // Calculate live stats
  const overallStats: OverallStats = calculateOverallStats(semesters);
  const semesterStatsList: SemesterStats[] = calculateAllSemestersStats(semesters);

  // Persist locally on changes & auto-sync to Firebase if configured
  useEffect(() => {
    saveLocalData(profile, semesters);
    if (getStoredFirebaseConfig()) {
      syncToFirestore(profile, semesters).then((res) => {
        if (res.success) {
          setIsCloudSynced(true);
        }
      });
    }
  }, [profile, semesters]);

  // Confetti trigger if GPA is >= 3.6
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#5EEAD4', '#38BDF8', '#FFFFFF'],
      });
    } catch (e) {
      // ignore
    }
  };

  // Add/Edit Subject handler
  const handleOpenAddSubject = (semesterId: string) => {
    const targetSem = semesters.find((s) => s.id === semesterId);
    setSubjectModalState({
      isOpen: true,
      semesterId,
      semesterName: targetSem ? targetSem.name : 'Học kỳ',
      initialData: null,
    });
  };

  const handleOpenEditSubject = (semesterId: string, subject: Subject) => {
    const targetSem = semesters.find((s) => s.id === semesterId);
    setSubjectModalState({
      isOpen: true,
      semesterId,
      semesterName: targetSem ? targetSem.name : 'Học kỳ',
      initialData: subject,
    });
  };

  const handleSaveSubject = (savedSubject: Subject) => {
    const { semesterId, initialData } = subjectModalState;
    setSemesters((prevSemesters) =>
      prevSemesters.map((sem) => {
        if (sem.id !== semesterId) return sem;

        if (initialData) {
          // Edit existing subject
          return {
            ...sem,
            subjects: sem.subjects.map((sub) =>
              sub.id === initialData.id ? savedSubject : sub
            ),
          };
        } else {
          // Add new subject
          return {
            ...sem,
            subjects: [...sem.subjects, savedSubject],
          };
        }
      })
    );

    showToast(
      initialData
        ? `Đã cập nhật môn "${savedSubject.name}" (${savedSubject.credits} TC)`
        : `Đã thêm môn "${savedSubject.name}" (${savedSubject.credits} TC)`
    );

    if (savedSubject.scoreLetter === 'A+' || savedSubject.score4 === 4.0) {
      triggerConfetti();
    }
  };

  const handleDeleteSubject = (semesterId: string, subjectId: string) => {
    const targetSem = semesters.find((s) => s.id === semesterId);
    const targetSub = targetSem?.subjects.find((sub) => sub.id === subjectId);
    if (!window.confirm(`Bạn có chắc chắn muốn xóa môn "${targetSub?.name || 'này'}"?`)) return;

    setSemesters((prev) =>
      prev.map((sem) => {
        if (sem.id !== semesterId) return sem;
        return {
          ...sem,
          subjects: sem.subjects.filter((sub) => sub.id !== subjectId),
        };
      })
    );
    showToast(`Đã xóa môn "${targetSub?.name || 'học'}"`);
  };

  // Add Semester
  const handleSaveSemester = (newSem: Semester) => {
    setSemesters((prev) => [...prev, newSem]);
    showToast(`Đã thêm ${newSem.name}`);
  };

  // Delete Semester
  const handleDeleteSemester = (semesterId: string) => {
    if (!window.confirm('Xác nhận xóa học kỳ này và toàn bộ môn học bên trong?')) return;
    setSemesters((prev) => prev.filter((s) => s.id !== semesterId));
    showToast('Đã xóa học kỳ');
  };

  // Reset to initial sample data
  const handleResetSampleData = () => {
    if (window.confirm('Khôi phục lại dữ liệu bảng điểm 4 năm mẫu? Các thay đổi chưa lưu sẽ được đặt lại.')) {
      setProfile(INITIAL_STUDENT_PROFILE);
      setSemesters(INITIAL_SEMESTERS_DATA);
      showToast('Đã khôi phục dữ liệu mẫu');
    }
  };

  // Scroll to semester on chart click
  const handleSelectSemester = (semId: string) => {
    const el = document.getElementById(`semester-${semId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('ring-2', 'ring-[#5EEAD4]');
      setTimeout(() => {
        el.classList.remove('ring-2', 'ring-[#5EEAD4]');
      }, 1800);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0B0E] text-[#E0E0E0] font-sans selection:bg-[#5EEAD4] selection:text-black">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#12161E] border border-[#5EEAD4]/60 text-white px-4 py-3 rounded-2xl shadow-2xl animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-[#5EEAD4]" />
          <span className="text-xs font-mono font-bold text-white">{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="print:hidden w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-10 flex flex-col space-y-10">
        {/* Header */}
        <Header
          profile={profile}
          onOpenProfile={() => setIsProfileOpen(true)}
          onOpenTargetModal={() => setIsTargetOpen(true)}
          onOpenFirebaseModal={() => setIsFirebaseOpen(true)}
          onOpenExportModal={() => setIsExportOpen(true)}
          onOpenAddSemesterModal={() => setIsAddSemesterOpen(true)}
          isCloudSynced={isCloudSynced}
        />

        {/* Top 2-Column Section: Cumulative Stats + Semester Progress Chart */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Huge CPA Display & Metrics */}
          <div className="lg:col-span-5 flex flex-col">
            <CumulativeStats
              stats={overallStats}
              profile={profile}
              onOpenAddSemester={() => setIsAddSemesterOpen(true)}
              onOpenExport={() => setIsExportOpen(true)}
              onOpenTarget={() => setIsTargetOpen(true)}
              onResetSampleData={handleResetSampleData}
            />
          </div>

          {/* Right Column: Visual Chart & Grade Distribution */}
          <div className="lg:col-span-7 flex flex-col space-y-8">
            <SemesterChart
              semesterStats={semesterStatsList}
              profile={profile}
              onSelectSemester={handleSelectSemester}
            />

            <GradeDistribution stats={overallStats} />
          </div>
        </main>

        {/* Semester by Semester Curriculum Manager */}
        <section className="pt-4">
          <SemesterManager
            semesters={semesters}
            onAddSubject={handleOpenAddSubject}
            onEditSubject={handleOpenEditSubject}
            onDeleteSubject={handleDeleteSubject}
            onDeleteSemester={handleDeleteSemester}
            onOpenAddSemester={() => setIsAddSemesterOpen(true)}
          />
        </section>

        {/* Footer */}
        <footer className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-white/40 uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#5EEAD4]"></span>
            <span>&copy; Personal Academic Performance System / Next.js / Firebase</span>
          </div>
          <div className="flex items-center gap-4">
            <span>MSSV: {profile.studentId}</span>
            <span>•</span>
            <span>Học lực: {overallStats.academicStanding}</span>
          </div>
        </footer>
      </div>

      {/* Printable Sheet (Shown only during window.print()) */}
      <PrintableTranscript
        profile={profile}
        semesters={semesters}
        stats={overallStats}
      />

      {/* Modals */}
      <AddSubjectModal
        isOpen={subjectModalState.isOpen}
        onClose={() => setSubjectModalState((prev) => ({ ...prev, isOpen: false }))}
        onSave={handleSaveSubject}
        semesterId={subjectModalState.semesterId}
        semesterName={subjectModalState.semesterName}
        initialData={subjectModalState.initialData}
      />

      <AddSemesterModal
        isOpen={isAddSemesterOpen}
        onClose={() => setIsAddSemesterOpen(false)}
        onSave={handleSaveSemester}
        existingCount={semesters.length}
      />

      <TargetGpaModal
        isOpen={isTargetOpen}
        onClose={() => setIsTargetOpen(false)}
        stats={overallStats}
        profile={profile}
        onUpdateProfileTarget={(targetCpa, totalCredits) => {
          setProfile((prev) => ({
            ...prev,
            targetCpa,
            totalProgramCredits: totalCredits,
          }));
        }}
      />

      <FirebaseModal
        isOpen={isFirebaseOpen}
        onClose={() => setIsFirebaseOpen(false)}
        profile={profile}
        semesters={semesters}
        onDataLoaded={(newProfile, newSemesters) => {
          setProfile(newProfile);
          setSemesters(newSemesters);
          showToast(`Đã tải dữ liệu ${newProfile.name} từ Firebase`);
        }}
        onSyncSuccess={() => {
          setIsCloudSynced(true);
          showToast('Đã đồng bộ lên Firebase thành công!');
        }}
      />

      <ProfileEditModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={profile}
        onSave={(updated) => {
          setProfile(updated);
          showToast('Đã lưu thông tin sinh viên');
        }}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        profile={profile}
        semesters={semesters}
        stats={overallStats}
        onImportData={(newProfile, newSemesters) => {
          setProfile(newProfile);
          setSemesters(newSemesters);
          showToast('Đã nhập dữ liệu thành công');
        }}
      />
    </div>
  );
}
