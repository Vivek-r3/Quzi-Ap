type QuestionProps = {
    question: string;
    options: string[];
    onAnswer: (answer: string) => void;
  };
  
  export default function Question({ question, options, onAnswer }: QuestionProps) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">{question}</h2>
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onAnswer(option)}
            className="block w-full bg-blue-500 text-white py-2 px-4 rounded mb-2 hover:bg-blue-600 transition"
          >
            {option}
          </button>
        ))}
      </div>
    );
  }