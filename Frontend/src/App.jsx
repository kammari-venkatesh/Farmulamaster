import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Homepage";
import FormulaRatingPage from "./pages/FormulaRatingPage";
import QuizQuestionPage from "./pages/QuizQuestionPage";
import AnswerResultPage from "./pages/AnswerResultPage";
import FinalReviewPage from "./pages/FinalReviewPage";
import Navbar from "./Components/Navbar";
import "./index.css";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/formula/:topic" element={<FormulaRatingPage />} />
        <Route path="/quiz/:topic" element={<QuizQuestionPage />} />
        <Route path="/result" element={<AnswerResultPage />} />
        <Route path="/final" element={<FinalReviewPage />} />
      </Routes>
    </Router>
  );
};

export default App;
