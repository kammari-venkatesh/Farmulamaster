import Question from "../models/questionModel.js";

// ✅ Get all unique topics
export const getTopics = async (req, res) => {
  try {
    const topics = await Question.distinct("topic");
    res.json(topics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get all questions for a topic
export const getQuestionsByTopic = async (req, res) => {
  try {
    const { topic } = req.params;
    const questions = await Question.find({ topic }).lean();

    if (!questions || questions.length === 0) {
      return res.status(404).json({ message: `No questions found for ${topic}` });
    }

    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get filtered questions based on difficulty mix
export const getQuizQuestions = async (req, res) => {
  try {
    const { topic, rating } = req.body;
    if (!topic || !rating)
      return res.status(400).json({ error: "Topic and rating are required" });

    let difficulty = "Easy";
    if (rating <= 2) difficulty = "Easy";
    else if (rating <= 4) difficulty = "Medium";
    else difficulty = "Hard";

    const question = await Question.aggregate([
      { $match: { topic, difficulty } },
      { $sample: { size: 1 } },
    ]);

    if (!question.length)
      return res.status(404).json({ error: "No question found" });

    res.json(question[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
