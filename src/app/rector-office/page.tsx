import { prisma } from '../../lib/prisma';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function RectorOfficePage() {
  const cookieStore = await cookies();
  const studentId = cookieStore.get('studentId')?.value;

  if (!studentId) {
    redirect('/login');
  }

  const student = await prisma.student.findUnique({
    where: { id: parseInt(studentId) },
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
    redirect('/login');
  }

  // Check if student has all grades and can graduate
  const hasAllGrades = student.grades.length > 0;
  const averageGrade = student.grades.length > 0
    ? student.grades.reduce((sum: number, grade: any) => sum + (grade.score || 0), 0) / student.grades.length
    : 0;
  const canGraduate = hasAllGrades && averageGrade >= 51; // At least E average

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">დერექტორის კაბინეტი</h1>
          <p className="mt-2 text-sm text-gray-600">მოგესალმებით, {student.name} {student.surname}</p>
        </div>

        {/* Rector's Office */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-linear-to-r from-purple-500 to-indigo-600 px-6 py-4">
            <h3 className="text-lg font-medium text-white">დერექტორის მიღება</h3>
          </div>
          <div className="px-6 py-6">
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">დერეხტორი</h4>
              <p className="text-gray-600">ბატონი გიორგი მაისურაძე</p>
            </div>

            {canGraduate ? (
              <div className="text-center">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-center mb-2">
                    <svg className="w-6 h-6 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-green-800 font-medium">გილოცავთ! თქვენ შეგიძლიათ დიპლომის მიღება</span>
                  </div>
                  <p className="text-green-700 text-sm">
                    საშუალო ქულა: {averageGrade.toFixed(1)} | შეფასება: {getGradeFromScore(averageGrade)}
                  </p>
                </div>

                <a
                  href={`/diploma/${student.id}`}
                  className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-white bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  <svg className="-ml-1 mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  დიპლომის მიღება
                </a>
              </div>
            ) : (
              <div className="text-center">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-center mb-2">
                    <svg className="w-6 h-6 text-yellow-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <span className="text-yellow-800 font-medium">დიპლომის მიღება ჯერ არ არის შესაძლებელი</span>
                  </div>
                  <p className="text-yellow-700 text-sm">
                    {!hasAllGrades
                      ? "თქვენ არ გაქვთ ყველა საგნის შეფასება"
                      : `საშუალო ქულა: ${averageGrade.toFixed(1)} (საჭიროა მინიმუმ 51 ქულა)`
                    }
                  </p>
                </div>

                <a
                  href={`/scare-rector/${student.id}`}
                  className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-white bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  <svg className="-ml-1 mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  შეაშინე დერექტორი
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Back to Dashboard */}
        <div className="mt-8 flex justify-start">
          <a
            href="/dashboard"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            უკან დაბრუნება
          </a>
        </div>
      </div>
    </div>
  );
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

function getGradeFromScore(score: number): string {
  if (score >= 91) return 'A';
  if (score >= 81) return 'B';
  if (score >= 71) return 'C';
  if (score >= 61) return 'D';
  if (score >= 51) return 'E';
  if (score >= 41) return 'FX';
  return 'F';
}

function getGradeFromGPA(gpa: number): string {
  if (gpa >= 3.67) return 'სახელოვანო';
  if (gpa >= 3.33) return 'ძალიან კარგი';
  if (gpa >= 3.00) return 'კარგი';
  if (gpa >= 2.67) return 'ზოგადად კარგი';
  if (gpa >= 2.33) return 'საშუალო';
  return 'დაბალი';
}