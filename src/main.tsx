import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

// Handle any Electron-specific initialization
if (window.electron) {
  // Example of using Electron IPC
  window.electron.receive('fromMain', (data: any) => {
    console.log('Received from main process:', data);
  });
}

// Render the app
createRoot(document.getElementById("root")!).render(<App />);
