'use client';

import { useState, useEffect } from 'react';
import { registerStudent } from './actions';

interface Faculty {
  id: number;
  name: string;
}

export default function RegisterPage() {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/faculties')
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch faculties');
        }
        return res.json();
      })
      .then(setFaculties)
      .catch(error => {
        console.error('Error fetching faculties:', error);
        setFaculties([]);
      });
  }, []);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    try {
      const result = await registerStudent(formData);
      alert(`Registration successful! Your email is ${result.email} and password is ${result.password}`);
      // Redirect to dashboard after successful registration
      window.location.href = '/dashboard';
    } catch (error) {
      alert('Registration failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-emerald-50 to-teal-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-emerald-600 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            სტუდენტის რეგისტრაცია
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            შექმენით თქვენი ანგარიში KamaUni-ში
          </p>
        </div>

        <div className="mt-8">
          <div className="bg-white py-8 px-4 shadow-2xl sm:rounded-lg sm:px-10 border border-gray-200">
            <div className="space-y-6">
              <form action={handleSubmit}>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    სახელი
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      className="block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                    />
                    <svg className="absolute left-3 top-2.5 h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>

                <div>
                  <label htmlFor="surname" className="block text-sm font-medium text-gray-700">
                    გვარი
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="surname"
                      name="surname"
                      type="text"
                      required
                      className="block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                    />
                    <svg className="absolute left-3 top-2.5 h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>

                <div>
                  <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">
                    დაბადების თარიღი
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="birthDate"
                      name="birthDate"
                      type="date"
                      required
                      className="block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                    />
                    <svg className="absolute left-3 top-2.5 h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>

                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                    სქესი
                  </label>
                  <div className="mt-1 relative">
                    <select
                      id="gender"
                      name="gender"
                      required
                      className="block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 appearance-none cursor-pointer transition duration-200 hover:border-emerald-400"
                    >
                      <option value="">აირჩიეთ სქესი</option>
                      <option value="MALE" className="bg-emerald-50 text-emerald-900 py-2">მამრობითი</option>
                      <option value="FEMALE" className="bg-emerald-50 text-emerald-900 py-2">მდედრობითი</option>
                    </select>
                    <svg className="absolute left-3 top-2.5 h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <svg className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                <div>
                  <label htmlFor="photo" className="block text-sm font-medium text-gray-700">
                    ფოტო
                  </label>
                  <div className="mt-1">
                    <input
                      id="photo"
                      name="photo"
                      type="file"
                      accept="image/*"
                      required
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="facultyId" className="block text-sm font-medium text-gray-700">
                    ფაკულტეტი
                  </label>
                  <div className="mt-1 relative">
                    <select
                      id="facultyId"
                      name="facultyId"
                      required
                      className="block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 appearance-none cursor-pointer transition duration-200 hover:border-emerald-400"
                    >
                      <option value="">აირჩიეთ ფაკულტეტი</option>
                      {faculties.map(faculty => (
                        <option key={faculty.id} value={faculty.id} className="bg-emerald-50 text-emerald-900 hover:bg-emerald-100 py-2">
                          {faculty.name}
                        </option>
                      ))}
                    </select>
                    <svg className="absolute left-3 top-2.5 h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <svg className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 transition duration-300"
                  >
                    {loading ? 'რეგისტრაცია...' : 'რეგისტრაცია'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}