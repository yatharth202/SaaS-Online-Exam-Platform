import {Router} from "express";
import {registerUser,loginUser,refreshAccessToken,logoutUser,} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isAdmin,isStudent } from "../middlewares/role.middleware.js";
import { adminOnlyController } from "../controllers/admin.controller.js";
import { studentDashboard } from "../controllers/student.controller.js";

const router = Router();

router.post("/register",registerUser);
router.post("/login",loginUser);
router.post("/logout", verifyJWT, logoutUser)
router.post("/refresh-token", refreshAccessToken);


router.post("/admin-only",verifyJWT,isAdmin,adminOnlyController)

router.post("/student-only",verifyJWT,isStudent,studentDashboard);



export default router;