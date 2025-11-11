import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import "./AnswerResultPage.css";

const AnswerResultPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  // 👇 --- 1. Get 'rating' from the state
  const { topic, score, questionCount, result, results, rating } = state || {};

  // Ensure graceful fallback
  const resultType = typeof result === "string" ? result : result?.result || "unanswered";

  // ✅ Handle Navigation
  const handleNext = () => {
    if (questionCount >= 6) {
      // 👇 --- 2. Pass 'topic' and 'rating' to the final page
      navigate("/final", { 
        state: { 
          score, 
          results, 
          topic: topic, 
          rating: rating 
        } 
      });
    } else {
      // 👇 --- 3. Pass 'rating' to the next question page
      navigate(`/formula/${topic}`, {
        state: { 
          questionCount, 
          score, 
          results, 
          rating: rating 
        },
      });
    }
  };

  // ✅ Define visual UI per result type
  const getResultUI = () => {
    switch (resultType) {
      case "correct":
        return {
          color: "#22c55e",
          text: "Correct!",
          Icon: CheckCircle,
        };
      case "wrong":
        return {
          color: "#ef4444",
          text: "Incorrect!",
          Icon: XCircle,
        };
      case "unanswered":
        return {
          color: "#f59e0b",
          text: "Time’s Up!",
          Icon: Clock,
        };
      default:
        return {
          color: "#6b7280",
          text: "Unknown Result",
          Icon: Clock,
        };
    }
  };

  const { color, text, Icon } = getResultUI();

  return (
    <div className="answer-result-container">
      <motion.div
        className={`answer-card ${resultType}`}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {/* Animated Icon */}
        <motion.div
          className="result-icon"
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          <Icon size={70} color={color} />
        </motion.div>

        {/* Main Result Text */}
        <h2 className="result-title" style={{ color }}>
          {text}
        </h2>

        {/* Correct Answer Display */}
        <div className="answer-box">
          <p className="label">Correct Answer</p>
          <div className="answer-display">
            {result?.correctOption || "Not Available"}
          </div>
        </div>

        {/* Explanation Section */}
        <div className="explanation-section">
          <p className="label">Explanation</p>
          <p className="explanation-text">
            {result?.explanation ||
              "No explanation available for this question."}
          </p>
        </div>

        {/* Next Button */}
        <motion.button
          className="next-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNext}
        >
          {questionCount >= 6 ? "View Final Results →" : "Next Question →"}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default AnswerResultPage;
