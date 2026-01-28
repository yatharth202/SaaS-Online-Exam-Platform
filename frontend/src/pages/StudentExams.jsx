import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";



function StudentExams() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submittedExams, setSubmittedExams] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await api.get("/exams/available");
        setExams(res.data.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load exams");
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

    useEffect(() => {
    const checkSubmittedExams = async () => {
      const map = {};

      for (const exam of exams) {
        try {
          await api.get(`/attempts/my/${exam._id}`);
          map[exam._id] = true; // submitted
        } catch {
          map[exam._id] = false; // not submitted
        }
      }

      setSubmittedExams(map);
    };

    if (exams.length > 0) {
      checkSubmittedExams();
    }
  }, [exams]);


const handleStartExam = async (examId) => {
  try {
    const res = await api.post(`/attempts/start/${examId}`);

    const { attemptId, startedAt, duration } = res.data.data;
  
    localStorage.setItem(
    `exam_${examId}`,
    JSON.stringify({ attemptId, startedAt, duration })
  );

    navigate(`/exam/${examId}`, {
      state: {
        attemptId,
        startedAt,
        duration,
      },
    });
  } catch (err) {
    console.error(err);

    const message =
      err.response?.data?.message ||
      "You have already completed this exam";

    alert(message);
  }
};



  if (loading) return <p>Loading exams...</p>;
  if (error) return <p>{error}</p>;

return (
  <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-100">


    <button
      onClick={() => navigate("/student/dashboard")}
      className="fixed top-6 left-6 text-blue-600 font-semibold hover:underline z-50"
    >
      ← Dashboard
    </button>


    <div className="min-h-screen flex flex-col items-center justify-start pt-24 px-6">

      <h1 className="text-3xl font-bold text-slate-800 mb-10">
        Available Exams
      </h1>

      <div className="w-full max-w-md">
        {exams.map((exam) => (
          <div
            key={exam._id}
            className="bg-white rounded-2xl shadow-xl border border-slate-200 hover:shadow-2xl transition"
          >

            <div className="px-6 py-5 border-b">
              <h3 className="text-xl font-bold text-slate-900">
                {exam.title}
              </h3>
              <p className="text-slate-500 mt-1">
                {exam.description}
              </p>
            </div>


            <div className="p-6 grid grid-cols-2 gap-4 text-sm">
              <div className="rounded-xl bg-blue-50 p-4">
                <p className="text-blue-600 font-medium">Duration</p>
                <p className="text-xl font-bold text-blue-900">
                  {exam.duration} mins
                </p>
              </div>

              <div className="rounded-xl bg-purple-50 p-4">
                <p className="text-purple-600 font-medium">Total Marks</p>
                <p className="text-xl font-bold text-purple-900">
                  {exam.totalMarks}
                </p>
              </div>

              <div className="rounded-xl bg-green-50 p-4">
                <p className="text-green-600 font-medium">Passing</p>
                <p className="text-xl font-bold text-green-900">
                  {exam.passingMarks}
                </p>
              </div>

              <div className="rounded-xl bg-red-50 p-4">
                <p className="text-red-600 font-medium">Negative</p>
                <p className="text-xl font-bold text-red-900">
                  {exam.negativeMarks ?? 0}
                </p>
              </div>
            </div>


            <div className="px-6 pb-6">
              {submittedExams[exam._id] ? (
                <button
                  onClick={() => navigate(`/exam/${exam._id}/result`)}
                  className="w-full py-3 rounded-xl bg-green-600 text-white text-lg font-semibold hover:bg-green-700 transition"
                >
                  View Result
                </button>
              ) : (
                <button
                  onClick={() => handleStartExam(exam._id)}
                  className="w-full py-3 rounded-xl bg-blue-600 text-white text-lg font-semibold hover:bg-blue-700 transition"
                >
                  Start Exam
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);


}

export default StudentExams;
