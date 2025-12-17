import express from "express"
import cors from "cors"

const app=express();

//middleware
app.use(cors());
app.use(express.json());

import authRoutes from "./routes/auth.routes.js"

app.use("/api/v1/auth",authRoutes);

app.get("/",(req,res)=>{
    res.send("API is running")
})


app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
  });
});


import { verifyJWT } from "./middlewares/auth.middleware.js";

app.get("/protected", verifyJWT, (req, res) => {
  res.status(200).json({
    success: true,
    message: "You accessed a protected route",
    user: req.user
  });
});

import examRoutes from "./routes/exam.routes.js";

app.use("/api/v1/exams", examRoutes);

export default app;
