import React, { useState, useEffect } from 'react';

function Timer({ duration }) {
  const [timer, setTimer] = useState(duration);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (isActive && timer > 0) {
      const intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [isActive, timer]);

  useEffect(() => {
    if (timer === 0) {
      console.log('Таймер истек!');
      // Здесь можно вызвать функцию, которую нужно выполнить после истечения времени
    }
  }, [timer]);

  const handleStart = () => {
    setIsActive(true);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimer(duration);
  }

  return (
    <div>
      <p>Оставшееся время: {timer}</p>
      <button onClick={handleStart}>Запустить таймер</button>
      <button onClick={resetTimer}>Сбросить таймер</button>
    </div>
  );
}

export default Timer;
