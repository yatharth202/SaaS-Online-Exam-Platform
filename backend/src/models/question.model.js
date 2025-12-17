import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true
    },

    questionText: {
      type: String,
      required: true,
      trim: true
    },

    options: {
      type: [String],
      required: true,
      validate: {
        validator: function (val) {
          return val.length >= 2;
        },
        message: "At least two options are required"
      }
    },

    correctOptionIndex: {
      type: Number,
      required: true
    },

  },
  { timestamps: true }
);

export const Question = mongoose.model("Question", questionSchema);
