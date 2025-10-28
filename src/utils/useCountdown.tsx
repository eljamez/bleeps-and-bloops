import { useCallback, useEffect, useState } from "react";

export const useCountdown = () => {
  const [initialTime, setInitialTime] = useState<number>(10);
  const [time, setTime] = useState<number>(initialTime);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  useEffect(() => {
    if (time <= 0) {
      setIsCompleted(true);
      setIsRunning(false);
      return;
    }

    if (!isRunning) {
      return;
    }

    if (isRunning) {
      const interval = setInterval(() => {
        setTime((prev) => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            setIsCompleted(true);
            setIsRunning(false);
            clearInterval(interval);
            return 0;
          }
          return newTime;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isRunning]);

  const handleSetInitialTime = useCallback(
    (value: number) => {
      setInitialTime(value);
      if (!isRunning) {
        setTime(value);
      }
    },
    [isRunning]
  );

  const handleToggleStartStop = useCallback(() => {
    setIsRunning(!isRunning);
  }, [isRunning]);

  const handleReset = useCallback(() => {
    if (!isRunning) {
      setIsRunning(false);
      setTime(initialTime);
    }
  }, [initialTime, isRunning]);

  return {
    initialTime,
    time,
    handleSetInitialTime,
    isRunning,
    handleToggleStartStop,
    handleReset,
    isCompleted,
  };
};
