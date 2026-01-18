import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isAdmin, isStudent } from "../middlewares/role.middleware.js";
import { createExam ,addQuestionToExam, publishExam,unpublishExam,getAvailableExams,getExamQuestions} from "../controllers/exam.controller.js";

const router = Router();

router.post("/",verifyJWT,isAdmin,createExam);

router.post("/:examId/questions",verifyJWT,isAdmin,addQuestionToExam);

router.patch("/:examId/publish",verifyJWT,isAdmin,publishExam); // updating patch

router.patch("/:examId/unpublish",verifyJWT,isAdmin,unpublishExam); // updating patch

router.get("/available",verifyJWT,isStudent,getAvailableExams);

router.get("/:examId/questions",verifyJWT,isStudent,getExamQuestions);

export default router;