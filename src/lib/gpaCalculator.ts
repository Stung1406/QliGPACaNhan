import { GradeLetter, Semester, SemesterStats, OverallStats, Subject } from '../types';

export const GRADE_CONVERSION_TABLE: {
  min10: number;
  max10: number;
  letter: GradeLetter;
  score4: number;
  labelVi: string;
}[] = [
  { min10: 9.0, max10: 10.0, letter: 'A+', score4: 4.0, labelVi: 'Xuất sắc' },
  { min10: 8.5, max10: 8.99, letter: 'A', score4: 3.8, labelVi: 'Giỏi' },
  { min10: 8.0, max10: 8.49, letter: 'B+', score4: 3.5, labelVi: 'Khá giỏi' },
  { min10: 7.0, max10: 7.99, letter: 'B', score4: 3.0, labelVi: 'Khá' },
  { min10: 6.5, max10: 6.99, letter: 'C+', score4: 2.5, labelVi: 'Trung bình khá' },
  { min10: 5.5, max10: 6.49, letter: 'C', score4: 2.0, labelVi: 'Trung bình' },
  { min10: 5.0, max10: 5.49, letter: 'D+', score4: 1.5, labelVi: 'Trung bình yếu' },
  { min10: 4.0, max10: 4.99, letter: 'D', score4: 1.0, labelVi: 'Yếu (Đạt)' },
  { min10: 0.0, max10: 3.99, letter: 'F', score4: 0.0, labelVi: 'Kém (Học lại)' },
];

export function convertScore10ToDetails(score10: number): {
  letter: GradeLetter;
  score4: number;
  isPassed: boolean;
} {
  const clamped = Math.max(0, Math.min(10, score10));
  for (const row of GRADE_CONVERSION_TABLE) {
    if (clamped >= row.min10 && clamped <= row.max10) {
      return {
        letter: row.letter,
        score4: row.score4,
        isPassed: row.letter !== 'F',
      };
    }
  }
  return { letter: 'F', score4: 0, isPassed: false };
}

export function convertLetterToScore4(letter: GradeLetter): number {
  const match = GRADE_CONVERSION_TABLE.find((r) => r.letter === letter);
  return match ? match.score4 : 0;
}

export function calculateSemesterStats(semester: Semester): {
  totalCredits: number;
  passedCredits: number;
  gpa4: number;
  gpa10: number;
} {
  const validSubjects = semester.subjects.filter((s) => s.credits > 0 && s.score4 !== undefined);

  if (validSubjects.length === 0) {
    return { totalCredits: 0, passedCredits: 0, gpa4: 0, gpa10: 0 };
  }

  let totalWeighted4 = 0;
  let totalWeighted10 = 0;
  let totalCredits = 0;
  let passedCredits = 0;

  for (const sub of validSubjects) {
    const cred = Number(sub.credits) || 0;
    const s4 = Number(sub.score4) || 0;
    const s10 = sub.score10 !== undefined ? Number(sub.score10) : (s4 * 2.5);

    totalCredits += cred;
    totalWeighted4 += s4 * cred;
    totalWeighted10 += s10 * cred;

    if (sub.scoreLetter !== 'F' && s4 >= 1.0) {
      passedCredits += cred;
    }
  }

  return {
    totalCredits,
    passedCredits,
    gpa4: totalCredits > 0 ? Number((totalWeighted4 / totalCredits).toFixed(2)) : 0,
    gpa10: totalCredits > 0 ? Number((totalWeighted10 / totalCredits).toFixed(2)) : 0,
  };
}

export function calculateAllSemestersStats(semesters: Semester[]): SemesterStats[] {
  const statsList: SemesterStats[] = [];

  let cumWeighted4 = 0;
  let cumWeighted10 = 0;
  let cumCredits = 0;

  for (const sem of semesters) {
    const semStats = calculateSemesterStats(sem);

    // Tính điểm tích lũy theo từng học kỳ liên tiếp
    const validSubs = sem.subjects.filter((s) => s.credits > 0 && s.score4 !== undefined);
    for (const sub of validSubs) {
      const cred = Number(sub.credits) || 0;
      const s4 = Number(sub.score4) || 0;
      const s10 = sub.score10 !== undefined ? Number(sub.score10) : (s4 * 2.5);
      cumCredits += cred;
      cumWeighted4 += s4 * cred;
      cumWeighted10 += s10 * cred;
    }

    const cum4 = cumCredits > 0 ? Number((cumWeighted4 / cumCredits).toFixed(2)) : 0;
    const cum10 = cumCredits > 0 ? Number((cumWeighted10 / cumCredits).toFixed(2)) : 0;

    statsList.push({
      semesterId: sem.id,
      semesterName: sem.name,
      shortName: sem.shortName || `Y${sem.year}S${sem.term}`,
      year: sem.year,
      term: sem.term,
      totalCredits: semStats.totalCredits,
      passedCredits: semStats.passedCredits,
      gpa4: semStats.gpa4,
      gpa10: semStats.gpa10,
      cumulativeGpa4: cum4,
      cumulativeGpa10: cum10,
      cumulativeCredits: cumCredits,
    });
  }

  return statsList;
}

export function calculateOverallStats(semesters: Semester[]): OverallStats {
  let totalCredits = 0;
  let totalPassedCredits = 0;
  let totalWeighted4 = 0;
  let totalWeighted10 = 0;
  let totalSubjects = 0;

  const gradeDistribution: Record<GradeLetter, number> = {
    'A+': 0,
    'A': 0,
    'B+': 0,
    'B': 0,
    'C+': 0,
    'C': 0,
    'D+': 0,
    'D': 0,
    'F': 0,
  };

  const semStatsList = calculateAllSemestersStats(semesters);
  let bestSemester: SemesterStats | undefined;

  for (const sem of semesters) {
    for (const sub of sem.subjects) {
      if (sub.credits > 0 && sub.score4 !== undefined) {
        totalSubjects += 1;
        const cred = Number(sub.credits) || 0;
        const s4 = Number(sub.score4) || 0;
        const s10 = sub.score10 !== undefined ? Number(sub.score10) : (s4 * 2.5);

        totalCredits += cred;
        totalWeighted4 += s4 * cred;
        totalWeighted10 += s10 * cred;

        if (sub.scoreLetter && gradeDistribution[sub.scoreLetter] !== undefined) {
          gradeDistribution[sub.scoreLetter] += 1;
        }

        if (sub.scoreLetter !== 'F' && s4 >= 1.0) {
          totalPassedCredits += cred;
        }
      }
    }
  }

  // Find best semester
  for (const s of semStatsList) {
    if (s.totalCredits > 0) {
      if (!bestSemester || s.gpa4 > bestSemester.gpa4) {
        bestSemester = s;
      }
    }
  }

  const cpa4 = totalCredits > 0 ? Number((totalWeighted4 / totalCredits).toFixed(2)) : 0;
  const cpa10 = totalCredits > 0 ? Number((totalWeighted10 / totalCredits).toFixed(2)) : 0;

  let academicStanding = 'Chưa xếp loại';
  let academicStandingEn = 'Unclassified';
  let rankBadge = 'TOP --';

  if (cpa4 >= 3.6) {
    academicStanding = 'Xuất sắc';
    academicStandingEn = 'Excellent';
    rankBadge = 'TOP 5%';
  } else if (cpa4 >= 3.2) {
    academicStanding = 'Giỏi';
    academicStandingEn = 'Very Good';
    rankBadge = 'TOP 15%';
  } else if (cpa4 >= 2.5) {
    academicStanding = 'Khá';
    academicStandingEn = 'Good';
    rankBadge = 'TOP 40%';
  } else if (cpa4 >= 2.0) {
    academicStanding = 'Trung bình';
    academicStandingEn = 'Average';
    rankBadge = 'TOP 70%';
  } else if (totalCredits > 0) {
    academicStanding = 'Yếu / Kém';
    academicStandingEn = 'Probation';
    rankBadge = 'Warning';
  }

  return {
    cpa4,
    cpa10,
    totalRegisteredCredits: totalCredits,
    totalPassedCredits,
    totalSubjects,
    academicStanding,
    academicStandingEn,
    rankBadge,
    gradeDistribution,
    bestSemester,
  };
}

export function calculateRequiredGpa(
  currentCpa4: number,
  completedCredits: number,
  totalTargetCredits: number,
  targetCpa4: number
): {
  remainingCredits: number;
  requiredGpa4: number;
  isAchievable: boolean;
  messageVi: string;
} {
  const remainingCredits = Math.max(0, totalTargetCredits - completedCredits);

  if (remainingCredits === 0) {
    return {
      remainingCredits: 0,
      requiredGpa4: currentCpa4,
      isAchievable: currentCpa4 >= targetCpa4,
      messageVi: currentCpa4 >= targetCpa4 ? 'Bạn đã hoàn thành đủ tín chỉ và đạt mục tiêu!' : 'Đã đủ tín chỉ nhưng chưa đạt mức mục tiêu.',
    };
  }

  const currentPoints = currentCpa4 * completedCredits;
  const targetTotalPoints = targetCpa4 * totalTargetCredits;
  const neededPoints = targetTotalPoints - currentPoints;
  const requiredGpa4 = Number((neededPoints / remainingCredits).toFixed(2));

  if (requiredGpa4 > 4.0) {
    return {
      remainingCredits,
      requiredGpa4,
      isAchievable: false,
      messageVi: `Cần GPA ${requiredGpa4} (> 4.0) cho ${remainingCredits} tín chỉ còn lại. Mục tiêu này về mặt toán học là không khả thi nếu không học cải thiện điểm môn cũ.`,
    };
  }

  if (requiredGpa4 <= 0) {
    return {
      remainingCredits,
      requiredGpa4: 0,
      isAchievable: true,
      messageVi: `Bạn chắc chắn đạt mục tiêu GPA ${targetCpa4} ngay cả khi các môn còn lại chỉ đạt điểm tối thiểu!`,
    };
  }

  return {
    remainingCredits,
    requiredGpa4,
    isAchievable: true,
    messageVi: `Bạn cần duy trì GPA trung bình tối thiểu ${requiredGpa4} cho ${remainingCredits} tín chỉ còn lại để đạt tốt nghiệp ${targetCpa4}.`,
  };
}
