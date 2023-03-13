const { app, BrowserWindow, Menu, shell, ipcMain } = require("electron");
const path = require("path");
const {
  openFileAsString,
  checkFileList,
  getFileList,
  saveFile,
  openFileSave,
} = require("./handlers");

const isMac = process.platform === "darwin";
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

  const grammerMenuFn = require("./menus/grammerMenu.js");
  const grammerMenu = grammerMenuFn(mainWindow);
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
          label: "新建文档",
          role: "add",
          id: "addFile",
          accelerator: isMac ? "Cmd + N" : "Ctrl + N",
          click: () => {
            mainWindow.webContents.send("add-new-file");
          },
        },
        {
          label: "打开文档",
          role: "open",
          id: "openFile",
          accelerator: isMac ? "Cmd + Shift + O" : "Ctrl + Shift + O",
          click: () => {
            const fileData = openFileAsString();
            if (fileData)
              mainWindow.webContents.send("open-file-string", fileData);
          },
        },
        { type: "separator" },
        {
          label: "关闭",
          role: "closeFile",
          id: "closeFile",
          accelerator: isMac ? "Cmd + W" : "Ctrl + W",
          click: () => {
            mainWindow.webContents.send("close-file");
          },
        },
        {
          label: "保存",
          role: "save",
          id: "saveFile",
          accelerator: isMac ? "Cmd + S" : "Ctrl + S",
          click: () => {
            console.log(mainWindow);
            mainWindow.webContents.send("save-file-menu");
          },
        },
      ],
    },
    // 编辑菜单
    { role: "editMenu", label: "编辑" },
    // 语法
    { ...grammerMenu },
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
  const menus = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menus);

  // 检查文件列表是否存在
  ipcMain.on("check-file-list", (args, files) => {
    // console.log(files);
    mainWindow.webContents.send("check-file-list", checkFileList(files));
  });

  // 根据文件列表返回文件信息列表，同时排除不存在的文件
  ipcMain.on("get-file-list", (args, fileList = []) => {
    const list = checkFileList(fileList);
    mainWindow.webContents.send("get-file-list", getFileList(list));
    console.log("get-file-list, done");
  });

  // 保存文件
  ipcMain.on("save-file", async (args, path, fileData) => {
    const res = await saveFile(path, fileData);
    mainWindow.webContents.send("save-file", res);
  });

  // 打开文件
  ipcMain.on("open-file-menu", () => {
    const openFileMenu = menus.getMenuItemById("openFile");
    openFileMenu.click();
  });

  // 新建文件并保存
  ipcMain.on("save-new-file", async (args, file) => {
    const res = await openFileSave(mainWindow, file);
    mainWindow.webContents.send("save-new-file", res);
  });

  // 测试
  ipcMain.on("test-fn", (args, params) => {});
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
