import { app, BrowserWindow } from "electron";

const isDevelopment = process.env.NODE_ENV !== "production";

let mainWindow: BrowserWindow;

function createMainWindow() {
  const window = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // Set url for `win`
  // points to `webpack-dev-server` in development
  // points to `index.html` in production
  const url = isDevelopment
    ? `http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`
    : `file://${__dirname}/index.html`;

  if (isDevelopment) {
    window.webContents.on("did-frame-finish-load", () => {
      window.webContents.once("devtools-opened", () => {
        window.focus();
      });
      window.webContents.openDevTools({
        mode: "bottom"
      });
    });
  }

  window.loadURL(url);

  window.on("closed", () => {
    mainWindow = null;
  });

  return window;
}

app.on("window-all-closed", () => {
  // On macOS it is common for applications to stay open
  // until the user explicitly quits
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  // On macOS it is common to re-create a window
  // even after all windows have been closed
  if (mainWindow === null) mainWindow = createMainWindow();
});

// Create main BrowserWindow when electron is ready
app.on("ready", () => {
  mainWindow = createMainWindow();
});
