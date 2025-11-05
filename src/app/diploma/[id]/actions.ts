import { prisma } from '../../../lib/prisma';

export async function getStudentDiploma(studentId: number) {
  try {
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        faculty: true,
        grades: {
          include: {
            subject: true,
          },
        },
      },
    });

    if (!student) {
      return null;
    }

    // Calculate GPA
    const totalCredits = student.grades.reduce((sum: number, grade: any) => sum + grade.subject.credits, 0);
    const weightedSum = student.grades.reduce((sum: number, grade: any) => {
      const gradePoints = getGradePoints(grade.grade);
      return sum + (gradePoints * grade.subject.credits);
    }, 0);
    const gpa = totalCredits > 0 ? weightedSum / totalCredits : 0;

    // Check graduation eligibility
    const hasAllGrades = student.grades.length > 0;
    const averageGrade = student.grades.length > 0
      ? student.grades.reduce((sum: number, grade: any) => sum + (grade.score || 0), 0) / student.grades.length
      : 0;
    const canGraduate = hasAllGrades && averageGrade >= 51;

    return {
      student,
      gpa,
      totalCredits,
      canGraduate,
      hasAllGrades,
      averageGrade,
    };
  } catch (error) {
    console.error('Error fetching student diploma:', error);
    return null;
  }
}

function getGradePoints(grade: string): number {
  switch (grade) {
    case 'A': return 4.0;
    case 'B': return 3.5;
    case 'C': return 3.0;
    case 'D': return 2.5;
    case 'E': return 2.0;
    case 'FX': return 1.0;
    case 'F': return 0.0;
    default: return 0.0;
  }
}

function getGradeFromGPA(gpa: number): string {
  if (gpa >= 3.67) return 'სახელოვანო';
  if (gpa >= 3.33) return 'ძალიან კარგი';
  if (gpa >= 3.00) return 'კარგი';
  if (gpa >= 2.67) return 'ზოგადად კარგი';
  if (gpa >= 2.33) return 'საშუალო';
  return 'დაბალი';
}