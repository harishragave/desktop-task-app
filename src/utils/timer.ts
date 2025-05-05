
import { useState, useEffect, useRef } from 'react';
import { TimerStatus, BreakDuration } from '../types';

interface UseTimerReturn {
  seconds: number;
  status: TimerStatus;
  start: () => void;
  pause: () => void;
  stop: () => void;
  takeBreak: () => void;
  resumeFromBreak: () => void;
  reset: () => void;
  breakDurations: BreakDuration[];
  totalBreakTime: number;
}

export const useTimer = (): UseTimerReturn => {
  const [seconds, setSeconds] = useState(0);
  const [status, setStatus] = useState<TimerStatus>('idle');
  const [breakDurations, setBreakDurations] = useState<BreakDuration[]>([]);
  
  const timerRef = useRef<number | null>(null);
  const currentBreakRef = useRef<BreakDuration | null>(null);

  // Start the timer
  const start = () => {
    if (status === 'idle' || status === 'paused') {
      setStatus('running');
    }
  };

  // Pause the timer
  const pause = () => {
    if (status === 'running') {
      setStatus('paused');
    }
  };

  // Stop the timer
  const stop = () => {
    setStatus('idle');
  };

  // Take a break
  const takeBreak = () => {
    if (status === 'running') {
      setStatus('break');
      const newBreak: BreakDuration = {
        startTime: new Date(),
        duration: 0,
      };
      currentBreakRef.current = newBreak;
      setBreakDurations((prev) => [...prev, newBreak]);
    }
  };

  // Resume from break
  const resumeFromBreak = () => {
    if (status === 'break' && currentBreakRef.current) {
      const endTime = new Date();
      const breakDuration = Math.floor(
        (endTime.getTime() - currentBreakRef.current.startTime.getTime()) / 1000
      );
      
      setBreakDurations((prev) =>
        prev.map((breakItem, index) => {
          if (index === prev.length - 1) {
            return {
              ...breakItem,
              endTime,
              duration: breakDuration,
            };
          }
          return breakItem;
        })
      );
      
      currentBreakRef.current = null;
      setStatus('running');
    }
  };

  // Reset the timer
  const reset = () => {
    setSeconds(0);
    setStatus('idle');
    setBreakDurations([]);
    currentBreakRef.current = null;
  };

  // Calculate total break time
  const totalBreakTime = breakDurations.reduce(
    (total, breakItem) => total + breakItem.duration,
    0
  );

  // Timer effect
  useEffect(() => {
    if (status === 'running') {
      timerRef.current = window.setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Clean up interval on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [status]);

  return {
    seconds,
    status,
    start,
    pause,
    stop,
    takeBreak,
    resumeFromBreak,
    reset,
    breakDurations,
    totalBreakTime,
  };
};

// Format seconds to HH:MM:SS
export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    secs.toString().padStart(2, '0'),
  ].join(':');
};
