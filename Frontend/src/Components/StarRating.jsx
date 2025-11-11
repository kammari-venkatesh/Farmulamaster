import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import { motion } from "framer-motion";

const StarRating = ({ setRating }) => {
  const [hover, setHover] = useState(null);
  const [selected, setSelected] = useState(null);

  const handleClick = (value) => {
    setSelected(value);
    setRating(value);
  };

  return (
    <motion.div
      className="star-rating-container"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {[1, 2, 3, 4, 5].map((star, i) => (
        <motion.div
          key={i}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <FaStar
            size={32}
            color={star <= (hover || selected) ? "#facc15" : "#e2e8f0"}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(null)}
            onClick={() => handleClick(star)}
            style={{
              cursor: "pointer",
              transition: "color 0.25s ease",
              filter:
                star <= (hover || selected)
                  ? "drop-shadow(0 0 6px rgba(250, 204, 21, 0.7))"
                  : "none",
            }}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default StarRating;
