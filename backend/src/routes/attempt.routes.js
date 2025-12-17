import { Router } from "express";
import {startExamAttempt,submitExamAttempt} from "../controllers/attempt.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isStudent } from "../middlewares/role.middleware.js";

const router = Router();

//   POST /api/v1/attempts/start/:examId
router.post("/start/:examId",verifyJWTerifyJWT,isStudent,startExamAttempt);

 //POST /api/v1/attempts/submit/:attemptId
router.post("/submit/:attemptId",verifyJWT,isStudent,submitExamAttempt);

export default router;
