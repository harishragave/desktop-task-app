# Rebo Time Capture - Desktop Application

This is the desktop version of the Rebo Time Capture application, built with Electron.js.

## Prerequisites

- Node.js (v16 or later)
- npm (v8 or later)

## Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server and Electron app:
   ```bash
   npm run electron:dev
   ```
   This will start both the Vite development server and the Electron app.

## Building for Production

1. Build the application:
   ```bash
   npm run electron:build
   ```
   This will create a distributable package in the `dist_electron` directory.

## Project Structure

- `electron/` - Contains the main Electron process code
  - `main.js` - Main process script
  - `preload.js` - Preload script for secure IPC
- `src/` - React application code
- `public/` - Static assets

## Security Considerations

- The application uses `contextIsolation` for security
- `nodeIntegration` is disabled for the renderer process
- All IPC communication goes through a preload script with explicit channel whitelisting

## License

MIT
