import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";
import "./FinalReviewPage.css";

const FinalReviewPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const results = state?.results || [];
  const score = state?.score || 0;
  const total = 6;
  const percentage = Math.round((score / total) * 100);

  return (
    <div className="final-container">
      <motion.div
        className="header-section"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>Quiz Complete!</h1>
        <p className="subtitle">
          Here’s how you did. Review your answers to improve.
        </p>
      </motion.div>

      {/* SCORE CARD */}
      <motion.div
        className="score-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="score-left">
          <h3>Great job!</h3>
          <p className="score-text">
            You scored <strong>{score}</strong> / {total}
          </p>
          <p className="score-sub">
            Review your answers below to see where you can improve and master
            the concepts.
          </p>
        </div>

        {/* Circular Progress */}
        <div className="progress-ring">
          <svg width="90" height="90">
            <circle
              cx="45"
              cy="45"
              r="40"
              stroke="#e5e7eb"
              strokeWidth="8"
              fill="none"
            />
            <motion.circle
              cx="45"
              cy="45"
              r="40"
              stroke="#2563eb"
              strokeWidth="8"
              fill="none"
              strokeDasharray="251.2"
              strokeDashoffset={251.2 - (251.2 * percentage) / 100}
              strokeLinecap="round"
              initial={{ strokeDashoffset: 251.2 }}
              animate={{ strokeDashoffset: 251.2 - (251.2 * percentage) / 100 }}
              transition={{ duration: 1 }}
            />
          </svg>
          <span className="percentage">{percentage}%</span>
        </div>
      </motion.div>

      {/* REVIEW SECTION */}
      <motion.div
        className="review-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h2>Review Your Answers</h2>
        <div className="review-list">
          {results.map((res, index) => {
            const isCorrect = res.result === "correct";
            return (
              <motion.div
                key={index}
                className={`review-card ${isCorrect ? "correct" : "wrong"}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="question-header">
                  <h3>
                    Question {index + 1}: {res.questionText}
                  </h3>
                </div>

                <div className="answer-info">
                  {isCorrect ? (
                    <p className="your-answer correct">
                      <CheckCircle size={18} /> Your Answer:{" "}
                      <strong>{res.selectedOption}</strong> (Correct)
                    </p>
                  ) : (
                    <>
                      <p className="your-answer wrong">
                        <XCircle size={18} /> Your Answer:{" "}
                        <strong>{res.selectedOption}</strong>
                      </p>
                      <p className="correct-answer">
                        ✅ Correct Answer: <strong>{res.correctOption}</strong>
                      </p>
                    </>
                  )}
                </div>

                <div className="explanation">
                  <p>
                    <strong>Explanation:</strong> {res.explanation}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* BUTTONS */}
      <motion.div
        className="bottom-buttons"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <button className="restart-btn" onClick={() => navigate(-1)}>
          🔁 Restart Quiz
        </button>
        <button className="back-btn" onClick={() => navigate("/")}>
          🏠 Back to Topics
        </button>
      </motion.div>
    </div>
  );
};

export default FinalReviewPage;
