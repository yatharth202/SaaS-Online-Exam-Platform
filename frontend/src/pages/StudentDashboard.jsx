import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

function StudentDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/attempts/dashboard");
        setDashboard(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDashboard();
  }, []);

  if (!dashboard) {
    return <p className="p-6">Loading dashboard...</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-100 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        

        <h2 className="text-3xl font-bold text-slate-800 mb-8">
          Student Dashboard
        </h2>


        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Stat
            label="Total Exams"
            value={dashboard.totalExams}
            bg="bg-blue-50"
            text="text-blue-700"
          />
          <Stat
            label="Attempted"
            value={dashboard.attempted}
            bg="bg-purple-50"
            text="text-purple-700"
          />
          <Stat
            label="Passed"
            value={dashboard.passed}
            bg="bg-green-50"
            text="text-green-700"
          />
          <Stat
            label="Failed"
            value={dashboard.failed}
            bg="bg-red-50"
            text="text-red-700"
          />
        </div>


        <button
          onClick={() => navigate("/student/exams")}
          className="inline-flex items-center px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition shadow-lg"
        >
          Go to Exams →
        </button>
      </div>
    </div>
  );
}

function Stat({ label, value, bg, text }) {
  return (
    <div className={`rounded-2xl p-6 shadow-lg ${bg}`}>
      <p className="text-sm text-slate-500 mb-1">{label}</p>
      <p className={`text-3xl font-bold ${text}`}>{value}</p>
    </div>
  );
}

export default StudentDashboard;
