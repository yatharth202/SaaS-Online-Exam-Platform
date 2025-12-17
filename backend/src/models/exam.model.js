import mongoose from "mongoose";

const examSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      trim: true
    },

    duration: {
      type: Number, 
      required: true
    },

    totalMarks: {
      type: Number,
      required: true
    },

    passingMarks: {
      type: Number,
      min: 0,
      required: true
    },

    startTime: {
      type: Date,
      required: true
    },

    endTime: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                return value > this.startTime;
            },
        message: "End time must be after start time"
        }
    },

    isPublished: {
      type: Boolean,
      default: false
    },

    positiveMarks: {
        type: Number,
        default: 4
    },

    negativeMarks: {
        type: Number,
        default: -1
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

export const Exam = mongoose.model("Exam", examSchema);
