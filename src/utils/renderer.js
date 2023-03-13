import { ipcRenderer } from "electron";
import store from "@/store";
import storage from "./storage";

/**
 * 获取文件
 */
const getFile = () => {
  ipcRenderer.on("get-file", (args, file) => {
    console.log(file);
  });
};
/**
 * 打开文件
 */
const openFile = () => {
  ipcRenderer.on("open-file", (args, filePath) => {
    console.log(filePath);
  });
};
/**
 * 打开文件并解析，返回文件信息
 * {
 *  name(文件名称，取自文件路径),
 *  path(文件路径),
 *  fileData(解析的文件字符创)
 * }
 * @returns
 */
const openFileAsString = () => {
  return new Promise((resolve) => {
    ipcRenderer.on("open-file-string", (args, file) => {
      console.log(file);
      store.commit("addFile", file);
      resolve(file);
    });
  });
};
/**
 * 检查文件列表是否存在，返回存在的文件的列表
 * @param {*} fileList
 */
const checkFileList = (fileList = []) => {
  ipcRenderer.send("check-file-list", fileList);
  ipcRenderer.on("check-file-list", (args, data) => {
    console.log(data);
  });
};
/**
 * 根据本地缓存的文件列表同步文件
 */
const syncFileList = () => {
  const fileList = storage.getFileList();
  ipcRenderer.send("get-file-list", fileList);
  ipcRenderer.on("get-file-list", (args, fileList) => {
    // console.log(fileList);
    store.commit("setFileList", fileList);
  });
};

/**
 * 点击菜单的保存
 * @param {*} callback 
 */
const saveFileMenu = callback => {
  ipcRenderer.on('save-file-menu', () => {
    callback && callback()
  })
}

/**
 * 保存文件
 * @param {*} path
 * @param {*} fileData
 * @returns
 */
const saveFile = (path, fileData) => {
  return new Promise((resolve, reject) => {
    ipcRenderer.send("save-file", path, fileData);
    ipcRenderer.on("save-file", (args, err) => {
      if (err) {
        reject(err);
      } else {
        resolve(path, fileData);
        // 更新文件列表
        store.commit("addFile", {
          path,
          fileData,
          tempData: fileData,
        });
      }
    });
  });
};

/**
 * 从菜单打开文件选择
 */
function openFileMenu() {
  ipcRenderer.send("open-file-menu");
}

/**
 * 菜单执行新增文档
 * @returns
 */
function addNewFile(callback) {
  ipcRenderer.on("add-new-file", () => {
    callback && callback();
  });
}

/**
 * 新建文件并保存
 * @param {*} file
 * @returns
 */
function openSaveFile(file) {
  return new Promise((resolve, reject) => {
    ipcRenderer.send("save-new-file", file);
    ipcRenderer.on("save-new-file", (args, res) => {
      console.log(res);
      if (res.fail) {
        reject(res.msg);
      } else {
        store.commit("addNewFile", { file, newFile: res });
        resolve(res);
      }
    });
  });
}

/**
 * 关闭文件
 * @param {*} callback 
 */
function closeFile(callback) {
  ipcRenderer.on('close-file', () => {
    callback && callback();
  })
}

/**
 * 响应语法菜单
 */
function onGrammerMenu(callback) {
  ipcRenderer.on('grammer-menu', (args, role) => {
    callback && callback(role)
  })
}

/**
 * 测试方法
 * @param {*} params
 */
function test(params) {
  ipcRenderer.send("test-fn", params);
}

export default {
  test,
  getFile,
  checkFileList,
  syncFileList,
  openFile,
  openFileAsString,
  saveFile,
  saveFileMenu,
  openFileMenu,
  addNewFile,
  openSaveFile,
  closeFile,
  onGrammerMenu
};
