
import React from 'react';
import { formatTime } from '@/utils/timer';
import { Keyboard, MousePointer } from 'lucide-react';
import { TimerStatus } from '@/types';

interface StatsDisplayProps {
  seconds: number;
  keystrokes: number;
  mouseClicks: number;
  breakTime: number;
  timerStatus: TimerStatus;
}

const StatsDisplay: React.FC<StatsDisplayProps> = ({
  seconds,
  keystrokes,
  mouseClicks,
  breakTime,
  timerStatus,
}) => {
  const actualWorkTime = Math.max(0, seconds - breakTime);
  const showActivityStats = timerStatus === 'running' || timerStatus === 'paused';

  return (
    <div className="mt-6 bg-gray-800/40 rounded-lg p-4 font-mono">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center">
          <div className="w-40 text-gray-400">Time Worked:</div>
          <div className="text-white text-lg">{formatTime(actualWorkTime)}</div>
        </div>
        
        {showActivityStats && (
          <>
            <div className="flex items-center">
              <Keyboard className="w-5 h-5 text-gray-400 mr-2" />
              <div className="w-32 text-gray-400">Keyboard:</div>
              <div className="text-white">{keystrokes} keystrokes</div>
            </div>
            
            <div className="flex items-center">
              <MousePointer className="w-5 h-5 text-gray-400 mr-2" />
              <div className="w-32 text-gray-400">Mouse:</div>
              <div className="text-white">{mouseClicks} clicks</div>
            </div>
          </>
        )}
        
        {breakTime > 0 && (
          <div className="flex items-center">
            <div className="w-40 text-gray-400">Break Time:</div>
            <div className="text-gray-400">{formatTime(breakTime)}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsDisplay;
