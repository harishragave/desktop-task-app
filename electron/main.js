import { app, BrowserWindow, ipcMain, desktopCapturer, screen } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import isDev from 'electron-is-dev';
import fs from 'fs';

let mainWindow;

function createWindow() {
  // Create the browser window with secure defaults
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    show: false, // Don't show until ready-to-show
    webPreferences: {
      preload: path.join(path.dirname(fileURLToPath(import.meta.url)), 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true, // Protect against prototype pollution
      enableRemoteModule: false, // Turn off remote module
      webSecurity: !isDev, // Disable webSecurity only in development for Vite HMR
      sandbox: true
    },
    icon: path.join(path.dirname(fileURLToPath(import.meta.url)), '../public/favicon.ico')
  });

  // Load the app
  const appUrl = isDev
    ? 'http://localhost:3000' // Vite dev server on port 3000
    : `file://${path.join(__dirname, '../dist/index.html')}`; // Built app

  console.log('Loading URL:', appUrl);
  
  mainWindow.loadURL(appUrl).catch(err => {
    console.error('Failed to load URL:', err);
  });

  // Show window when page is ready
  mainWindow.once('ready-to-show', () => {
    console.log('Window is ready to show');
    mainWindow.show();
    
    // Open DevTools in development mode
    if (isDev) {
      console.log('Opening DevTools...');
      mainWindow.webContents.openDevTools();
    }
  });
  
  // Handle page load errors
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load page:', { errorCode, errorDescription });
  });

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

    // Handle screenshot requests
  ipcMain.handle('take-screenshot', async () => {
    console.log('Screenshot requested');
    try {
      const mainWindow = BrowserWindow.getFocusedWindow();
      if (!mainWindow) {
        throw new Error('No active window found');
      }
      console.log('Main window found');
      
      // Get the display that contains the window
      const display = screen.getDisplayMatching(mainWindow.getBounds());
      console.log('Display info:', {
        id: display.id,
        size: display.size,
        bounds: display.bounds
      });
      
      // Capture the screen
      console.log('Getting screen sources...');
      const sources = await desktopCapturer.getSources({
        types: ['screen'],
        thumbnailSize: display.size
      });
      
      console.log('Available sources:', sources.map(s => ({
        name: s.name,
        display_id: s.display_id,
        appIcon: !!s.appIcon,
        thumbnail: !!s.thumbnail
      })));
      
      if (sources && sources.length > 0) {
        const source = sources.find(s => s.display_id === display.id.toString()) || sources[0];
        console.log('Selected source:', source.name);
        const pngData = source.thumbnail.toPNG();
        console.log('Screenshot data size:', pngData.length, 'bytes');
        return pngData.toString('base64');
      }
      console.warn('No screen sources found');
      return null;
    } catch (error) {
      console.error('Error taking screenshot:', error);
      return null;
    }
  });

  // Handle saving screenshots
  ipcMain.handle('save-screenshot', async (event, { data, filename }) => {
    console.log('=== Starting to save screenshot ===');
    console.log('Filename:', filename);
    try {
      // Get user's documents folder
      const userFolder = app.getPath('documents');
      console.log('Documents folder:', userFolder);
      
      // Create Screenshots directory if it doesn't exist
      const screenshotsFolder = path.join(userFolder, 'BugApp', 'Screenshots');
      console.log('Screenshots folder:', screenshotsFolder);
      
      try {
        if (!fs.existsSync(screenshotsFolder)) {
          console.log('Creating screenshots directory...');
          fs.mkdirSync(screenshotsFolder, { recursive: true });
          console.log('Directory created successfully');
        } else {
          console.log('Screenshots directory already exists');
        }
        
        // Save the screenshot
        const filePath = path.join(screenshotsFolder, filename);
        console.log('Full file path:', filePath);
        
        // Convert base64 to buffer and save
        const buffer = Buffer.from(data, 'base64');
        console.log('Buffer size:', buffer.length, 'bytes');
        
        fs.writeFileSync(filePath, buffer);
        console.log('=== Screenshot saved successfully ===');
        return filePath;
      } catch (fsError) {
        console.error('File system error:', fsError);
        throw fsError;
      }
    } catch (error) {
      console.error('=== Error saving screenshot ===');
      console.error('Error details:', error);
      console.error('Error stack:', error.stack);
      return null;
    }
  });

  // Handle any unhandled errors
  mainWindow.webContents.on('did-fail-load', () => {
    console.error('Failed to load app');
  });
}

// Create window when Electron has finished initialization
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Add any IPC handlers here
ipcMain.on('toMain', (event, data) => {
  console.log('Received from renderer:', data);
  // Send data back to renderer
  mainWindow.webContents.send('fromMain', 'Hello from main process!');
});
