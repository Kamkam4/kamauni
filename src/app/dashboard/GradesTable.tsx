'use client';

interface Grade {
  id: number;
  subject: {
    name: string;
    credits: number;
  };
  score: number | null;
  grade: string;
}

interface GradesTableProps {
  grades: Grade[];
}

export default function GradesTable({ grades }: GradesTableProps) {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {grades.map((grade) => (
          <li key={grade.id}>
            <div className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{grade.subject.name}</p>
                  <p className="text-sm text-gray-500">კრედიტები: {grade.subject.credits}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <p className="text-sm text-gray-900">ქულა: {grade.score}</p>
                  <p className="text-sm font-medium text-gray-900">შეფასება: {grade.grade}</p>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}