import { Exam } from "../models/exam.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Question } from "../models/question.model.js";

export const createExam = asyncHandler(async(req,res) => {
    const {  
        title,
        description,
        duration,
        totalMarks,
        passingMarks,
        startTime,
        endTime,
        positiveMarks,
        negativeMarks
    } = req.body;

    if(!title || !duration || !totalMarks || !passingMarks || !startTime || !endTime){
        throw new ApiError(400, "All required fields must be provided");
    }

    if(new Date(startTime)>= new Date(endTime)){
         throw new ApiError(400, "End time must be after start time");
    }

    const exam = await Exam.create({
        title,
        description,
        duration,
        totalMarks,
        passingMarks,
        startTime,
        endTime,
        positiveMarks,
        negativeMarks,
        createdBy: req.user._id // seccc
    })

    return res
    .status(201)
    .json(new ApiResponse(201,exam,"Exam created successfully"))
})

export const addQuestionToExam = asyncHandler(async(req,res) => {
    const {examId} =req.params; //url fetch id
    const {questionText,options,correctOptionIndex} = req.body;

    const exam = await Exam.findById(examId);

    if(!exam){
        throw new ApiError(404,"Exam not found");
    }

    if(exam.isPublished){
        throw new ApiError(403,"Cannot add question to a published exam");
    }

    if(!questionText || !options || !correctOptionIndex){
        throw new ApiError(400,"All questions fields are required");
    }

    if(!Array.isArray(options) || options.length<2){
        throw new ApiError(400,"Options must contain at leat two values")
    }

    if(correctOptionIndex<0 || correctOptionIndex>=options.length){
        throw new ApiError(400,"Invalid correctOptionIndex");
    }

    
    const question = await Question.create({
        examId,
        questionText,
        options,
        correctOptionIndex
    })

    return res.status(201).json(
        new ApiResponse(201,question,"Question added successfully")
    )
})


export const publishExam = asyncHandler(async(req,res) =>{
    const { examId } = req.params;

    const exam = await Exam.findById(examId);

    if(!exam){
        throw new ApiError(404,"Exam not found");
    }

    if(exam.isPublished){
        throw new ApiError(400,"Exam is already published");
    }

    const questionCount = await Question.countDocuments({examId});

    if(questionCount===0){
        throw new ApiError(400,"cannot publish exam without questions");
    }

    exam.isPublished = true;
    await exam.save();

    return res.status(200).json(
        new ApiResponse(200,exam,"Exam published successfully")
    );
})

export const unpublishExam = asyncHandler(async(req,res) =>{
    const {examId} = req.params;

    const exam = await Exam.findById(examId);

    if(!exam){
        throw new ApiError(404,"Exam not found");
    }

    if(!exam.isPublished){
        throw new ApiError(400,"Exam is already unpublished");
    }

    exam.isPublished = false;
    await exam.save();

    return res.status(200).json(
        new ApiResponse(200,exam,"Exam unpublished successfully")
    );
})

export const getAvailableExams = asyncHandler(async(req,res) => {
    const now = new Date();

    const exams= await Exam.find({
        isPublished: true,
        startTime: {$lte: now},
        endTime : {$gte: now}
    })
    .select("-__v")
    .sort({startTime: 1});

    return res.status(200).json(
        new ApiResponse(200,exams,"Available exams fetched sucessfully")
    )
})