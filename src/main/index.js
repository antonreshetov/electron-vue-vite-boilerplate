const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const os = require('os')
const store = require('./store')

function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    ...store.app.get('bounds'),
    titleBarStyle: 'hidden',
    webPreferences: {
      preload: path.resolve(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: true
    }
  })

  if (process.env.NODE_ENV === 'development') {
    const rendererPort = process.argv[2]
    mainWindow.loadURL(`http://localhost:${rendererPort}`)
  } else {
    mainWindow.loadFile(path.resolve(app.getAppPath(), 'renderer/index.html'))
  }

  mainWindow.on('close', () => {
    store.app.set('bounds', mainWindow.getBounds())
  })
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

console.log(app.getPath('userData'))

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// Demo IPC communication
ipcMain.on('message', (event, message) => {
  console.log(message)
})

ipcMain.on('request-info', event => {
  event.sender.send('request-info', {
    version: app.getVersion(),
    arch: os.arch(),
    platform: process.platform
  })
})
