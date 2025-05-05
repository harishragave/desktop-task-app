import { contextBridge, ipcRenderer } from 'electron';

console.log('=== Preload script loaded ===');

// Whitelist of valid IPC channels
const validSendChannels = ['toMain'];
const validReceiveChannels = ['fromMain'];
const validInvokeChannels = ['take-screenshot', 'save-screenshot'];

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
  // For sending data to main process
  send: (channel, data) => {
    if (validSendChannels.includes(channel)) {
      console.log(`[Preload] Sending to ${channel}`, data);
      ipcRenderer.send(channel, data);
    } else {
      console.error(`[Preload] Attempted to send to invalid channel: ${channel}`);
    }
  },
  
  // For receiving data from main process
  receive: (channel, func) => {
    if (validReceiveChannels.includes(channel)) {
      console.log(`[Preload] Setting up listener for ${channel}`);
      // Deliberately strip event as it includes `sender`
      ipcRenderer.on(channel, (event, ...args) => {
        console.log(`[Preload] Received from ${channel}`, args);
        func(...args);
      });
    } else {
      console.error(`[Preload] Attempted to listen to invalid channel: ${channel}`);
    }
  },
  
  // For invoking methods in the main process and getting a response
  invoke: async (channel, ...args) => {
    console.log(`[Preload] Invoking ${channel} with args:`, args);
    
    if (!validInvokeChannels.includes(channel)) {
      const error = `Invalid channel: ${channel}`;
      console.error(`[Preload] ${error}`);
      return Promise.reject(error);
    }
    
    try {
      const result = await ipcRenderer.invoke(channel, ...args);
      console.log(`[Preload] Invoke ${channel} successful`);
      return result;
    } catch (error) {
      console.error(`[Preload] Error in invoke ${channel}:`, error);
      throw error;
    }
  }
});

console.log('[Preload] Exposed electron API to renderer');
