const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')
const fs = require('fs')

const ffmpeg = require('ffmpeg')

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
  // mainWindow.webContents.openDevTools()

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

function getFileExtension(file) {
    return file.split('.').pop();
}

const ipc = require('electron').ipcMain

ipc.on(event_keys.SORTER_SEND_PATH, function (event, dirPath) {
    console.log(dirPath)

    fs.readdir(dirPath, function(err, dir) {
        for (var i = 0, fileName; i < dir.length; i++) {

            fileName = dir[i]

            const fileType = getFileExtension(fileName)

            const fullPath = `${dirPath}/${fileName}`
            const fullPathGenerated = `${dirPath}/GENERATED_${fileName}`

            console.log(fullPath)

            if (fileType !== 'mp4') {
                continue
            }

            //check hero

            //check level


            try {
                var process = new ffmpeg(fullPath)

                process.then(function (video) {
                    console.log('The video is ready to be processed');

                    const { duration } = video.metadata
                    const {raw, seconds} = duration

                    const tailClipLength = 8
                    const newDuration = seconds - tailClipLength

                    // video.setVideoStartTime()
                    video
                        .setVideoDuration(newDuration)
                        .save(fullPathGenerated, function (error, file) {
                            if (!error)
                                console.log('Video file: ' + file);
                        });


                }, function (err) {
                    console.log('Error: ' + err);
                });
            } catch (e) {
                console.log(e, e.code);
                console.log(e.msg);
            }

        }

    })

})