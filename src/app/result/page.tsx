"use client";  // Mark this component as a Client Component

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Result() {
  const router = useRouter();
  
  // Update the state type to be 'string | null'
  const [score, setScore] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const queryParams = new URLSearchParams(window.location.search);
      const scoreValue = queryParams.get('score');

      if (!scoreValue) {
        // Redirect to the quiz page if no score is found in query params
        router.push('/science');
      } else {
        setScore(scoreValue);  // This is now valid because score can be a string or null
      }
    }
  }, [router]);

  if (score === null) {
    // Optionally, you can show a loading state here
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800 p-5">
      <h1 className="text-3xl font-bold mb-4">Your Result</h1>
      <p className="text-xl mb-8">
        You scored {score} points!
      </p>
      <a
        href="/science"
        className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold text-lg hover:bg-blue-700 transition"
      >
        Retake Quiz
      </a>
    </div>
  );
}