'use client';

interface DiplomaData {
  student: any;
  gpa: number;
  totalCredits: number;
  canGraduate: boolean;
  hasAllGrades: boolean;
  averageGrade: number;
  specialty: string;
}

export default function DiplomaClient({ diplomaData }: { diplomaData: DiplomaData }) {
  const { student, gpa, totalCredits, canGraduate, hasAllGrades, averageGrade, specialty } = diplomaData;

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 no-print">
      <div className="max-w-5xl mx-auto">
        {/* Status Banner */}
        {!canGraduate && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-yellow-800 font-medium">დიპლომის პრევიუ</p>
                <p className="text-yellow-700 text-sm">
                  {!hasAllGrades
                    ? "ეს არის დიპლომის პრევიუ. სრული დიპლომისთვის საჭიროა ყველა საგნის შეფასება."
                    : `საშუალო ქულა: ${averageGrade.toFixed(1)} (საჭიროა მინიმუმ 51 ქულა სრული დიპლომისთვის)`
                  }
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Diploma Display */}
        <div className="bg-white shadow-2xl relative overflow-hidden diploma-container" style={{ aspectRatio: '1.414/1' }}>
          {/* Decorative Border */}
          <div className="absolute inset-0 border-16 border-double border-amber-600"></div>
          <div className="absolute inset-2 border-4 border-amber-500"></div>
          <div className="absolute inset-4 border-2 border-amber-400"></div>

          {/* Watermark */}
          <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
            <div className="text-9xl font-bold text-gray-300 transform rotate-45">
              დიპლომი
            </div>
          </div>

          <div className="relative h-full p-12 flex flex-col">
            {/* Header Section */}
            <div className="text-center mb-8">
              <div className="mb-6">
                <h1 className="text-4xl font-bold text-amber-800 mb-2">კამკამიძის სახელობის უნივერსიტეტი</h1>
                <div className="w-32 h-1 bg-amber-600 mx-auto"></div>
              </div>

              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                {canGraduate ? 'ბაკალავრის დიპლომი' : 'დიპლომის პრევიუ'}
              </h2>
              <p className="text-xl text-gray-700">
                {canGraduate ? 'აკადემიური ხარისხის დამადასტურებელი დოკუმენტი' : 'სტუდენტის სტატუსის დამადასტურებელი დოკუმენტი'}
              </p>
            </div>

            {/* University Seal */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-32 h-32 border-4 border-red-600 rounded-full flex items-center justify-center bg-red-50 shadow-lg">
                  <div className="text-center text-red-700 font-bold text-sm">
                    <div className="text-2xl mb-1">🇬🇪</div>
                    <div>საქართველოს</div>
                    <div>სახელმწიფო</div>
                    <div>დიპლომი</div>
                  </div>
                </div>
                <div className="absolute -inset-2 border-2 border-red-400 rounded-full"></div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col justify-center text-center space-y-6">
              <div className="space-y-4">
                <p className="text-lg text-gray-700">ეს დოკუმენტი ადასტურებს, რომ</p>

                {/* Student Name - Prominent */}
                <div className="my-8">
                  <div className={`inline-block border-4 border-double ${canGraduate ? 'border-amber-600 bg-amber-50' : 'border-gray-400 bg-gray-50'} px-8 py-4`}>
                    <h3 className="text-3xl font-bold text-gray-900 uppercase tracking-wider">
                      {student.name} {student.surname}
                    </h3>
                  </div>
                </div>

                <div className="space-y-3 text-lg text-gray-700">
                  <p>წარმატებით დაასრულა სწავლა</p>
                  <p className="font-semibold text-xl text-blue-800">{getFacultyNameInLocative(student.faculty.name)}</p>
                  <p>და მიენიჭა <span className={`font-bold ${canGraduate ? 'text-amber-800' : 'text-gray-600'}`}>{canGraduate ? 'ბაკალავრის აკადემიური ხარისხი' : 'სტუდენტის სტატუსი (პრევიუ)'}</span></p>
                  <p className="text-base text-gray-600">სპეციალობა: {specialty}</p>
                </div>
              </div>

              {/* Academic Information */}
              <div className={`bg-gray-50 rounded-lg p-6 border-2 ${canGraduate ? 'border-gray-200' : 'border-gray-300'} max-w-md mx-auto`}>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">GPA</p>
                    <p className="text-2xl font-bold text-green-600">{gpa.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">ხარისხი</p>
                    <p className={`text-lg font-bold ${canGraduate ? 'text-blue-600' : 'text-gray-500'}`}>{canGraduate ? getGradeFromGPA(gpa) : 'პრევიუ'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">კრედიტები</p>
                    <p className="text-2xl font-bold text-purple-600">{totalCredits}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Signatures and Details */}
            <div className="mt-8">
              {/* Signatures */}
              <div className="grid grid-cols-2 gap-16 mb-8">
                <div className="text-center">
                  <div className="border-b-2 border-gray-600 mb-2 h-12"></div>
                  <p className="font-bold text-gray-800">რექტორი</p>
                  <p className="text-sm text-gray-600">გიორგი მაისურაძე</p>
                  <p className="text-xs text-gray-500">დოქტორი, პროფესორი</p>
                </div>
                <div className="text-center">
                  <div className="border-b-2 border-gray-600 mb-2 h-12"></div>
                  <p className="font-bold text-gray-800">დეკანი</p>
                  <p className="text-sm text-gray-600">{student.faculty.name}ს დეკანი</p>
                  <p className="text-xs text-gray-500">დოქტორი, ასოცირებული პროფესორი</p>
                </div>
              </div>

              {/* Footer Details */}
              <div className="grid grid-cols-2 gap-8 text-center text-sm">
                <div>
                  <p className="text-gray-600">გაცემის თარიღი</p>
                  <p className="font-bold text-gray-800">{new Date().toLocaleDateString('ka-GE', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</p>
                </div>
                <div>
                  <p className="text-gray-600">რეგისტრაციის ნომერი</p>
                  <p className="font-bold text-gray-800">KU-{student.id.toString().padStart(6, '0')}</p>
                </div>
              </div>

              {/* Official Stamp */}
              <div className="flex justify-center mt-6">
                <div className="relative">
                  <div className="w-20 h-20 border-3 border-red-600 rounded-full flex items-center justify-center bg-red-50">
                    <div className="text-red-600 font-bold text-xs text-center leading-tight">
                      <div>სახელმწიფო</div>
                      <div>დიპლომი</div>
                      <div>№{student.id.toString().padStart(6, '0')}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-center space-x-6 no-print">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            <svg className="-ml-1 mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            {canGraduate ? 'დაბეჭდვა / შენახვა' : 'დაბეჭდვა (პრევიუ)'}
          </button>

          {!canGraduate && (
            <div className="inline-flex items-center px-6 py-3 bg-yellow-100 border border-yellow-300 text-yellow-800 text-sm font-medium rounded-lg">
              <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              სრული დიპლომისთვის საჭიროა უკეთესი ქულები
            </div>
          )}

          <a
            href="/dashboard"
            className="inline-flex items-center px-8 py-4 border-2 border-gray-300 text-lg font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            <svg className="-ml-1 mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
            </svg>
            დაბრუნება დაფაზე
          </a>
        </div>

        {/* Print Styles */}
        <style dangerouslySetInnerHTML={{
          __html: `
            @media print {
              /* Hide everything except the diploma container */
              body > *:not(.diploma-container) { display: none !important; }
              
              /* Show only the diploma */
              .diploma-container { 
                display: block !important; 
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
                width: 100vw !important;
                height: 100vh !important;
                margin: 0 !important;
                padding: 0 !important;
                box-shadow: none !important;
              }
              
              /* Hide Next.js development UI */
              #__next-build-watcher,
              #__next-prerender-indicator,
              #__next-error-overlay,
              #__next-error-overlay *,
              [data-nextjs-toast-errors],
              [data-nextjs-toast-errors] *,
              .nextjs-toast-errors,
              .nextjs-toast-errors *,
              .nextjs-portal,
              .nextjs-portal *,
              .nextjs-dev-tools,
              .nextjs-dev-tools *,
              [data-nextjs-dev-tools],
              [data-nextjs-dev-tools] *,
              [data-nextjs-dialog],
              [data-nextjs-dialog] *,
              .nextjs-container,
              .nextjs-container *,
              #__next-error-boundary,
              #__next-error-boundary * { 
                display: none !important; 
                visibility: hidden !important;
              }
              
              /* Hide any overlays or modals */
              .overlay, .modal, .popup, .dialog {
                display: none !important;
              }
              
              /* Ensure diploma content is visible */
              .diploma-container * {
                display: block !important;
                visibility: visible !important;
              }
              
              /* Page setup */
              @page { 
                margin: 0.5in; 
                size: A4 landscape; 
              }
              
              html, body { 
                background: white !important; 
                margin: 0 !important;
                padding: 0 !important;
                overflow: visible !important;
                height: auto !important;
              }
              
              /* Preserve colors in print */
              * { 
                -webkit-print-color-adjust: exact !important; 
                color-adjust: exact !important; 
                print-color-adjust: exact !important;
              }
            }
          `
        }} />
      </div>
    </div>
  );
}

function getGradeFromGPA(gpa: number): string {
  if (gpa >= 3.67) return 'სახელოვანო';
  if (gpa >= 3.33) return 'ძალიან კარგი';
  if (gpa >= 3.00) return 'კარგი';
  if (gpa >= 2.67) return 'ზოგადად კარგი';
  if (gpa >= 2.33) return 'საშუალო';
  return 'დაბალი';
}

function getFacultyNameInLocative(facultyName: string): string {
  // Remove the final 'ი' and add 'ში' for proper Georgian locative case
  return facultyName.replace(/ი$/, '') + 'ში';
}