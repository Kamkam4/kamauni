'use client';

import { useState, useEffect } from 'react';
import { updateAllGradesToHighest } from './actions';

interface ScareRectorPageProps {
  params: {
    id: string;
  };
}

export default function ScareRectorPage({ params }: ScareRectorPageProps) {
  const [isScared, setIsScared] = useState(false);
  const [breathing, setBreathing] = useState(true);
  const [showDiploma, setShowDiploma] = useState(false);
  const [progress, setProgress] = useState(0);
  const [clickCount, setClickCount] = useState(0);
  const [isHitting, setIsHitting] = useState(false);

  useEffect(() => {
    // Breathing animation
    const interval = setInterval(() => {
      setBreathing(prev => !prev);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

    const handleCharacterClick = async () => {
    if (isScared) return;

    setIsHitting(true);
    setClickCount(prev => prev + 1);

    // Each click increases progress by 10-15 points
    const increase = Math.floor(Math.random() * 6) + 10; // 10-15 points
    const newProgress = Math.min(progress + increase, 100);
    setProgress(newProgress);

    // Add hit animation effect
    setTimeout(() => setIsHitting(false), 200);

    // If progress reaches 100%, scare the rector
    if (newProgress >= 100 && !isScared) {
      setIsScared(true);

      // Update all grades to highest when rector gets scared
      const resolvedParams = await params;
      try {
        await updateAllGradesToHighest(resolvedParams.id);
      } catch (error) {
        console.error('Failed to update grades:', error);
      }

      setTimeout(() => {
        setShowDiploma(true);
      }, 2000);
    }
  };

  const getDiploma = async () => {
    const resolvedParams = await params;
    window.location.href = `/diploma/${resolvedParams.id}`;
  };

  if (showDiploma) {
    return (
      <div className="min-h-screen bg-linear-to-br from-green-50 via-emerald-50 to-teal-50 flex flex-col justify-center py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-lg shadow-2xl p-8">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-3xl font-bold text-green-600 mb-4">
              გილოცავთ! დერექტორი შეშინდა!
            </h1>
            <p className="text-gray-600 mb-6">
              თქვენი შემაშინებელი ტექსტი იმდენად დამაიმედებელი იყო, რომ დერექტორმა გადაწყვიტა დიპლომი მოგცეთ და ყველა საგანში უმაღლესი შეფასება დაგისვას!
            </p>
            <button
              onClick={getDiploma}
              className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-white bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <svg className="-ml-1 mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              დიპლომის მიღება
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-red-50 via-orange-50 to-yellow-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-red-600 mb-2">დერექტორის შეშინება</h1>
          <p className="text-gray-600">შეაშინე დერექტორი და მიიღე დიპლომი!</p>
        </div>

        {/* Animated Rector Character */}
        <div className="bg-white rounded-lg shadow-2xl p-8 mb-8">
          <div className="text-center">
            {/* Progress Bar */}
            {!isScared && (
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>შეშინების დონე</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ease-out ${
                      progress < 30 ? 'bg-green-400' :
                      progress < 60 ? 'bg-yellow-400' :
                      progress < 90 ? 'bg-orange-400' : 'bg-red-500'
                    }`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {progress < 30 ? 'არაფერი ხდება...' :
                   progress < 60 ? 'ცოტა შეშინდა...' :
                   progress < 90 ? 'იწყებს შეშინებას...' : 'თითქმის შეშინდა!'}
                </div>
              </div>
            )}

            {/* Animated Character */}
            <div className="text-center mb-6">
              <div
                className={`inline-block cursor-pointer transition-transform duration-2000 ${breathing ? 'scale-105' : 'scale-100'} ${isHitting ? 'animate-bounce scale-110' : ''}`}
                onClick={handleCharacterClick}
              >
                <div className="relative">
                  {/* Body */}
                  <div className="w-32 h-40 bg-blue-600 rounded-t-full mx-auto relative">
                    {/* Head */}
                    <div className={`w-24 h-24 bg-yellow-400 rounded-full mx-auto -mt-12 border-4 border-blue-700 transition-all duration-500 ${isScared ? 'animate-bounce' : ''} ${isHitting ? 'bg-red-400' : ''} relative`}>
                      {/* Eyes */}
                      <div className={`absolute w-3 h-3 bg-black rounded-full transition-all duration-300 ${isScared ? 'animate-ping' : ''}`} style={{ top: '35%', left: '30%' }}></div>
                      <div className={`absolute w-3 h-3 bg-black rounded-full transition-all duration-300 ${isScared ? 'animate-ping' : ''}`} style={{ top: '35%', right: '30%' }}></div>
                    </div>
                      {/* Mouth - changes based on scared state */}
                      <div className={`absolute w-4 h-2 border-b-2 border-black transition-all duration-300 ${isScared ? 'border-b-4 scale-125 bg-red-200' : ''}`} style={{ top: '45%', left: '50%', transform: 'translateX(-50%)' }}></div>
                  </div>

                  {/* Arms */}
                  <div className="absolute -left-4 top-8 w-8 h-16 bg-yellow-400 rounded-full transform rotate-12"></div>
                  <div className="absolute -right-4 top-8 w-8 h-16 bg-yellow-400 rounded-full transform -rotate-12"></div>

                  {/* Legs */}
                  <div className="absolute left-2 bottom-0 w-6 h-12 bg-blue-700 rounded-full"></div>
                  <div className="absolute right-2 bottom-0 w-6 h-12 bg-blue-700 rounded-full"></div>

                  {/* Hit effect */}
                  {isHitting && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-red-600 animate-ping">👊</span>
                    </div>
                  )}

                  {/* Speech Bubble when scared */}
                  {isScared && (
                    <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-white border-2 border-gray-300 rounded-lg p-3 shadow-lg animate-pulse">
                      <div className="text-red-600 font-bold text-sm">შეშინდი! დიპლომი მოგცემ!</div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 text-sm text-gray-600">
                {!isScared ? (
                  <p>დაარტყი დერექტორს რომ შეშინდეს! ({clickCount} დარტყმა)</p>
                ) : (
                  <p className="text-red-600 font-bold">დერექტორი შეშინდა! 😱</p>
                )}
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              {isScared ? 'დერექტორი შეშინდა! 😱' : 'დერექტორი გიორგი მაისურაძე'}
            </h3>
            <p className="text-gray-600 mb-6">
              {isScared
                ? 'შენმა დარტყმებმა იმდენად შეშინა დერექტორი, რომ დერექტორმა გადაწყვიტა დიპლომი მოგცეთ და ყველა საგანში უმაღლესი შეფასება დაგისვას!'
                : 'დაარტყი დერექტორს რამდენჯერაც გინდა! რაც უფრო მეტჯერ დაარტყამ, მით უფრო სწრაფად შეივსება პროგრესის ზოლი.'
              }
            </p>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <a
            href="/rector-office"
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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