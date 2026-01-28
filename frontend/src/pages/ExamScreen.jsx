import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";

function ExamScreen() {
  const { examId } = useParams();
  const location = useLocation();
  const examMeta = location.state || JSON.parse(localStorage.getItem(`exam_${examId}`));

  const navigate = useNavigate();

  const [attemptId, setAttemptId] = useState(undefined);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [visited, setVisited] = useState({});
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [tabViolations, setTabViolations] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const [restored, setRestored] = useState(false);



  const STORAGE_KEY = `exam_progress_${examId}`;

useEffect(() => {
  if (!attemptId || !restored) return;

  const payload = {
    answers,
    visited,
    currentIndex,
    startedAt: examMeta.startedAt,
    duration: examMeta.duration,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}, [answers, visited, currentIndex, attemptId, restored, examMeta]);





useEffect(() => {
  if (!examMeta) {
    setAttemptId(null);
    setHydrated(true);
    return;
  }

  if (examMeta.attemptId) {
    setAttemptId(examMeta.attemptId);
  } else {
    setAttemptId(null);
  }

  setHydrated(true);
}, [examMeta]);




useEffect(() => {
  if (!hydrated) return;

  if (attemptId === null) {
    navigate("/student/exams", { replace: true });
  }
}, [attemptId, hydrated, navigate]);


  useEffect(() => {
    if (!examId) return;

    const fetchQuestions = async () => {
      try {
        const res = await api.get(`/exams/${examId}/questions`);
        setQuestions(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [examId]);


  useEffect(() => {
    if (questions[currentIndex]) {
      setVisited((prev) => ({
        ...prev,
        [questions[currentIndex]._id]: true,
      }));
    }
  }, [currentIndex, questions]);

  const currentQuestion = questions[currentIndex];

  const handleOptionChange = (index) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion._id]: index,
    }));
  };

  const getStatusColor = (q) => {
    if (answers[q._id] !== undefined) return "bg-green-500 text-white";
    if (visited[q._id]) return "bg-red-500 text-white";
    return "bg-white border";
  };

  const handleSubmitExam = async () => {
  if (submitting) return;
  setSubmitting(true);
  try {
    const formattedAnswers = Object.entries(answers).map(
      ([questionId, selectedOptionIndex]) => ({
        questionId,
        selectedOptionIndex,
      })
    );

    await api.post(`/attempts/submit/${attemptId}`, {
      answers: formattedAnswers,
    });

    alert("Exam submitted successfully");
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(`exam_${examId}`);

    navigate(`/exam/${examId}/result`);
  } 
  catch (err) {
    console.error(err);
    alert("Failed to submit exam");
  }
};

useEffect(() => {
  if (!attemptId) return;

  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    setRestored(true);
    return;
  }

  try {
    const parsed = JSON.parse(saved);
    setAnswers(parsed.answers || {});
    setVisited(parsed.visited || {});
    setCurrentIndex(parsed.currentIndex || 0);
  } catch (err) {
    console.error("Failed to restore exam progress", err);
  } finally {
    setRestored(true);
  }
}, [attemptId]);



useEffect(() => {
  if (!attemptId || !examMeta) return;

  const startedAt = new Date(examMeta.startedAt);
  const durationMs = examMeta.duration * 60 * 1000;
  const endTime = startedAt.getTime() + durationMs;

  const updateTimer = () => {
    const remaining = Math.max(0, endTime - Date.now());
    setTimeLeft(remaining);

    if (remaining === 0 && !submitting) {
      handleSubmitExam();
    }
  };

  updateTimer();
  const interval = setInterval(updateTimer, 1000);

  return () => clearInterval(interval);
}, [attemptId, examMeta, submitting]);

useEffect(() => {
  const handleBeforeUnload = (e) => {
    e.preventDefault();
    e.returnValue = "";
  };

  window.addEventListener("beforeunload", handleBeforeUnload);

  return () => {
    window.removeEventListener("beforeunload", handleBeforeUnload);
  };
}, []);

useEffect(() => {
  const handleVisibilityChange = () => {
    if (document.hidden) {
      setTabViolations((v) => v + 1);
    }
  };

  document.addEventListener("visibilitychange", handleVisibilityChange);

  return () => {
    document.removeEventListener("visibilitychange", handleVisibilityChange);
  };
}, []);

useEffect(() => {
  if (tabViolations === 0) return;

  if (tabViolations < 3) {
    window.alert(
      `Warning ${tabViolations}/3: Do not switch tabs. Next violation will auto-submit.`
    );
  }

  if (tabViolations >= 3 && !submitting) {
    handleSubmitExam();
  }
}, [tabViolations, submitting]);









  if (attemptId === undefined) {
    return <p className="p-6">Starting exam…</p>;
  }

  if (loading) return <p className="p-6">Loading questions…</p>;
  if (!questions.length) return <p className="p-6">No questions found</p>;

  return (
    <div
      onCopy={(e) => e.preventDefault()}
      onPaste={(e) => e.preventDefault()}
      onContextMenu={(e) => e.preventDefault()}
      className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 p-8 flex gap-8">
        
      <div className="flex-1 bg-white rounded-2xl p-8 shadow-xl border border-slate-200">
        <h2 className="text-xl font-semibold mb-4 text-slate-800">
          Question {currentIndex + 1} of {questions.length}
        </h2>

        <p className="text-lg font-medium mb-6 text-slate-900">
          {currentIndex + 1}. {currentQuestion.questionText}
        </p>

        {currentQuestion.options.map((opt, idx) => (
        <label
          key={idx}
          className={`flex items-center gap-3 p-4 mb-3 rounded-xl cursor-pointer border transition
            ${
              answers[currentQuestion._id] === idx
                ? "bg-blue-50 border-blue-500"
                : "bg-white hover:bg-slate-50 border-slate-300"
            }`}>
          <input
            type="radio"
            name={currentQuestion._id}
            checked={answers[currentQuestion._id] === idx}
            onChange={() => handleOptionChange(idx)}
            className="accent-blue-600"
          />
          <span className="text-slate-800">{opt}</span>
        </label>


        ))}

        <div className="flex justify-between mt-8 pt-6 border-t">
  <button
    disabled={currentIndex === 0}
    onClick={() => setCurrentIndex((i) => i - 1)}
    className="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg font-medium disabled:opacity-50">
    Previous
  </button>

  {currentIndex === questions.length - 1 ? (
    <button
      onClick={handleSubmitExam}
      className="px-8 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition">
      Submit Exam
    </button>
  ) : (
    <button
      onClick={() => setCurrentIndex((i) => i + 1)}
      className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
      Next
    </button>
  )}
</div>

      </div>

      <div className="w-72 bg-white rounded-2xl p-5 shadow-xl border border-slate-200">
        <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-slate-900 to-slate-700 text-white text-center font-mono text-lg shadow">
          ⏱ Time Left{" "}
          <span className="font-bold">
            {Math.floor(timeLeft / 60000)}:
            {String(Math.floor((timeLeft % 60000) / 1000)).padStart(2, "0")}
          </span>
      </div>

        <h3 className="font-semibold mb-4">Questions</h3>

        <div className="grid grid-cols-5 gap-2">
          {questions.map((q, idx) => (
            <button
              key={q._id}
              onClick={() => setCurrentIndex(idx)}
              className={`h-9 w-9 rounded-lg text-sm font-semibold transition ${getStatusColor(q)}`}>
              {idx + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ExamScreen;
