const isMac = process.platform === "darwin";

module.exports = function (mainWindow) {
  return {
    role: "grammer",
    label: "语法",
    submenu: [
      {
        role: "h",
        label: "标题1~6",
        submenu: [
          {
            role: "h1",
            label: "标题1",
            accelerator: isMac ? "Cmd + 1" : "Ctrl + 1",
            click: () => { mainWindow.webContents.send("grammer-menu", "h1") }
          },
          {
            role: "h2",
            label: "标题2",
            accelerator: isMac ? "Cmd + 2" : "Ctrl + 2",
            click: () => { mainWindow.webContents.send("grammer-menu", "h2") }
          },
          {
            role: "h3",
            label: "标题3",
            accelerator: isMac ? "Cmd + 3" : "Ctrl + 3",
            click: () => { mainWindow.webContents.send("grammer-menu", "h3") }
          },
          {
            role: "h4",
            label: "标题4",
            accelerator: isMac ? "Cmd + 4" : "Ctrl + 4",
            click: () => { mainWindow.webContents.send("grammer-menu", "h4") }
          },
          {
            role: "h5",
            label: "标题5",
            accelerator: isMac ? "Cmd + 5" : "Ctrl + 5",
            click: () => { mainWindow.webContents.send("grammer-menu", "h5") }
          },
          {
            role: "h6",
            label: "标题6",
            accelerator: isMac ? "Cmd + 6" : "Ctrl + 6",
            click: () => { mainWindow.webContents.send("grammer-menu", "h6") }
          },
        ],
      },
      { type: "separator" },
      {
        role: "bold",
        label: "粗体",
        accelerator: isMac ? "Cmd + B" : "Ctrl + B",
        click: () => {
          mainWindow.webContents.send("grammer-menu", "bold")
        }
      },
      {
        role: "italic",
        label: "斜体",
        accelerator: isMac ? "Cmd + I" : "Ctrl + I",
        click: () => {
          mainWindow.webContents.send("grammer-menu", "italic")
        }
      },
      {
        role: "strikethrough",
        label: "删除线",
        accelerator: isMac ? "Cmd + E" : "Ctrl + E",
        click: () => {
          mainWindow.webContents.send("grammer-menu", "strikethrough")
        }
      },
      {
        role: "quote",
        label: "引用",
        accelerator: isMac ? "Cmd + Shift + Q" : "Ctrl + Shift + Q",
        click: () => {
          mainWindow.webContents.send("grammer-menu", "quote")
        }
      },
      { type: "separator" },
      {
        role: "ul",
        label: "无序列表",
        accelerator: isMac ? "Cmd + L" : "Ctrl + L",
        click: () => {
          mainWindow.webContents.send("grammer-menu", "ul")
        }
      },
      {
        role: "ol",
        label: "有序列表",
        accelerator: isMac ? "Cmd + Shift + L" : "Ctrl + Shift + L",
        click: () => {
          mainWindow.webContents.send("grammer-menu", "ol")
        }
      },
      {
        role: "table",
        label: "表格",
        accelerator: isMac ? "Cmd + T" : "Ctrl + T",
        click: () => {
          mainWindow.webContents.send("grammer-menu", "table")
        }
      },
      {
        role: "hr",
        label: "分割线",
        accelerator: isMac ? "Cmd + D" : "Ctrl + D",
        click: () => {
          mainWindow.webContents.send("grammer-menu", "hr")
        }
      },
      { type: "separator" },
      {
        role: "link",
        label: "链接",
        accelerator: isMac ? "Cmd + Shif + L" : "Ctrl + Shif + L",
        click: () => {
          mainWindow.webContents.send("grammer-menu", "link")
        }
      },
      {
        role: "image",
        label: "插入图片",
        submenu: [
          {
            role: 'image-link',
            label: '网络图片',
            accelerator: isMac ? "Cmd + Shift + I" : "Ctrl + Shift + I",
            click: () => {
              mainWindow.webContents.send("grammer-menu", "image-link")
            }
          },
          {
            role: 'upload-image',
            label: '本地图片',
            accelerator: isMac ? "Cmd + Shift + U" : "Ctrl + Shift + U",
            click: () => {
              mainWindow.webContents.send("grammer-menu", "upload-image")
            }
          }
        ]
      },
      {
        role: "code",
        label: "代码块",
        accelerator: isMac ? "Cmd + Shift + K" : "Ctrl + Shift + K",
        click: () => {
          mainWindow.webContents.send("grammer-menu", "code")
        }
      },
      { type: "separator" },
      {
        role: "tip-menu",
        label: "提示信息",
        submenu: [
          {
            role: "tip-tip",
            label: "提示",
            click: () => {
              mainWindow.webContents.send("grammer-menu", "tip-tip")
            }
          },
          {
            role: "tip-warning",
            label: "注意",
            click: () => {
              mainWindow.webContents.send("grammer-menu", "tip-warning")
            }
          },
          {
            role: "tip-danger",
            label: "警告",
            click: () => {
              mainWindow.webContents.send("grammer-menu", "tip-danger")
            }
          },
          {
            role: "tip-details",
            label: "详细信息",
            click: () => {
              mainWindow.webContents.send("grammer-menu", "tip-details")
            }
          },
        ]
      },
      // https://katex.org/
      {
        role: "katex",
        label: "数学公式",
        click: () => {
          mainWindow.webContents.send("grammer-menu", "katex")
        }
      },
      // https://mermaid.js.org/syntax/flowchart.html#links-between-nodes
      // {
      //   role: "mermaid",
      //   label: "流程图",
      //   click: () => {
      //     mainWindow.webContents.send("grammer-menu", "mermaid")
      //   }
      // },
      {
        role: "todo",
        label: "待办",
        click: () => {
          mainWindow.webContents.send("grammer-menu", "todo")
        }
      }
    ],
  };
};
