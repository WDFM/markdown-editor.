/**
 * 这里是操作localstorage的方法
 */

const storageKeys = {
  FILE_LIST: 'mde_file_list'
}

export default {
  /**
   * 缓存打开的文件列表，为了节约资源，这里只缓存文件的路径
   * @param {*} fileList 
   */
  setFileList(fileList = []) {
    const list = JSON.parse(JSON.stringify(fileList))
    localStorage.setItem(storageKeys.FILE_LIST, JSON.stringify(list.map(v => v.path)))
  },
  /**
   * 获取缓存的文件列表
   * @returns 
   */
  getFileList() {
    return JSON.parse(localStorage.getItem(storageKeys.FILE_LIST) || '[]')
  }
}