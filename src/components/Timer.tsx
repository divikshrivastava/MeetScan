import React, { useState, useEffect } from 'react';

interface TimerProps {
  duration: number; // duration in milliseconds
  active: boolean;
  onEnd: () => void;
}

const Timer: React.FC<TimerProps> = ({ duration, active, onEnd }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isPaused, setIsPaused] = useState(!active);

  useEffect(() => {
    if (isPaused || timeLeft <= 0) return;

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1000);
    }, 1000);

    if (timeLeft <= 0) {
      onEnd();
    }

    return () => clearTimeout(timer);
  }, [timeLeft, isPaused, onEnd]);

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="flex justify-between items-center my-4 bg-white rounded-lg p-4 shadow-lg">
      <h4 className="text-xl">Time Left: {formatTime(timeLeft)}</h4>
      <div className="flex space-x-4">
        <button
          className="bg-blue-200 shadow-inner p-3 rounded-lg"
          onClick={() => setIsPaused(!isPaused)}
        >
          {isPaused ? 'Resume' : 'Pause'}
        </button>
        <button className="bg-red-500 text-white p-3 rounded-lg shadow" onClick={onEnd}>
          End Event
        </button>
      </div>
    </div>
  );
};

export default Timer;
