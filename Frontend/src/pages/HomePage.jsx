import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import "./HomePage.css";

const HomePage = () => {
  const [topics, setTopics] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("https://farmulamaster.onrender.com/api/questions/topics")
      .then((res) => setTopics(res.data))
      .catch((err) => console.error(err));
  }, []);

  const formulaPreview = {
    "Simple Interest": "SI = \\frac{P \\times T \\times R}{100}",
    "Compound Interest": "A = P(1 + \\frac{R}{100})^T",
    "Profit & Loss": "Profit = SP - CP",
    "Pythagorean Theorem": "a^2 + b^2 = c^2",
    "Quadratic Formula": "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}",
    "Ohm's Law": "V = IR",
    "Newton's Second Law": "F = ma",
    "Mass-Energy Equivalence": "E = mc^2",
    "Ideal Gas Law": "PV = nRT",
  };

  return (
    <div className="homepage">
      <div className="header">
        <h1>Choose a Concept to Begin Learning</h1>
        <p>
          Select a topic card below to test your knowledge of formulas and concepts.
        </p>
      </div>

      <div className="topics-grid">
        {topics.map((topic, index) => (
          <div key={index} className="topic-card">
            <h3>{topic}</h3>
            <p>Explore and test your understanding of this concept.</p>
            <div className="formula-box">
              <BlockMath math={formulaPreview[topic] || "E = mc^2"} />
            </div>
            <button onClick={() => navigate(`/formula/${topic}`)}>Start</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
