import express from "express";
import {
  getTopics,
  getQuestionsByTopic,
  getQuizQuestions,
} from "../controllers/questionController.js";
import Question from "../models/questionModel.js";

const router = express.Router();

/* ===============================
   ✅ Existing Routes
================================*/
router.get("/topics", getTopics);
router.get("/:topic", getQuestionsByTopic);
router.post("/quiz", getQuizQuestions);

/* ===============================
   ✅ New Route — Bulk Insert Questions
   Description:
   - Accepts a JSON array of question objects in the request body
   - Clears existing data (for fresh upload)
   - Inserts all received questions into MongoDB
================================*/
router.post("/bulk", async (req, res) => {
  try {
    const questions = req.body;

    // Validate body
    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid or empty data array. Please send a valid JSON list.",
      });
    }

    // Delete old data (optional safety step)
    await Question.deleteMany({});

    // Insert new data
    const inserted = await Question.insertMany(questions);

    res.status(201).json({
      success: true,
      message: "✅ All questions inserted successfully",
      count: inserted.length,
    });
  } catch (error) {
    console.error("❌ Error inserting data:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to insert questions",
      error: error.message,
    });
  }
});

export default router;
