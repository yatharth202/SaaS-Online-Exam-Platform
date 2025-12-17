import { json } from "body-parser";
import { Attempt } from "../models/attempt.model.js";
import { Exam } from "../models/exam.model.js";
import { Question } from "../models/question.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


export const startExamAttempt = asyncHandler(async(req,res) =>{
    const {examId} =req.params;

    const studentId = req.user._id;

    const exam = await Exam.findById(examId);

    if(!exam){
        throw new ApiError(404,"Exam not found");
    }

    if(!exam.isPublished){
        throw new ApiError(403,"Exam is not Published");
    }

    const now = new Date();

    if(now<exam.startTime || now>exam.endTime){
        throw new ApiError(403,"Exam is not active anymore");
    }
    
   
    const existingAttempt = await Attempt.findOne({
        studentId,
        examId
    })

    if (existingAttempt) {
        if (existingAttempt.status === "submitted") {
            throw new ApiError(409, "You have already submitted this exam");
        }

    //on going
    return res.status(200).json(
        new ApiResponse(200,
            {
               attemptId: existingAttempt._id,
               startedAt: existingAttempt.startedAt,
               duration: exam.duration 
            },
        "Exam already started")
    );
}

    const questionCount = await Question.countDocuments({examId});
    if(questionCount===0){
        throw new ApiError(400,"Exam has no questions");
    }

    //create exam
    const attempt = await Attempt.create({
        studentId,
        examId,
        startedAt : now,
    });

    return res.status(201).json(
        new ApiResponse(201,
            {
                attemptId: attempt._id,
                startedAt: attempt.startedAt,
                duration: exam.duration,
                totalQuestion: questionCount

            }
        )
    )
})


//sumbit exam 
export const sumbitExamAttempt = asyncHandler(async(req,res) => {
    const {attemptId} = req.params;
    const {answers} = req.body;
    const studentId = req.user._id;

    const attempt = await Attempt.findById(attemptId);

    if(!attempt){
        throw new ApiError(404,"Attemp not found ");
    }
    
    // should be logged in 
    if (attempt.studentId.toString() !== studentId.toString()) {
        throw new ApiError(403, "Unauthorized attempt access");
    }

    //already sumbitted 
    if(attempt.status==="submitted"){
        return res.status(200).json(
            new ApiResponse(200,
                {
                    score: attempt.score,
                    result: attempt.result,
                    submittedAt: attempt.submittedAt
                },
                "Exam already submitted"                
            )
        )
    }

    //fetch 
    const exam = await Exam.findById(attempt.examId);

    if(!exam){
        throw new ApiError(404,"Exam not found");
    }

      
    const now = new Date();
    const allowedUntil = new Date(
        Math.min(
            exam.endTime.getTime(),
            attempt.startedAt.getTime() + exam.duration * 60 * 1000
        )
    );

    attempt.submittedAt = now > allowedUntil ? allowedUntil : now;

    // Fetch all questions
    const questions = await Question.find({ examId: exam._id });

    //  Evaluation 
    let score = 0;
    const evaluatedAnswers = [];

    for (const question of questions) {
        const givenAnswer = answers.find(
      (a) => a.questionId === question._id.toString()
    );

    let selectedOptionIndex = null;

    if (givenAnswer) {
        selectedOptionIndex = givenAnswer.selectedOptionIndex;

        if (selectedOptionIndex === question.correctOptionIndex) {
            score += exam.positiveMarks;
        } else {
            score += exam.negativeMarks;
        }
    }

    evaluatedAnswers.push({
      questionId: question._id,
      selectedOptionIndex,
    });
  }

    // Lock attempt
    attempt.answers = evaluatedAnswers;
    attempt.score = score;
    attempt.result = score >= exam.passingMarks ? "pass" : "fail";
    attempt.status = "submitted";

    await attempt.save();

   
    return res.status(200).json(
    new ApiResponse(
        200,
        {
            score: attempt.score,
            result: attempt.result,
            submittedAt: attempt.submittedAt,
        },
        "Exam submitted successfully"
    )
  );
});

