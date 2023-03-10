const { app, BrowserWindow, Menu, shell, ipcMain } = require("electron");
const path = require("path");
const { openFileAsString, checkFileList, getFileList, saveFile } = require('./handlers')

const isMac = process.platform === 'darwin'
const devURL = "http://localhost:5173";

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (app.isPackaged) {
    mainWindow.loadFile(path.join(__dirname, "../index.html"));
  } else {
    mainWindow.loadURL(devURL);
  }

  mainWindow.webContents.openDevTools();

  const menuTemplate = [
    // { role: 'appMenu' }
    ...(isMac
      ? [
          {
            label: app.name,
            submenu: [
              { role: "about" },
              { type: "separator" },
              { role: "services" },
              { type: "separator" },
              { role: "hide" },
              { role: "hideOthers" },
              { role: "unhide" },
              { type: "separator" },
              { role: "quit" },
            ],
          },
        ]
      : []),
    // { role: 'fileMenu' }
    {
      role: "fileMenu",
      label: "文件",
      submenu: [
        {
          label: "打开",
          role: "open",
          click: () => {
            const fileData = openFileAsString();
            if (fileData) mainWindow.webContents.send('open-file-string', fileData);
          },
        },
      ],
    },
    { role: "editMenu" },
    { role: "viewMenu" },
    { role: "windowMenu" },
    {
      role: "help",
      label: "帮助",
      submenu: [
        {
          label: "Learn More",
          click: async () => {
            await shell.openExternal("https://electronjs.org");
          },
        },
      ],
    },
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));

  // 检查文件列表是否存在
  ipcMain.on('check-file-list', (args, files) => {
    // console.log(files);
    mainWindow.webContents.send('check-file-list', checkFileList(files))
  })

  // 根据文件列表返回文件信息列表，同时排除不存在的文件
  ipcMain.on('get-file-list', (args, fileList = []) => {
    const list = checkFileList(fileList)
    console.log('get-file-list', list);
    mainWindow.webContents.send('get-file-list', getFileList(list))
    console.log('get-file-list, done');
  })

  // 保存文件
  ipcMain.on('save-file', async (args, path, fileData) => {
    const res = await saveFile(path, fileData)
    mainWindow.webContents.send('save-file', res)
  })
};

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (!isMac) app.quit();
});
