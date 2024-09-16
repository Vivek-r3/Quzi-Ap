"use client";

import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from './firebase';  // Make sure the path is correct for your firebase config
import { onAuthStateChanged, signOut, User } from 'firebase/auth';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/login');  // Redirect to login page after signout
  };
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
      <Head>
        <title>Quiz Website</title>
        <meta name="description" content="Test your knowledge with our quiz" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="flex justify-between items-center p-5">
        <h1 className="text-3xl font-bold">QuizMaster</h1>
        <nav>
          <a href="#quizzes" className="mx-4 hover:underline">Quizzes</a>
          <a href="#about" className="mx-4 hover:underline">About</a>
          <a href="#contact" className="mx-4 hover:underline">Contact</a>
        </nav>
        {user ? (
          <div className="flex items-center">
            <p className="mr-4">Hello, {user.displayName || user.email}</p>
            <button 
              onClick={handleSignOut} 
              className="bg-white text-indigo-600 px-4 py-2 rounded-full font-semibold hover:bg-indigo-600 hover:text-white transition"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <a
            href="/login"
            className="bg-white text-indigo-600 px-6 py-3 rounded-full font-semibold text-lg hover:bg-indigo-600 hover:text-white transition"
          >
            Login
          </a>
        )}
      </header>

      <main className="flex flex-col items-center justify-center flex-1 p-10 text-center">
        <h2 className="text-5xl font-extrabold mb-4">Are You Ready to Challenge Your Knowledge?</h2>
        <p className="text-xl mb-8">Take our quizzes and see how much you know!</p>
        <a
          href=""
          className="bg-white text-indigo-600 px-6 py-3 rounded-full font-semibold text-lg hover:bg-indigo-600 hover:text-white transition"
        >
          Start Quiz
        </a>
      </main>

      <section id="quizzes" className="p-10">
        <h3 className="text-4xl font-bold mb-6">Featured Quizzes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white text-black p-6 rounded-lg shadow-lg">
            <h4 className="text-2xl font-bold mb-4">General Knowledge</h4>
            <p>Test your general knowledge with this quiz.</p>
            <a href="#" className="text-indigo-500 mt-4 inline-block">Take Quiz</a>
          </div>
          <div className="bg-white text-black p-6 rounded-lg shadow-lg">
            <h4 className="text-2xl font-bold mb-4">Science Quiz</h4>
            <p>How much do you know about science?</p>
            <a href="./science" className="text-indigo-500 mt-4 inline-block">Take Quiz</a>
          </div>
          <div className="bg-white text-black p-6 rounded-lg shadow-lg">
            <h4 className="text-2xl font-bold mb-4">History Quiz</h4>
            <p>See how well you know your history.</p>
            <a href="#" className="text-indigo-500 mt-4 inline-block">Take Quiz</a>
          </div>
        </div>
      </section>

      <footer className="bg-gray-800 text-white p-6 mt-auto">
        <div className="flex justify-between items-center">
          <p>&copy; 2024 QuizMaster. All rights reserved.</p>
          
        </div>
      </footer>
    </div>
  );
}