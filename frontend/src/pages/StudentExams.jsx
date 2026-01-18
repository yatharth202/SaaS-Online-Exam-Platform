import { useEffect, useState } from "react"
import api from "../api/axios"
import { useNavigate } from "react-router-dom";


function StudentExams() {
  const [exams, setExams] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        const res = await api.get("/exams/available",{
          headers: {
            Authorization: `Bearer ${token}`,
          }
        })

        console.log("API response: ", res.data)

        setExams(res.data.data)
      }catch (err) {
        console.error(err)
        setError("Failed to load exams")
      } finally {
        setLoading(false)
      }
    }

    fetchExams()
  }, [])

const handleStartExam = async (examId) => {
  try {
    const res = await api.post(`/attempts/start/${examId}`);
    console.log("Start exam response:", res.data);

    navigate(`/exam/${examId}`);
  } catch (err) {
    console.error(err);
    alert("Failed to start exam");
  }
};


  if (loading) return <p>Loading exams...</p>
  if (error) return <p>{error}</p>

return (
  <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
    <div className="w-full max-w-xl">
      <h2 className="text-3xl font-bold text-center text-slate-800 mb-8">
        Available Exams
      </h2>

      {exams.length === 0 && (
        <p className="text-center text-slate-600">
          No exams available
        </p>
      )}

      {exams.map((exam) => (
        <div
          key={exam._id}
          className="bg-white rounded-2xl shadow-lg border border-slate-200"
        >
      
          <div className="px-6 py-5 border-b">
            <h3 className="text-xl font-semibold text-slate-900">
              {exam.title}
            </h3>
            <p className="text-slate-600 mt-1">
              {exam.description}
            </p>
          </div>

        
          <div className="p-6 grid grid-cols-2 gap-4 text-sm">
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-slate-500">Duration</p>
              <p className="text-lg font-semibold text-slate-800">
                {exam.duration} mins
              </p>
            </div>

            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-slate-500">Total Marks</p>
              <p className="text-lg font-semibold text-slate-800">
                {exam.totalMarks}
              </p>
            </div>

            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-slate-500">Passing Marks</p>
              <p className="text-lg font-semibold text-slate-800">
                {exam.passingMarks}
              </p>
            </div>

            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-slate-500">Negative Marks</p>
              <p className="text-lg font-semibold text-slate-800">
                {exam.negativeMarks ?? 0}
              </p>
            </div>
          </div>

       
          <div className="px-6 pb-6">
            <button
                onClick={() => handleStartExam(exam._id)}
                className="w-full py-3 rounded-xl bg-blue-600 text-white text-lg font-semibold hover:bg-blue-700 transition">
                  Start Exam
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
)


}

export default StudentExams
