import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login"
import StudentExams from "../pages/StudentExams"
import ExamScreen from "../pages/ExamScreen";
import ExamResult from "../pages/ExamResult";
import StudentDashboard from "../pages/studentDashboard";




function AppRouter() {
  return (
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/student/exams" element={<StudentExams />} />
        <Route path="/exam/:examId" element={<ExamScreen />} />
        <Route path="/exam/:examId/result" element={<ExamResult />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
      </Routes>
  )
}

export default AppRouter
