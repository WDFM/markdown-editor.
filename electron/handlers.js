const { dialog } = require('electron')
const fs = require('fs')
const path = require('path')

/**
 * 选择并获取文件路径
 * @param {*} properties 
 * @returns 文件路径数组
 */
function openFile(properties = ['openFile']) {
  return dialog.showOpenDialogSync({
    title: '选择文件',
    properties,
    filters: [
      { name: 'Markdown', extensions: ['md'] }
    ]
  })
}

/**
 * 根据文件的路径获取文件信息
 * @param {*} filePath 
 * @returns 
 */
function getFile(filePath) {
  if (!filePath) return null
  const fileData = fs.readFileSync(filePath, { encoding: 'utf8' })
  return {
    name: path.basename(filePath),
    path: filePath,
    fileData
  }
}

/**
 * 根据文件列表获取文件信息列表
 * @param {*} fileList 
 * @returns 
 */
function getFileList(fileList = []) {
  return fileList.map(v => getFile(v))
}

/**
 * 选择文件并解析，获取文件数据
 * @param {*} properties 
 * @returns 文件数据
 */
function openFileAsString(properties = ['openFile']) {
  const filePaths = openFile(properties)
  if (!filePaths || !filePaths[0]) return
  const filePath = filePaths[0]
  const fileData = fs.readFileSync(filePath, { encoding: 'utf8' })
  // console.log(fileData)
  return {
    name: path.basename(filePath),
    path: filePath,
    fileData
  }
}

/**
 * 判断文件是否存在
 * @param {*} filePath 
 * @returns {boolean}
 */
function checkFileExist(filePath) {
  if (!filePath) return false
  return fs.existsSync(filePath)
}

/**
 * 检查文件列表是否存在，返回存在的文件
 * @param {*} fileList 
 * @param {*} pathKey 文件列表中的文件对象存放文件路径的键，例如[{path:'文件路径',name:'文件名'}]，pathKey为path 
 * @returns {Array} 存在的列表
 */
function checkFileList(fileList = [], pathKey) {
  return fileList.filter(f => {
    if (pathKey) return checkFileExist(f[pathKey])
    return checkFileExist(f)
  })
}

/**
 * 保存文件
 * @param {*} path 
 * @param {*} fileData 
 * @returns 
 */
function saveFile(path, fileData = '') {
  if (!path) return
  return new Promise((resolve, reject) => {
    fs.writeFile(path, fileData, err => {
      console.log('handler saveFile', err);
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

module.exports = {
  getFile,
  getFileList,
  openFile,
  openFileAsString,
  checkFileExist,
  checkFileList,
  saveFile
}