import mongoose, { Schema } from "mongoose";

const answerSchema = new Schema(
  {
    questionId: {
      type: Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },

    selectedOptionIndex: {
      type: Number,
      default: null, 
    },
  },
  { _id: false }
);

const attemptSchema = new Schema(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    examId: {
      type: Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["in-progress", "submitted"],
      default: "in-progress",
      required: true,
    },

    startedAt: {
      type: Date,
      default: Date.now,
      required: true,
    },

    submittedAt: {
      type: Date,
      default: null,
    },

    answers: {
      type: [answerSchema],
      default: [],
    },

    score: {
      type: Number,
      default: null,
    },

    result: {
      type: String,
      enum: ["pass", "fail"],
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// One attempt only
attemptSchema.index({ studentId: 1, examId: 1 }, { unique: true });

export const Attempt = mongoose.model("Attempt", attemptSchema);
