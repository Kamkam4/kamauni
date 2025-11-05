'use client';

import { useState, useEffect } from 'react';
import { loginStudent } from './actions';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const cookies = document.cookie.split(';');
    const studentIdCookie = cookies.find(cookie => cookie.trim().startsWith('studentId='));

    if (studentIdCookie) {
      // User is already logged in, redirect to dashboard
      window.location.href = '/dashboard';
    }
  }, []);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    try {
      const result = await loginStudent(formData);
      if (result.success) {
        window.location.href = '/dashboard';
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      alert('Login failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-emerald-50 to-teal-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-emerald-600 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            შესვლა
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            შედით თქვენს KamaUni ანგარიშში
          </p>
        </div>

        <div className="mt-8">
          <div className="bg-white py-8 px-4 shadow-2xl sm:rounded-lg sm:px-10 border border-gray-200">
            <div className="space-y-6">
              <form action={handleSubmit}>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    ელ-ფოსტა
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                    />
                    <svg className="absolute left-3 top-2.5 h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                    </svg>
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    პაროლი
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      className="block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                    />
                    <svg className="absolute left-3 top-2.5 h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 transition duration-300"
                  >
                    {loading ? 'შესვლა...' : 'შესვლა'}
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