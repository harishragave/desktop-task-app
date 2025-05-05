
import { useState, useEffect, useRef, useCallback } from 'react';
import { Screenshot, TimerStatus } from '../types';

interface UseScreenshotServiceReturn {
  screenshots: Screenshot[];
  takeScreenshot: () => Promise<void>;
  resetScreenshots: () => void;
}

const SCREENSHOT_INTERVAL_MS = 30 * 1000; // 30 seconds

export const useScreenshotService = (
  timerStatus: TimerStatus = 'idle',
  taskId: string = ''
): UseScreenshotServiceReturn => {
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const intervalRef = useRef<number | null>(null);

  // Take a screenshot
  const takeScreenshot = useCallback(async (): Promise<void> => {
    console.log('=== Starting screenshot process ===');
    try {
      if (!window.electron) {
        const error = 'Electron API not available - running in browser mode';
        console.warn(error);
        return;
      }

      if (!taskId) {
        console.warn('No task ID available for screenshot');
        return;
      }

      const timestamp = new Date();
      const formattedTimestamp = timestamp.toISOString().replace(/[:.]/g, '-');
      const filename = `screenshot-${taskId}-${formattedTimestamp}.png`;
      
      console.log('Initiating screenshot capture...');
      console.log('Task ID:', taskId);
      console.log('Generated filename:', filename);
      
      try {
        console.log('Calling main process to take screenshot...');
        const screenshotData = await window.electron.invoke('take-screenshot');
        
        if (!screenshotData) {
          throw new Error('Main process returned empty screenshot data');
        }
        
        console.log('Screenshot captured, size:', screenshotData.length, 'chars (base64)');
        
        console.log('Saving screenshot to file...');
        const savePath = await window.electron.invoke('save-screenshot', {
          data: screenshotData,
          filename: filename
        });
        
        if (!savePath) {
          throw new Error('Failed to save screenshot - no path returned');
        }
        
        console.log('Screenshot saved to:', savePath);
        
        // Create a new screenshot object after successful capture and save
        const newScreenshot: Screenshot = {
          id: `screenshot-${Date.now()}`,
          timestamp: timestamp,
          imageUrl: `file://${savePath}`,
        };
        
        setScreenshots(prev => [...prev, newScreenshot]);
        console.log('Screenshot added to state');
        
      } catch (invokeError) {
        console.error('Error during screenshot process:', invokeError);
        throw invokeError;
      }
      
    } catch (error) {
      console.error('=== Error in takeScreenshot ===');
      console.error('Error details:', error);
      if (error instanceof Error) {
        console.error('Error stack:', error.stack);
      }
      throw error;
    }
  }, [taskId]);

  // Reset screenshots
  const resetScreenshots = useCallback(() => {
    setScreenshots([]);
  }, []);

  // Set up interval for taking screenshots
  useEffect(() => {
    // Only take screenshots when timer is running
    const isActive = timerStatus === 'running';
    
    if (isActive) {
      // Take initial screenshot immediately
      takeScreenshot();
      
      // Set up interval for every 30 seconds
      intervalRef.current = window.setInterval(() => {
        takeScreenshot();
      }, SCREENSHOT_INTERVAL_MS);
      
      console.log(`Screenshot interval set to ${SCREENSHOT_INTERVAL_MS / 1000} seconds`);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      console.log('Screenshot interval cleared');
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timerStatus, takeScreenshot]);

  return {
    screenshots,
    takeScreenshot,
    resetScreenshots,
  };
};
