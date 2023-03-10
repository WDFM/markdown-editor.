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
  return new Promise(resolve => {
    ipcRenderer.on("open-file-string", (args, file) => {
      console.log(file);
      store.commit("addFile", file);
      resolve(file)
    });
  })
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
  ipcRenderer.send('get-file-list', fileList)
  ipcRenderer.on('get-file-list', (args, fileList) => {
    // console.log(fileList);
    store.commit('setFileList', fileList)
  })
};

/**
 * 保存文件
 * @param {*} path 
 * @param {*} fileData 
 * @returns 
 */
const saveFile = (path, fileData) => {
  return new Promise((resolve, reject) => {
    ipcRenderer.send('save-file', path, fileData)
    ipcRenderer.on('save-file', (args, err) => {
      console.log(err)
      if (err) {
        reject(err)
      } else {
        resolve(path, fileData)
        // 更新文件列表
        store.commit('addFile', {
          path,
          fileData,
          tempData: fileData
        })
      }
    })
  })
}

export default {
  getFile,
  checkFileList,
  syncFileList,
  openFile,
  openFileAsString,
  saveFile
};
