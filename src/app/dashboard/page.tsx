import { prisma } from '../../lib/prisma';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import GradesTable from './GradesTable';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const studentId = cookieStore.get('studentId')?.value;

  if (!studentId) {
    redirect('/login');
  }

  const student = await prisma.student.findUnique({
    where: { id: parseInt(studentId) },
    include: {
      faculty: {
        include: {
          subjects: true,
        },
      },
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

  // Create grades if not exist
  const subjects = student.faculty.subjects;
  for (const subject of subjects) {
    const existingGrade = student.grades.find((g: any) => g.subjectId === subject.id);
    if (!existingGrade) {
      const score = Math.floor(Math.random() * 100) + 1;
      await prisma.grade.create({
        data: {
          studentId: student.id,
          subjectId: subject.id,
          score: score,
          grade: getGradeFromScore(score),
        },
      });
    } else {
      // Update existing grade if the letter grade doesn't match the score
      const correctGrade = getGradeFromScore(existingGrade.score || 0);
      if (existingGrade.grade !== correctGrade) {
        await prisma.grade.update({
          where: { id: existingGrade.id },
          data: { grade: correctGrade },
        });
      }
    }
  }

  // Refetch grades
  const updatedStudent = await prisma.student.findUnique({
    where: { id: parseInt(studentId) },
    include: {
      grades: {
        include: {
          subject: true,
        },
      },
    },
  });

  // Check if student can graduate
  const hasAllGrades = updatedStudent!.grades.length > 0;
  const averageGrade = updatedStudent!.grades.length > 0
    ? updatedStudent!.grades.reduce((sum: number, grade: any) => sum + (grade.score || 0), 0) / updatedStudent!.grades.length
    : 0;
  const canGraduate = hasAllGrades && averageGrade >= 51;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">სტუდენტის პანელი</h1>
          <p className="mt-2 text-sm text-gray-600">მოგესალმებით, {student.name} {student.surname}</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
          <div className="bg-linear-to-r from-indigo-500 to-purple-600 px-6 py-4">
            <h3 className="text-lg font-medium text-white">პროფილი</h3>
          </div>
          <div className="px-6 py-6">
            <div className="flex items-center space-x-6">
              <img
                src={student.photo!}
                alt="Profile"
                className="w-24 h-24 rounded-full border-4 border-indigo-200"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                <div>
                  <label className="block text-sm font-medium text-gray-700">სახელი</label>
                  <p className="mt-1 text-sm text-gray-900">{student.name} {student.surname}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">დაბადების თარიღი</label>
                  <p className="mt-1 text-sm text-gray-900">{new Date(student.birthDate).toLocaleDateString('ka-GE')}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">სქესი</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {student.gender === 'MALE' ? 'მამრობითი' : student.gender === 'FEMALE' ? 'მდედრობითი' : 'არ არის მითითებული'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">ფაკულტეტი</label>
                  <p className="mt-1 text-sm text-gray-900">{student.faculty.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">ელ-ფოსტა</label>
                  <p className="mt-1 text-sm text-gray-900">{student.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Grades Section */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-linear-to-r from-green-500 to-teal-600 px-6 py-4">
            <h3 className="text-lg font-medium text-white">შეფასებები</h3>
          </div>
          <div className="px-6 py-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      საგანი
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      კრედიტები
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ქულა
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      შეფასება
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {updatedStudent!.grades.map((grade: any) => (
                    <tr key={grade.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {grade.subject.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {grade.subject.credits}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {grade.score}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          grade.grade === 'A' ? 'bg-green-100 text-green-800' :
                          grade.grade === 'B' ? 'bg-blue-100 text-blue-800' :
                          grade.grade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                          grade.grade === 'D' ? 'bg-orange-100 text-orange-800' :
                          grade.grade === 'E' ? 'bg-purple-100 text-purple-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {grade.grade}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Rector's Office Section */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden mt-8">
          <div className="bg-linear-to-r from-purple-500 to-indigo-600 px-6 py-4">
            <h3 className="text-lg font-medium text-white">დერეხტორის კაბინეტი</h3>
          </div>
          <div className="px-6 py-6">
            <div className="text-center">
              <p className="text-gray-600 mb-4">დიპლომის მისაღებად შედით დერექტორის კაბინეტში</p>
              <a
                href="/rector-office"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <svg className="-ml-1 mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                შედი დერეხტორთან
              </a>
            </div>
          </div>
        </div>

        {/* Diploma Section */}
        {canGraduate && (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden mt-8">
            <div className="bg-linear-to-r from-green-500 to-emerald-600 px-6 py-4">
              <h3 className="text-lg font-medium text-white">დიპლომი</h3>
            </div>
            <div className="px-6 py-6">
              <div className="text-center">
                <p className="text-gray-600 mb-4">გილოცავთ! თქვენ დაასრულეთ უნივერსიტეტი. შეგიძლიათ ნახოთ თქვენი დიპლომი.</p>
                <a
                  href={`/diploma/${student.id}`}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  <svg className="-ml-1 mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  დიპლომის ნახვა
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Logout Button */}
        <div className="mt-8 flex justify-end">
          <a
            href="/logout"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            გასვლა
          </a>
        </div>
      </div>
    </div>
  );
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