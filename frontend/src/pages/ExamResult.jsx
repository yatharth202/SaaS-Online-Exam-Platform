import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

function ExamResult() {
  const { examId } = useParams();
  const navigate = useNavigate();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await api.get(`/attempts/my/${examId}`);
        setResult(res.data.data);
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message || "Failed to load exam result"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [examId]);

  if (loading) return <p className="p-6">Loading result…</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-blue-100 px-4">
    <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">

      <h2 className="text-2xl font-bold text-slate-800 mb-6">
        Exam Result
      </h2>

      <div className="mb-6">
        <p className="text-sm text-slate-500 mb-1">Your Score</p>
        <p className="text-4xl font-bold text-slate-900">
          {result.score}
        </p>
      </div>

      <div
        className={`inline-block px-6 py-2 rounded-full text-lg font-bold mb-6 ${
          result.result === "pass"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {result.result.toUpperCase()}
      </div>

      <p className="text-sm text-slate-500 mb-8">
        Submitted on{" "}
        {new Date(result.submittedAt).toLocaleString()}
      </p>

      <button
        onClick={() => navigate("/student/exams")}
        className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition shadow-lg"
      >
        Back to Exams
      </button>

    </div>
  </div>
);

}

export default ExamResult;
