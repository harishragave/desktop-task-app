
import { Task, SessionData } from '../types';

const MOCK_DELAY = 500;

// Mock data
const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Fix Dashboard Bug',
    description: 'Resolve the dashboard rendering issue in the Rebo platform',
    status: 'in-progress',
    subtasks: [
      {
        id: '1-1',
        title: 'Identify the source of the problem',
        status: 'completed',
      },
      {
        id: '1-2',
        title: 'Fix the bug',
        status: 'in-progress',
      },
      {
        id: '1-3',
        title: 'Test the solution',
        status: 'todo',
      },
    ],
  },
  {
    id: '2',
    title: 'Implement New Feature',
    description: 'Add the new analytics feature to the Rebo dashboard',
    status: 'todo',
    subtasks: [
      {
        id: '2-1',
        title: 'Create UI mockups',
        status: 'todo',
      },
      {
        id: '2-2',
        title: 'Implement frontend components',
        status: 'todo',
      },
      {
        id: '2-3',
        title: 'Connect to backend API',
        status: 'todo',
      },
    ],
  },
];

// Mock API functions
export const api = {
  // Fetch tasks assigned to the current user
  fetchTasks: async (): Promise<Task[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockTasks);
      }, MOCK_DELAY);
    });
  },

  // Send session data to the server
  sendSessionData: async (sessionData: SessionData): Promise<boolean> => {
    console.log('Sending session data:', sessionData);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, MOCK_DELAY);
    });
  },

  // Send a screenshot to the server
  uploadScreenshot: async (taskId: string, screenshot: Blob): Promise<string> => {
    console.log('Uploading screenshot for task:', taskId);
    
    // Create a mock image URL
    const imageUrl = `https://api.rebo.com/screenshots/${taskId}/${Date.now()}.jpg`;
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(imageUrl);
      }, MOCK_DELAY);
    });
  },
};
