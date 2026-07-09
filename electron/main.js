const { app, BrowserWindow, Menu } = require("electron");
const path = require("path");
const { spawn } = require("child_process");

const isDev = !app.isPackaged;

let mainWindow;
let serverProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    title: "SAMStack Tech",
    icon: path.join(__dirname, "..", "public", "logo.png"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
    show: false,
    backgroundColor: "#09090b",
  });

  const menu = Menu.buildFromTemplate([
    {
      label: "SAMStack Tech",
      submenu: [
        { role: "about" },
        { type: "separator" },
        { role: "quit" },
      ],
    },
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        { role: "selectAll" },
      ],
    },
    {
      label: "View",
      submenu: [
        { role: "reload" },
        { role: "forceReload" },
        { role: "toggleDevTools" },
        { type: "separator" },
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" },
        { type: "separator" },
        { role: "togglefullscreen" },
      ],
    },
    {
      label: "Navigate",
      submenu: [
        {
          label: "Home",
          click: () => mainWindow.loadURL(isDev ? "http://localhost:3000" : "http://localhost:3456"),
        },
        { type: "separator" },
        { label: "Back", accelerator: "CmdOrCtrl+[", click: () => mainWindow.webContents.goBack() },
        { label: "Forward", accelerator: "CmdOrCtrl+]", click: () => mainWindow.webContents.goForward() },
      ],
    },
    {
      label: "Help",
      submenu: [
        {
          label: "SAMStack Tech Website",
          click: () => mainWindow.loadURL(isDev ? "http://localhost:3000" : "http://localhost:3456"),
        },
      ],
    },
  ]);

  Menu.setApplicationMenu(menu);

  if (isDev) {
    mainWindow.loadURL("http://localhost:3000");
    mainWindow.webContents.openDevTools({ mode: "detach" });
  } else {
    startProductionServer();
  }

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

function startProductionServer() {
  const serverPath = path.join(process.resourcesPath, "server", "server.js");

  serverProcess = spawn("node", [serverPath], {
    env: { ...process.env, PORT: "3456" },
    stdio: "pipe",
  });

  serverProcess.stdout.on("data", (data) => {
    console.log(`[Next.js Server] ${data}`);
  });

  serverProcess.stderr.on("data", (data) => {
    console.error(`[Next.js Server Error] ${data}`);
  });

  setTimeout(() => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.loadURL("http://localhost:3456");
    }
  }, 3000);
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (serverProcess) {
    serverProcess.kill();
  }
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

app.on("before-quit", () => {
  if (serverProcess) {
    serverProcess.kill();
  }
});
