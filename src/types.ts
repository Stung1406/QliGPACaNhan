export type GradeLetter = 'A' | 'B' | 'C' | 'D' | 'F';

export type SubjectCategory = 'daicuong' | 'coso' | 'chuyennganh' | 'tuchon' | 'thuctap_khoaluan' | 'khac';

export interface Subject {
  id: string;
  code: string;
  name: string;
  credits: number;
  score10?: number; // Điểm hệ 10 (0 - 10)
  scoreLetter?: GradeLetter;
  score4?: number; // Điểm hệ 4 (0.0 - 4.0)
  category?: SubjectCategory;
  note?: string;
  isPassed?: boolean;
}

export interface Semester {
  id: string;
  year: number; // 1, 2, 3, 4
  term: 1 | 2 | 3; // 1: HK1, 2: HK2, 3: HK Hè
  name: string; // e.g. "Học kỳ 1 - Năm 1 (2021-2022)"
  shortName: string; // e.g. "HK1 - N1"
  academicYear: string; // e.g. "2021 - 2022"
  subjects: Subject[];
  targetGpa?: number;
  isCompleted?: boolean;
}

export interface StudentProfile {
  name: string;
  studentId: string;
  university: string;
  major: string;
  classCohort: string;
  startYear: number;
  totalProgramCredits: number;
  targetCpa: number;
  academicStandingNote?: string;
}

export interface SemesterStats {
  semesterId: string;
  semesterName: string;
  shortName: string;
  year: number;
  term: number;
  totalCredits: number;
  passedCredits: number;
  gpa4: number;
  gpa10: number;
  cumulativeGpa4: number;
  cumulativeGpa10: number;
  cumulativeCredits: number;
}

export interface OverallStats {
  cpa4: number;
  cpa10: number;
  totalRegisteredCredits: number;
  totalPassedCredits: number;
  totalSubjects: number;
  academicStanding: string;
  academicStandingEn: string;
  rankBadge: string;
  gradeDistribution: Record<GradeLetter, number>;
  bestSemester?: SemesterStats;
}
