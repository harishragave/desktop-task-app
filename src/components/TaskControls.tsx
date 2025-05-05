
import React from 'react';
import { Button } from "@/components/ui/button";
import { TimerStatus } from '@/types';
import { Play, Pause, StopCircle, Clock } from 'lucide-react';

interface TaskControlsProps {
  status: TimerStatus;
  onStart: () => void;
  onPause: () => void;
  onStop: () => void;
  onBreak: () => void;
  onResume: () => void;
  className?: string;
}

const TaskControls: React.FC<TaskControlsProps> = ({
  status,
  onStart,
  onPause,
  onStop,
  onBreak,
  onResume,
  className = '',
}) => {
  return (
    <div className={`flex gap-2 ${className}`}>
      {status === 'idle' || status === 'paused' ? (
        <Button 
          variant="default" 
          onClick={onStart}
          className="bg-bug-purple hover:bg-bug-purpleDark"
        >
          <Play className="mr-1 h-4 w-4" />
          Start
        </Button>
      ) : null}
      
      {status === 'running' ? (
        <Button 
          variant="outline" 
          onClick={onPause}
          className="border-bug-purple text-bug-purple hover:bg-bug-purple/10"
        >
          <Pause className="mr-1 h-4 w-4" />
          Pause
        </Button>
      ) : null}
      
      {(status === 'running' || status === 'paused') ? (
        <Button 
          variant="destructive" 
          onClick={onStop}
        >
          <StopCircle className="mr-1 h-4 w-4" />
          Stop
        </Button>
      ) : null}
      
      {status === 'running' ? (
        <Button 
          variant="ghost" 
          onClick={onBreak}
          className="text-gray-400 hover:text-white hover:bg-gray-700"
        >
          <Clock className="mr-1 h-4 w-4" />
          Break
        </Button>
      ) : null}
      
      {status === 'break' ? (
        <Button 
          variant="default" 
          onClick={onResume}
          className="bg-bug-purple hover:bg-bug-purpleDark"
        >
          <Play className="mr-1 h-4 w-4" />
          Resume
        </Button>
      ) : null}
    </div>
  );
};

export default TaskControls;
