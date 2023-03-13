import { createStore } from 'vuex'
import storage from '../utils/storage'

export default createStore({
  state() {
    return {
      fileList: []
    }
  },
  getters: {
    fileList(state) {
      return state.fileList || []
    }
  },
  mutations: {
    setFileList(state, payload = []) {
      state.fileList = payload
      storage.setFileList(payload)
    },
    addFile(state, file) {
      console.log('store addFile:', file);
      const fileList = JSON.parse(JSON.stringify(state.fileList))
      const fileIndex = fileList.findIndex(f => f.path === file.path)
      console.log(fileIndex);
      if (fileIndex === -1 || !file.path) {
        fileList.push(file)
      } else {
        const newFile = Object.assign(fileList[fileIndex], file)
        fileList.splice(fileIndex, 1, newFile)
      }
      state.fileList = fileList
      storage.setFileList(fileList)
    },
    addNewFile(state, payload) {
      const { file, newFile } = payload
      console.log(file, newFile);
      const fileList = JSON.parse(JSON.stringify(state.fileList))
      const fileIndex = fileList.findIndex(f => f.name === file.name)
      if (fileIndex === -1) {
        fileList.push(newFile)
      } else {
        fileList.splice(fileIndex, 1, newFile)
      }
      state.fileList = fileList
      storage.setFileList(fileList)
    }
  },
  actions: {

  }
})
