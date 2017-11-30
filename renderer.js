// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const { event_keys } = require('./constants')

const ipc = require('electron').ipcRenderer

const asyncMsgBtn = document.getElementById('async-msg')

asyncMsgBtn.addEventListener('click', function () {
    ipc.send('asynchronous-message', 'ping')
})

ipc.on('asynchronous-reply', function (event, arg) {
    const message = `Asynchronous message reply: ${arg}`
    console.log(message)

})

const { dialog } = require('electron').remote
// console.log(dialog)

dialog.showOpenDialog({properties: ['openDirectory']}, function (paths) {
    console.log(paths)

    const videos_path = paths[0]

    ipc.send(event_keys.SORTER_SEND_PATH, videos_path)

})