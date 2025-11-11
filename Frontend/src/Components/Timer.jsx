// Components/Timer.jsx
import React, { useEffect, useState } from "react";

const Timer = ({ duration, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }
    const interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const progress = ((duration - timeLeft) / duration) * 100;

  return (
    <div>
      <div className="timer-progress">
        <div className="timer-bar" style={{ width: `${progress}%` }}></div>
      </div>
      <p style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "4px" }}>
        00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
      </p>
    </div>
  );
};

export default Timer;
