import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import StarRating from "../Components/StarRating";
import Timer from "../Components/Timer";
import "./FormulaRatingPage.css";

const FormulaRatingPage = () => {
  const { topic } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();

  const [formula, setFormula] = useState(null);
  const [showFormula, setShowFormula] = useState(false);
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(true);

  const questionCount = state?.questionCount || 0;
  const score = state?.score || 0;
  const results = state?.results || [];

  // ✅ Stop after 6 rounds
  if (questionCount >= 6) {
    navigate("/final", { state: { score, results } });
    return null;
  }

  // ✅ Load random formula safely
  useEffect(() => {
    const fetchFormula = async () => {
      try {
        const res = await axios.get(`https://farmulamaster.onrender.com/api/questions/${topic}`);
        const data = Array.isArray(res.data) ? res.data : res.data.questions || [];

        // Pick only valid formula objects
        const validFormulas = data.filter((q) => q.flashcard && q.answer);
        if (validFormulas.length > 0) {
          const random = validFormulas[Math.floor(Math.random() * validFormulas.length)];
          setFormula(random);
        } else {
          console.warn("⚠️ No formulas found for topic:", topic);
          setFormula({ subTopic: topic, flashcard: "No formula found", answer: "N/A" });
        }
      } catch (err) {
        console.error("❌ Error loading formula:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFormula();
  }, [topic]);

  // ✅ Handle timeout (auto default rating)
  const handleTimeUp = () => {
    const defaultRating = rating === 0 ? 2 : rating;
    navigate(`/quiz/${topic}`, {
      state: { topic, rating: defaultRating, questionCount, score, results },
    });
  };

  // ✅ Auto navigate after rating
  useEffect(() => {
    if (rating > 0) {
      const timer = setTimeout(() => {
        navigate(`/quiz/${topic}`, {
          state: { topic, rating, questionCount, score, results },
        });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [rating]);

  // ✅ Loading state
  if (loading) {
    return (
      <div className="formula-loading">
        <p>Fetching formula...</p>
      </div>
    );
  }

  return (
    <div className="formula-rating-container">
      {/* Timer */}
      <div className="timer-section">
        <p>Time Remaining</p>
        <Timer duration={60} onTimeUp={handleTimeUp} />
      </div>

      {/* Main Card */}
      <motion.div
        className="formula-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="formula-title">{formula?.subTopic || topic}</h2>
        <p className="formula-subtext">Can you recall this formula?</p>

        {/* ✨ Hint Description (Added Below Title) */}
        {formula?.flashcard && (
          <motion.p
            className="formula-hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            💡 <strong>Hint:</strong>{" "}
            {formula.flashcard.replace("Do you remember", "").trim()}
          </motion.p>
        )}

        {/* Formula Box */}
        <div className={`formula-box ${showFormula ? "revealed" : "blurred"}`}>
          {formula?.answer || "Formula unavailable"}
        </div>

        {!showFormula && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="reveal-btn"
            onClick={() => setShowFormula(true)}
          >
            Reveal Formula
          </motion.button>
        )}

        <hr className="divider" />

        {showFormula && (
          <motion.div
            className="rating-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p>Rate how well you know this formula</p>
            <StarRating setRating={setRating} />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default FormulaRatingPage;
