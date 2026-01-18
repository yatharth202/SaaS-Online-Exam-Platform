import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

  function ExamScreen() {
    const {examId} = useParams();
    const [question, setQuestion] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [visited, setVisited] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchQuestions = async () => {
        try {

        const res = api.get(`/exams/${examId}/questions`);
        setQuestion(res.data.data);
      } catch (err) {
        console.error(err)
      }
      finally{
        setLoading(false)
      }
      }
      fetchQuestions();
    },{examId})
  

  return (
    <div className="min-h-screen bg-slate-100 p-6 flex gap-6">
      {/* LEFT: QUESTION */}
      <div className="flex-1 bg-white rounded-xl p-6 shadow">
        <h2 className="text-lg font-semibold mb-4">
          Question {currentIndex + 1} of {questions.length}
        </h2>

        <p className="font-medium mb-4">
          {currentIndex + 1}. {currentQuestion.questionText}
        </p>

        {currentQuestion.options.map((opt, idx) => (
          <label key={idx} className="block mb-2 cursor-pointer">
            <input
              type="radio"
              name={currentQuestion._id}
              className="mr-2"
              checked={answers[currentQuestion._id] === idx}
              onChange={() => handleOptionChange(idx)}
            />
            {opt}
          </label>
        ))}

        <div className="flex justify-between mt-6">
          <button
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((i) => i - 1)}
            className="px-4 py-2 bg-slate-300 rounded disabled:opacity-50"
          >
            Previous
          </button>

          <button
            disabled={currentIndex === questions.length - 1}
            onClick={() => setCurrentIndex((i) => i + 1)}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* RIGHT: QUESTION PALETTE */}
      <div className="w-64 bg-white rounded-xl p-4 shadow">
        <h3 className="font-semibold mb-4">Questions</h3>

        <div className="grid grid-cols-5 gap-2">
          {questions.map((q, idx) => (
            <button
              key={q._id}
              onClick={() => setCurrentIndex(idx)}
              className={`h-8 w-8 rounded text-sm font-semibold
                ${getStatusColor(q)}
                ${answers[q._id] !== undefined ? "text-white" : "text-black"}
              `}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        {/* LEGEND */}
        <div className="mt-6 text-sm space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-green-500 inline-block rounded"></span>
            Attempted
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-red-500 inline-block rounded"></span>
            Visited
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 border inline-block rounded"></span>
            Not Visited
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExamScreen;
