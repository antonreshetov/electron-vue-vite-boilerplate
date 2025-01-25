/* eslint-disable node/prefer-global/process */
import os from 'node:os'
import path from 'node:path'
import { app, BrowserWindow, ipcMain } from 'electron'
import { store } from './store'

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true' // Отключаем security warnings

const isDev = process.env.NODE_ENV === 'development'

let mainWindow: BrowserWindow
let isQuitting = false

function createWindow() {
  const bounds = store.app.get('bounds')
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    ...bounds,
    titleBarStyle: 'hidden',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  }
  else {
    mainWindow.loadFile(
      path.join(__dirname, '../../build/renderer/index.html'),
    )
  }

  mainWindow.on('close', (event) => {
    store.app.set('bounds', mainWindow.getBounds())

    if (!isQuitting) {
      event.preventDefault()
      mainWindow.hide()
    }
    else {
      mainWindow.destroy()
    }
  })
}

app.whenReady().then(createWindow)

app.on('activate', () => {
  mainWindow.show()
})

app.on('before-quit', () => {
  isQuitting = true
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin')
    app.quit()
})

ipcMain.on('message', (event, message) => {
  // eslint-disable-next-line no-console
  console.log(message)
})

ipcMain.on('request-info', (event) => {
  event.sender.send('request-info', {
    version: app.getVersion(),
    arch: os.arch(),
    platform: process.platform,
  })
})
