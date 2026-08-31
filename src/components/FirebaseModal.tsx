import React, { useState } from 'react';
import {
  X,
  Database,
  CloudUpload,
  CloudDownload,
  CheckCircle,
  AlertCircle,
  Key,
  ShieldCheck,
  ExternalLink,
  Code2,
} from 'lucide-react';
import {
  FirebaseConfig,
  getStoredFirebaseConfig,
  saveFirebaseConfig,
  syncToFirestore,
  fetchFromFirestore,
} from '../lib/firebase';
import { Semester, StudentProfile } from '../types';

interface FirebaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  semesters: Semester[];
  onDataLoaded: (profile: StudentProfile, semesters: Semester[]) => void;
  onSyncSuccess: () => void;
}

export const FirebaseModal: React.FC<FirebaseModalProps> = ({
  isOpen,
  onClose,
  profile,
  semesters,
  onDataLoaded,
  onSyncSuccess,
}) => {
  const currentConfig = getStoredFirebaseConfig();

  const [apiKey, setApiKey] = useState(currentConfig?.apiKey || '');
  const [projectId, setProjectId] = useState(currentConfig?.projectId || '');
  const [authDomain, setAuthDomain] = useState(currentConfig?.authDomain || '');
  const [storageBucket, setStorageBucket] = useState(currentConfig?.storageBucket || '');
  const [messagingSenderId, setMessagingSenderId] = useState(currentConfig?.messagingSenderId || '');
  const [appId, setAppId] = useState(currentConfig?.appId || '');

  const [searchStudentId, setSearchStudentId] = useState(profile.studentId || '');
  const [isSyncing, setIsSyncing] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim() || !projectId.trim()) {
      setStatusMessage({ type: 'error', text: 'Vui lòng nhập tối thiểu API Key và Project ID của Firebase.' });
      return;
    }

    const config: FirebaseConfig = {
      apiKey: apiKey.trim(),
      projectId: projectId.trim(),
      authDomain: authDomain.trim() || `${projectId.trim()}.firebaseapp.com`,
      storageBucket: storageBucket.trim() || `${projectId.trim()}.appspot.com`,
      messagingSenderId: messagingSenderId.trim(),
      appId: appId.trim(),
    };

    saveFirebaseConfig(config);
    setStatusMessage({ type: 'success', text: 'Đã lưu cấu hình Firebase! Sẵn sàng đồng bộ lên Firestore.' });
  };

  const handleUploadToFirestore = async () => {
    setIsSyncing(true);
    setStatusMessage(null);

    const result = await syncToFirestore(profile, semesters);
    setIsSyncing(false);

    if (result.success) {
      setStatusMessage({
        type: 'success',
        text: `Đã đồng bộ toàn bộ bảng điểm (${semesters.length} học kỳ) lên Firestore thành công!`,
      });
      onSyncSuccess();
    } else {
      setStatusMessage({
        type: 'error',
        text: `Lỗi đồng bộ: ${result.error}. Kiểm tra cấu hình Firebase Rules hoặc API Key.`,
      });
    }
  };

  const handleDownloadFromFirestore = async () => {
    if (!searchStudentId.trim()) {
      setStatusMessage({ type: 'error', text: 'Vui lòng nhập Mã số sinh viên (MSSV) để tải dữ liệu.' });
      return;
    }

    setIsFetching(true);
    setStatusMessage(null);

    const result = await fetchFromFirestore(searchStudentId.trim());
    setIsFetching(false);

    if (result.success && result.data) {
      onDataLoaded(result.data.profile, result.data.semesters);
      setStatusMessage({
        type: 'success',
        text: `Đã tải về thành công hồ sơ ${result.data.profile.name} (${result.data.semesters.length} học kỳ)!`,
      });
    } else {
      setStatusMessage({
        type: 'error',
        text: result.error || 'Không tìm thấy dữ liệu trên Firestore.',
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#12161E] border border-white/20 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6 bg-[#161B22] border-b border-white/10 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#5EEAD4]/10 border border-[#5EEAD4]/30 flex items-center justify-center text-[#5EEAD4]">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[#5EEAD4] text-xs font-bold tracking-widest uppercase font-mono">
                Cơ Sở Dữ Liệu Google
              </span>
              <h3 className="text-xl font-black uppercase text-white mt-0.5">
                Firebase Firestore Sync
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
          {/* Status notification */}
          {statusMessage && (
            <div
              className={`p-4 rounded-2xl flex items-start gap-3 border ${
                statusMessage.type === 'success'
                  ? 'bg-[#5EEAD4]/10 border-[#5EEAD4]/40 text-[#5EEAD4]'
                  : 'bg-red-950/20 border-red-500/40 text-red-400'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              )}
              <p className="text-xs leading-relaxed font-mono">{statusMessage.text}</p>
            </div>
          )}

          {/* Cloud Actions Banner */}
          <div className="bg-[#0A0B0E] border border-white/10 rounded-2xl p-5 space-y-4">
            <span className="text-xs font-mono uppercase text-[#5EEAD4] font-bold">
              Đồng Bộ & Tải Dữ Liệu Đám Mây
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Push to cloud */}
              <button
                onClick={handleUploadToFirestore}
                disabled={isSyncing}
                className="flex flex-col items-center justify-center p-4 rounded-xl bg-[#161B22] border border-white/10 hover:border-[#5EEAD4] text-center transition-all group disabled:opacity-50"
              >
                <CloudUpload className="w-6 h-6 text-[#5EEAD4] mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-white font-mono uppercase">
                  {isSyncing ? 'Đang tải lên...' : 'Lưu Lên Firestore'}
                </span>
                <span className="text-[10px] text-white/40 mt-1">
                  Đồng bộ hồ sơ hiện tại ({profile.studentId})
                </span>
              </button>

              {/* Pull from cloud */}
              <div className="p-4 rounded-xl bg-[#161B22] border border-white/10 flex flex-col justify-between">
                <div>
                  <label className="block text-[10px] uppercase font-mono text-white/50 mb-1">
                    Mã SV Cần Tải Về
                  </label>
                  <input
                    type="text"
                    value={searchStudentId}
                    onChange={(e) => setSearchStudentId(e.target.value)}
                    placeholder="VD: 2021-VNU-IT042"
                    className="w-full bg-[#0A0B0E] border border-white/20 rounded-lg px-2.5 py-1.5 text-xs font-mono text-white uppercase focus:outline-none focus:border-[#5EEAD4]"
                  />
                </div>
                <button
                  onClick={handleDownloadFromFirestore}
                  disabled={isFetching}
                  className="mt-2.5 w-full flex items-center justify-center gap-1.5 bg-white text-black hover:bg-[#5EEAD4] py-1.5 rounded-lg text-xs font-bold font-mono uppercase transition-all disabled:opacity-50"
                >
                  <CloudDownload className="w-3.5 h-3.5" />
                  <span>{isFetching ? 'Đang tải...' : 'Tải Từ Firestore'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Firebase API Keys Config Form */}
          <form onSubmit={handleSaveConfig} className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-white/80 font-bold flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-[#5EEAD4]" />
                Cấu Hình Firebase Config (Tự Do Tùy Chỉnh)
              </span>
              <span className="text-[10px] text-white/40 font-mono">Dự án Firebase của bạn</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase font-mono text-white/60 mb-1">
                  API Key *
                </label>
                <input
                  type="text"
                  required
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-[#0A0B0E] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#5EEAD4]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono text-white/60 mb-1">
                  Project ID *
                </label>
                <input
                  type="text"
                  required
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  placeholder="my-gpa-tracker-app"
                  className="w-full bg-[#0A0B0E] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#5EEAD4]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase font-mono text-white/60 mb-1">
                  Auth Domain (Tùy chọn)
                </label>
                <input
                  type="text"
                  value={authDomain}
                  onChange={(e) => setAuthDomain(e.target.value)}
                  placeholder="project-id.firebaseapp.com"
                  className="w-full bg-[#0A0B0E] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#5EEAD4]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono text-white/60 mb-1">
                  App ID (Tùy chọn)
                </label>
                <input
                  type="text"
                  value={appId}
                  onChange={(e) => setAppId(e.target.value)}
                  placeholder="1:123456789:web:abcdef"
                  className="w-full bg-[#0A0B0E] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#5EEAD4]"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="bg-[#21262D] text-white hover:bg-white hover:text-black border border-white/10 px-4 py-2 rounded-xl text-xs font-mono uppercase font-bold transition-all"
              >
                Lưu Cấu Hình Firebase
              </button>
            </div>
          </form>

          {/* Vercel & Git Deployment Tips */}
          <div className="bg-[#0A0B0E] border border-white/10 rounded-2xl p-4 text-xs space-y-2 text-white/60 font-mono">
            <p className="text-[#5EEAD4] font-bold flex items-center gap-1.5">
              <Code2 className="w-4 h-4" />
              Hướng Dẫn Đẩy Lên Git & Vercel:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-[11px] text-white/70">
              <li>Mã nguồn tuân thủ tiêu chuẩn Next.js / Vite SPA với Tailwind CSS.</li>
              <li>Khi push lên GitHub và kết nối với Vercel, ứng dụng sẽ tự động build và deploy trong 30 giây.</li>
              <li>Dữ liệu luôn được lưu an toàn tại LocalStorage + Realtime Firestore.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
