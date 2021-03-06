const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')
const fs = require('fs')

const ffmpeg = require('fluent-ffmpeg')

const { event_keys } = require('./constants')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


const ipc = require('electron').ipcMain

// const path = require('path')

const exampleParsedFilePath = {
    root: '/',
    dir: '/home/dolphin/Desktop/D.Va/Eichenwalde',
    base: '08-16-05.mp4',
    ext: '.mp4',
    name: '08-16-05'
}



ipc.on(event_keys.GET_INPUT_PATH, function (event, filePath) {

    console.log(filePath)

    try {
        const { ext, name, dir } = path.parse(filePath)
        const proc = ffmpeg(filePath)
            .on('codecData', function(data) {
                console.log(data);
            })
            .on('end', function() {
                console.log('file has been converted succesfully');
            })
            .on('error', function(err) {
                console.log('an error happened: ' + err.message);
            })
            .on('progress', function({ percent }) {
                console.log('progress percent: ' + percent);
            })
            .size('50%')
            .save(`${dir}/${name}2${ext}`)
    } catch (error) {
        console.log(error)
    }



})