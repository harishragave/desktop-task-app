
import React, { useState, useEffect } from 'react';
import { Task } from '@/types';
import { api } from '@/services/api';
import { useTimer } from '@/utils/timer';
import { useActivityTracker } from '@/utils/activity';
import { useScreenshotService } from '@/services/screenshot';
import TaskCard from '@/components/TaskCard';
import TaskControls from '@/components/TaskControls';
import StatsDisplay from '@/components/StatsDisplay';
import ScreenshotGallery from '@/components/ScreenshotGallery';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const BugApp: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize hooks
  const {
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
  } = useTimer();

  // Pass timer status to activity tracker
  const { keystrokes, mouseClicks, resetActivity } = useActivityTracker(status);

  // Pass timer status to screenshot service - now using 5 minutes
  const { screenshots, takeScreenshot } = useScreenshotService(
    5, // Take screenshot every 5 minutes
    status,
    selectedTask?.id || ''
  );

  // Fetch tasks on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await api.fetchTasks();
        setTasks(data);
        if (data.length > 0) {
          setSelectedTask(data[0]);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch tasks. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Handle task selection
  const handleTaskSelect = (task: Task) => {
    // If a task is already in progress, confirm before switching
    if (status === 'running' || status === 'paused' || status === 'break') {
      const confirmed = window.confirm(
        'You have an active work session. Switching tasks will stop the current session. Continue?'
      );
      if (!confirmed) return;
      
      handleStop();
    }
    
    setSelectedTask(task);
  };

  // Handle start
  const handleStart = () => {
    if (!selectedTask) return;
    
    start();
    toast({
      title: 'Session Started',
      description: `Now tracking work on "${selectedTask.title}"`,
    });
  };

  // Handle pause
  const handlePause = () => {
    pause();
    toast({
      title: 'Session Paused',
      description: 'Your work session has been paused.',
    });
  };

  // Handle stop
  const handleStop = async () => {
    if (!selectedTask) return;
    
    // Take a final screenshot
    if (status === 'running') {
      await takeScreenshot();
    }
    
    const sessionData = {
      taskId: selectedTask.id,
      startTime: new Date(Date.now() - seconds * 1000),
      endTime: new Date(),
      totalDuration: seconds,
      keystrokes,
      mouseClicks,
      screenshots,
      breakDurations,
    };
    
    // In a real app, send this data to your API
    console.log('Session completed:', sessionData);
    
    // Reset everything
    stop();
    resetActivity();
    toast({
      title: 'Session Completed',
      description: `Work session for "${selectedTask.title}" has been saved.`,
    });
  };

  return (
    <Card className="w-full max-w-xl shadow-lg bg-[#212D40] border-none rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-[#212D40] border-b border-gray-700">
        <h1 className="text-xl font-bold text-white">Task Manager</h1>
        <Button variant="outline" className="bg-transparent text-white border-white hover:bg-gray-700">
          Configure API
        </Button>
      </div>

      <div className="p-6 bg-[#F5F5F5] dark:bg-[#212D40]">
        {/* Task Selection Section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">Select a Task</h2>
          
          {isLoading ? (
            <div className="text-gray-400">Loading tasks...</div>
          ) : tasks.length === 0 ? (
            <div className="text-gray-400">No tasks assigned to you.</div>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onSelect={handleTaskSelect}
                  isActive={selectedTask?.id === task.id}
                />
              ))}
            </div>
          )}
        </div>

        {/* Work Session - Only show if a task is selected */}
        {selectedTask && (
          <div className="mt-6">
            {/* Controls */}
            <TaskControls
              status={status}
              onStart={handleStart}
              onPause={handlePause}
              onStop={handleStop}
              onBreak={takeBreak}
              onResume={resumeFromBreak}
              className="mb-6"
            />

            {/* Stats */}
            <StatsDisplay
              seconds={seconds}
              keystrokes={keystrokes}
              mouseClicks={mouseClicks}
              breakTime={totalBreakTime}
              timerStatus={status}
            />

            {/* Screenshots */}
            <ScreenshotGallery 
              screenshots={screenshots} 
              timerStatus={status}
            />
          </div>
        )}
      </div>
    </Card>
  );
};

export default BugApp;
