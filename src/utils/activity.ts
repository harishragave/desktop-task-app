
import { useState, useEffect, useRef } from 'react';
import { TimerStatus } from '../types';

interface UseActivityTrackerReturn {
  keystrokes: number;
  mouseClicks: number;
  resetActivity: () => void;
}

export const useActivityTracker = (timerStatus: TimerStatus): UseActivityTrackerReturn => {
  const [keystrokes, setKeystrokes] = useState(0);
  const [mouseClicks, setMouseClicks] = useState(0);
  const isTrackingRef = useRef(false);

  // Update tracking state when timer status changes
  useEffect(() => {
    isTrackingRef.current = timerStatus === 'running';
  }, [timerStatus]);

  // Track keystrokes and mouse clicks
  useEffect(() => {
    const handleKeyPress = () => {
      if (isTrackingRef.current) {
        setKeystrokes((prev) => prev + 1);
      }
    };

    // Track mouse clicks
    const handleMouseClick = () => {
      if (isTrackingRef.current) {
        setMouseClicks((prev) => prev + 1);
      }
    };

    // Add event listeners
    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('mousedown', handleMouseClick);

    // Clean up
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('mousedown', handleMouseClick);
    };
  }, []);

  // Reset counts
  const resetActivity = () => {
    setKeystrokes(0);
    setMouseClicks(0);
  };

  return {
    keystrokes,
    mouseClicks,
    resetActivity,
  };
};
