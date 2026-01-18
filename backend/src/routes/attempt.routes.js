import { Router } from "express";
import {startExamAttempt,submitExamAttempt,getResult,getExamAttemptsAnalytics} from "../controllers/attempt.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isStudent,isAdmin} from "../middlewares/role.middleware.js";

const router = Router();

//   POST /api/v1/attempts/start/:examId
router.post("/start/:examId",verifyJWT,isStudent,startExamAttempt);

 //POST /api/v1/attempts/submit/:attemptId
router.post("/submit/:attemptId",verifyJWT,isStudent,submitExamAttempt);

router.get("/my/:examId",verifyJWT,isStudent,getResult);

//GET /api/v1/attempts/exam/:examId
router.get("/exam/:examId",verifyJWT,isAdmin,getExamAttemptsAnalytics);

export default router;

