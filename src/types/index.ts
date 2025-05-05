
export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  subtasks: Subtask[];
}

export interface Subtask {
  id: string;
  title: string;
  status: 'todo' | 'in-progress' | 'completed';
}

export interface SessionData {
  taskId: string;
  subtaskId?: string;
  startTime: Date;
  endTime?: Date;
  totalDuration: number; // in seconds
  keystrokes: number;
  mouseClicks: number;
  screenshots: Screenshot[];
  breakDurations: BreakDuration[];
}

export interface Screenshot {
  id: string;
  timestamp: Date;
  imageUrl: string;
}

export interface BreakDuration {
  startTime: Date;
  endTime?: Date;
  duration: number; // in seconds
}

export type TimerStatus = 'idle' | 'running' | 'paused' | 'break';
