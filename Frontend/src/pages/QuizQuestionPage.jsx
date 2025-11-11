import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Timer from "../components/Timer";
import { motion } from "framer-motion";
import "./QuizQuestionPage.css";

const QuizQuestionPage = () => {
  const { topic } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [question, setQuestion] = useState(null);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  const { rating, questionCount = 0, score = 0, results = [] } = state || {};

  // ✅ Fetch one random question based on rating
  useEffect(() => {
    axios
      .post("https://farmulamaster.onrender.com/api/questions/quiz", { topic, rating })
      .then((res) => {
        setQuestion(res.data);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, [topic, rating]);

  // ✅ Handle submission (main logic fixed)
  const handleSubmit = () => {
    if (!question) return;

    let resultType = "unanswered";
    let updatedScore = score;

    // Extract just the option letter from "Option B"
    const correctLetter = question.key?.split(" ").pop()?.trim();

    if (selected) {
      if (selected === correctLetter) {
        resultType = "correct";
        updatedScore += 1;
      } else {
        resultType = "wrong";
      }
    }

    const newResult = {
      questionNumber: questionCount + 1,
      questionText: question.question,
      correctOption: question.key,
      selectedOption: selected || "None",
      result: resultType,
      explanation: question.explanation,
    };

    // Debugging log (optional)
    console.log("🧠 Result Check:", {
      selected,
      correctLetter,
      correctKey: question.key,
      resultType,
    });

    navigate("/result", {
      state: {
        topic,
        score: updatedScore,
        questionCount: questionCount + 1,
        result: newResult,
        results: [...results, newResult],
      },
    });
  };

  if (loading)
    return <div className="loading-text">Loading question...</div>;

  return (
    <div className="quiz-container">
      {/* Timer Section */}
      <div className="timer-section">
        <div className="timer-labels">
          <p>Time remaining</p>
          <span>60s</span>
        </div>
        <Timer duration={60} onTimeUp={handleSubmit} />
      </div>

      {/* Main Card */}
      <motion.div
        className="quiz-card"
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <p className="question-count">
          Question {questionCount + 1} of 6
        </p>

        <h2 className="question-text">{question.question}</h2>

        <div className="options-container">
          {Object.entries(question.options).map(([key, value]) => {
            // Extract option letter (A, B, C, D)
            const optionLetter = key.split(" ").pop()?.trim();
            return (
              <label
                key={key}
                className={`option ${
                  selected === optionLetter ? "option-selected" : ""
                }`}
              >
                <input
                  type="radio"
                  name="option"
                  value={optionLetter}
                  checked={selected === optionLetter}
                  onChange={() => setSelected(optionLetter)}
                />
                <span className="option-circle"></span>
                <span className="option-text">{value}</span>
              </label>
            );
          })}
        </div>

        <button className="submit-btn" onClick={handleSubmit}>
          Submit
        </button>
      </motion.div>
    </div>
  );
};

export default QuizQuestionPage;
