import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  Firestore,
  onSnapshot,
} from 'firebase/firestore';
import { Semester, StudentProfile } from '../types';

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

const STORAGE_KEY_PROFILE = 'gpa_tracker_student_profile_v1';
const STORAGE_KEY_SEMESTERS = 'gpa_tracker_semesters_v1';
const STORAGE_KEY_FIREBASE_CONFIG = 'gpa_tracker_firebase_config_v1';

let firestoreInstance: Firestore | null = null;
let firebaseAppInstance: FirebaseApp | null = null;

export function getStoredFirebaseConfig(): FirebaseConfig | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_FIREBASE_CONFIG);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.apiKey && parsed.projectId) {
      return parsed;
    }
  } catch (err) {
    console.warn('Error reading saved firebase config', err);
  }
  return null;
}

export function saveFirebaseConfig(config: FirebaseConfig | null): void {
  if (!config) {
    localStorage.removeItem(STORAGE_KEY_FIREBASE_CONFIG);
    firestoreInstance = null;
    firebaseAppInstance = null;
    return;
  }
  localStorage.setItem(STORAGE_KEY_FIREBASE_CONFIG, JSON.stringify(config));
  initFirebase(config);
}

export function initFirebase(customConfig?: FirebaseConfig | null): Firestore | null {
  try {
    const config = customConfig || getStoredFirebaseConfig();
    if (!config || !config.apiKey || !config.projectId) {
      return null;
    }

    if (getApps().length === 0) {
      firebaseAppInstance = initializeApp(config);
    } else {
      firebaseAppInstance = getApp();
    }

    firestoreInstance = getFirestore(firebaseAppInstance);
    return firestoreInstance;
  } catch (err) {
    console.error('Firebase initialization error:', err);
    return null;
  }
}

// Local Storage helpers with fallback
export function loadLocalData(
  defaultProfile: StudentProfile,
  defaultSemesters: Semester[]
): { profile: StudentProfile; semesters: Semester[] } {
  try {
    const storedProf = localStorage.getItem(STORAGE_KEY_PROFILE);
    const storedSem = localStorage.getItem(STORAGE_KEY_SEMESTERS);

    const profile = storedProf ? (JSON.parse(storedProf) as StudentProfile) : defaultProfile;
    const semesters = storedSem ? (JSON.parse(storedSem) as Semester[]) : defaultSemesters;

    return { profile, semesters };
  } catch (e) {
    console.warn('Could not read from local storage:', e);
    return { profile: defaultProfile, semesters: defaultSemesters };
  }
}

export function saveLocalData(profile: StudentProfile, semesters: Semester[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
    localStorage.setItem(STORAGE_KEY_SEMESTERS, JSON.stringify(semesters));
  } catch (e) {
    console.warn('Could not write to local storage:', e);
  }
}

// Firebase Cloud Sync
export async function syncToFirestore(
  profile: StudentProfile,
  semesters: Semester[]
): Promise<{ success: boolean; error?: string }> {
  try {
    const db = firestoreInstance || initFirebase();
    if (!db) {
      return { success: false, error: 'Chưa cấu hình Firebase API keys' };
    }

    const docId = profile.studentId ? profile.studentId.replace(/[^a-zA-Z0-9_-]/g, '_') : 'default_student';
    const ref = doc(db, 'gpa_records', docId);

    await setDoc(
      ref,
      {
        profile,
        semesters,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('Error syncing to Firestore:', errorMsg);
    return { success: false, error: errorMsg };
  }
}

export async function fetchFromFirestore(
  studentId: string
): Promise<{ success: boolean; data?: { profile: StudentProfile; semesters: Semester[] }; error?: string }> {
  try {
    const db = firestoreInstance || initFirebase();
    if (!db) {
      return { success: false, error: 'Chưa cấu hình Firebase API keys' };
    }

    const docId = studentId.replace(/[^a-zA-Z0-9_-]/g, '_');
    const ref = doc(db, 'gpa_records', docId);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      const data = snap.data() as { profile: StudentProfile; semesters: Semester[] };
      return { success: true, data };
    } else {
      return { success: false, error: 'Không tìm thấy hồ sơ điểm trên Firestore với MSSV này.' };
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return { success: false, error: errorMsg };
  }
}
