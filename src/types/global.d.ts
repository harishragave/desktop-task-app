// Type definitions for Electron IPC communication

interface ElectronAPI {
  send: (channel: string, data: any) => void;
  receive: (channel: string, func: (...args: any[]) => void) => void;
  invoke: (channel: string, ...args: any[]) => Promise<any>;
}

declare global {
  interface Window {
    electron?: ElectronAPI;
  }
}

export {}; // This ensures the file is treated as a module
