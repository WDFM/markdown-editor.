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
      const fileList = JSON.parse(JSON.stringify(state.fileList))
      const fileIndex = fileList.findIndex(f => f.path === file.path)
      if (fileIndex === -1) {
        fileList.push(file)
      } else {
        const newFile = Object.assign(fileList[fileIndex], file)
        fileList.splice(fileIndex, 1, newFile)
      }
      state.fileList = fileList
      storage.setFileList(fileList)
    }
  },
  actions: {

  }
})
