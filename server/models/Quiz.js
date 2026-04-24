import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: String,
  duration: Number, // seconds
  isActive: { type: Boolean, default: true },

  questions: [
    {
      question: String,
      options: [String],
      correctAnswer: Number
    }
  ],

  participants: [
    {
      name: String,
      email: String,
      score: Number,
      answers: [Number],
      startTime: Date,
      submittedAt: Date
    }
  ]

}, { timestamps: true });

export default mongoose.model("Quiz", quizSchema);