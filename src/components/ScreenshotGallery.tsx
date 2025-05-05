
import React from 'react';
import { Screenshot, TimerStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';

interface ScreenshotGalleryProps {
  screenshots: Screenshot[];
  timerStatus: TimerStatus;
}

const ScreenshotGallery: React.FC<ScreenshotGalleryProps> = ({ screenshots, timerStatus }) => {
  const takeScreenshot = () => {
    console.log('=== Take Screenshot button clicked ===');
    console.log('window.electron exists:', !!window.electron);
    
    if (window.electron) {
      console.log('Calling take-screenshot IPC...');
      window.electron.invoke('take-screenshot')
        .then((result) => {
          console.log('Screenshot result:', result ? 'Success' : 'Failed');
          if (result) {
            console.log('Screenshot data length:', result.length);
          }
        })
        .catch((error: Error) => {
          console.error('Error in takeScreenshot:', error);
          if (error instanceof Error) {
            console.error('Error stack:', error.stack);
          }
        });
    } else {
      console.warn('Electron API not available');
    }
  };
  const recentScreenshots = screenshots.slice(-3).reverse(); // Get 3 most recent
  const showScreenshots = timerStatus === 'running' || timerStatus === 'paused';
  
  if (!showScreenshots) {
    return null; // Don't show screenshots during break or when stopped
  }

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-md font-medium text-white">Screenshot Previews (Latest First)</h3>
          <p className="text-xs text-gray-400">Screenshots are taken every 30 seconds</p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={takeScreenshot}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white border-none"
        >
          <Camera size={16} />
          Take Screenshot
        </Button>
      </div>
      {recentScreenshots.length === 0 ? (
        <div className="text-sm text-gray-400">No screenshots yet</div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            {recentScreenshots.map((screenshot) => (
              <div 
                key={screenshot.id} 
                className="border border-gray-700 rounded overflow-hidden aspect-video"
              >
                <img
                  src={screenshot.imageUrl}
                  alt={`Screenshot taken at ${screenshot.timestamp.toLocaleTimeString()}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
          <div className="text-xs text-gray-400">
            Screenshots are being saved to: Documents/BugApp/Screenshots/
          </div>
        </div>
      )}
    </div>
  );
};

export default ScreenshotGallery;
