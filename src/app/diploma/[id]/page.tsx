import { prisma } from '../../../lib/prisma';
import DiplomaClient from './DiplomaClient';

interface DiplomaPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function DiplomaPage({ params }: DiplomaPageProps) {
  const resolvedParams = await params;
  const studentId = parseInt(resolvedParams.id);

  if (isNaN(studentId)) {
    return <div>Invalid student ID</div>;
  }

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
    return <div>Student not found</div>;
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

  const diplomaData = {
    student,
    gpa,
    totalCredits,
    canGraduate,
    hasAllGrades,
    averageGrade,
    specialty: getSpecialtyFromFaculty(student.faculty.name),
  };

  return <DiplomaClient diplomaData={diplomaData} />;
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

function getSpecialtyFromFaculty(facultyName: string): string {
  const facultySpecialtyMap: { [key: string]: string } = {
    'ბიზნესის ადმინისტრირების ფაკულტეტი': 'ბიზნესის ადმინისტრირება',
    'კომპიუტერული მეცნიერების ფაკულტეტი': 'კომპიუტერული მეცნიერება',
    'სამართლის ფაკულტეტი': 'სამართალი',
    'მედიცინის ფაკულტეტი': 'მედიცინა',
    'ჰუმანიტარული მეცნიერებების ფაკულტეტი': 'ჰუმანიტარული მეცნიერებები',
    'ფიზიკა-მათემატიკის ფაკულტეტი': 'ფიზიკა-მათემატიკა',
    'ბიოლოგიის ფაკულტეტი': 'ბიოლოგია',
    'სოციალურ მეცნიერებათა ფაკულტეტი': 'სოციალური მეცნიერებები',
  };

  return facultySpecialtyMap[facultyName] || 'სპეციალობა არ არის განსაზღვრული';
}