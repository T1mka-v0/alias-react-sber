import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';

const Timer = forwardRef(({ duration }, ref) => {
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

  useImperativeHandle(ref, () => {
    const startTimer = () => {
      setIsActive(true);
    };
  
    const resetTimer = () => {
      setIsActive(false);
      setTimer(duration);
    }
  
    const pauseTimer = () => {
      setIsActive(false);
    }
  })

  return (
    <div>
      <p>Оставшееся время: {timer}</p>
    </div>
  );
});

export default Timer;
