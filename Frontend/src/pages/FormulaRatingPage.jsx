import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import StarRating from "../Components/StarRating";
import Timer from "../Components/Timer";
import "./FormulaRatingPage.css";

const FormulaRatingPage = () => {
  const { topic: paramTopic } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  // ✅ Always preserve topic even after restart
  const topic = paramTopic || state?.topic || "General";

  const [formula, setFormula] = useState(null);
  const [showFormula, setShowFormula] = useState(false);
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const questionCount = state?.questionCount || 0;
  const score = state?.score || 0;
  const results = state?.results || [];

  // ✅ Stop after 6 rounds
  useEffect(() => {
    if (questionCount >= 6) {
      navigate("/final", { state: { score, results, topic } });
    }
  }, [questionCount, score, results, topic, navigate]);

  // ✅ Handle restart flag (reset local state)
  useEffect(() => {
    if (state?.restart) {
      setFormula(null);
      setShowFormula(false);
      setRating(0);
      setError(false);
      setLoading(true);
    }
  }, [state]);

  // ✅ Fetch formula for this topic
  useEffect(() => {
    const fetchFormula = async () => {
      if (!topic) return;

      try {
        const res = await axios.get(
          `https://farmulamaster.onrender.com/api/questions/${encodeURIComponent(
            topic
          )}`
        );

        const data = Array.isArray(res.data)
          ? res.data
          : res.data.questions || [];

        const validFormulas = data.filter(
          (q) => q.flashcard && q.answer && q.subTopic
        );

        if (validFormulas.length > 0) {
          const random =
            validFormulas[Math.floor(Math.random() * validFormulas.length)];
          setFormula(random);
          setError(false);
        } else {
          console.warn("⚠️ No valid formulas found for topic:", topic);
          setFormula({
            subTopic: topic,
            flashcard: "No valid formula found for this topic.",
            answer: "Try another topic.",
          });
        }
      } catch (err) {
        console.error("❌ Error loading formula:", err);
        setError(true);
        setFormula({
          subTopic: topic,
          flashcard: "Error loading formula data.",
          answer: "Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFormula();
  }, [topic]);

  // ✅ Handle time-up logic
  const handleTimeUp = () => {
    const defaultRating = rating === 0 ? 2 : rating;
    navigate(`/quiz/${topic}`, {
      state: { topic, rating: defaultRating, questionCount, score, results },
    });
  };

  // ✅ Automatically continue when rated
  useEffect(() => {
    if (rating > 0) {
      const timer = setTimeout(() => {
        navigate(`/quiz/${topic}`, {
          state: { topic, rating, questionCount, score, results },
        });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [rating, topic, questionCount, score, results, navigate]);

  // ✅ Loading shimmer UI
  if (loading) {
    return (
      <div className="formula-loading">
        <motion.div
          className="loading-box"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
        >
          <div className="loading-line"></div>
          <div className="loading-line short"></div>
          <p>Fetching your formula...</p>
        </motion.div>
      </div>
    );
  }

  // ✅ Error fallback
  if (error) {
    return (
      <div className="formula-rating-container">
        <motion.div
          className="formula-card error-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2>Oops! Something went wrong 😞</h2>
          <p>We couldn’t load the formula for <strong>{topic}</strong>.</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="reveal-btn"
            onClick={() => window.location.reload()}
          >
            🔄 Try Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="formula-rating-container">
      {/* Timer Section */}
      <div className="timer-section">
        <p>Time Remaining</p>
        <Timer duration={60} onTimeUp={handleTimeUp} />
      </div>

      {/* Formula Card */}
      <motion.div
        className="formula-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="formula-title">{formula?.subTopic || topic}</h2>
        <p className="formula-subtext">Can you recall this formula?</p>

        {/* 💡 Hint Section */}
        {formula?.flashcard && (
          <motion.p
            className="formula-hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            💡 <strong>Hint:</strong>{" "}
            {formula.flashcard.replace("Do you remember", "").trim()}
          </motion.p>
        )}

        {/* Formula Box */}
        <div className={`formula-box ${showFormula ? "revealed" : "blurred"}`}>
          {formula?.answer || "Formula unavailable"}
        </div>

        {/* Reveal Button */}
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

        {/* Rating Section */}
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
