import { BrowserRouter, Routes, Route,Navigate } from "react-router-dom"
import Login from "../pages/Login"
import StudentExams from "../pages/StudentExams"
import ExamScreen from "../pages/ExamScreen";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/student/exams" element={<StudentExams />} />
        <Route path="/exam/:examId" element={<ExamScreen />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
