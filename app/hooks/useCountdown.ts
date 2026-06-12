import { useEffect, useRef, useState } from 'react';

type UseCountdownProps = {
  initialTime: number; // seconds
  onFinish?: () => void;
  onTwoSecondsLeft?: () => void;
};

export const useCountdown = ({ initialTime, onFinish, onTwoSecondsLeft }: UseCountdownProps) => {
  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const twoSecondsTriggeredRef = useRef(false);

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setTime((prev) => {
        if (prev === 2 && !twoSecondsTriggeredRef.current) {
          twoSecondsTriggeredRef.current = true;
          onTwoSecondsLeft?.();
        }
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          setIsRunning(false);
          onFinish?.();
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current!);
  }, [isRunning]);

  const start = () => {
    twoSecondsTriggeredRef.current = false;
    setIsRunning(true);
  };
  const pause = () => setIsRunning(false);

  const reset = () => {
    twoSecondsTriggeredRef.current = false;
    setTime(initialTime);
    setIsRunning(false);
  };

  // 👇 split into minutes + seconds
  const minutes = String(Math.floor(time / 60)).padStart(1, '0');
  const seconds = String(time % 60).padStart(2, '0');

  return {
    time,
    minutes,
    seconds,
    isRunning,
    start,
    pause,
    reset,
  };
};
