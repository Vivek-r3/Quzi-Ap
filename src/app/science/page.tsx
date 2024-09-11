"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Questions from '../components/Questions/questions';

const questions = [
  {
    question: 'What is the chemical symbol for water?',
    options: ['H2O', 'O2', 'CO2', 'H2O2'],
    correctAnswer: 'H2O',
  },
  {
    question: 'Which planet is known as the Red Planet?',
    options: ['Earth', 'Mars', 'Jupiter', 'Venus'],
    correctAnswer: 'Mars',
  },
  {
    question: 'What is the powerhouse of the cell?',
    options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Golgi apparatus'],
    correctAnswer: 'Mitochondria',
  },
];

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const router = useRouter();

  const handleAnswer = (answer: string) => {
    if (answer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      router.push(`/result?score=${score + (answer === questions[currentQuestion].correctAnswer ? 1 : 0)}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800 p-5">
      <Questions 
        question={questions[currentQuestion].question} 
        options={questions[currentQuestion].options} 
        onAnswer={handleAnswer} 
      />
    </div>
  );
}