import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  subTopic: { type: String },
  flashcard: { type: String },
  answer: { type: String },
  question: { type: String },
  difficulty: { type: String, enum: ["Easy", "Medium", "Hard"] },
  options: {
    A: String,
    B: String,
    C: String,
    D: String,
  },
  key: { type: String },
  explanation: { type: String },
});

export default mongoose.model("Question", questionSchema);
