import { app, dialog } from 'electron'
import { autoUpdater } from 'electron-updater'

const CHECK_INTERVAL = 3 * 60 * 60 * 1000
let initialized = false
let checking: Promise<void> | undefined
let downloading = false
let downloadedVersion: string | undefined
let prepareToQuit: () => void

async function offerInstallation() {
  const { response } = await dialog.showMessageBox({
    type: 'info',
    message: `Version ${downloadedVersion} is ready to install.`,
    detail: 'Restart now, or install the update when you quit the application.',
    buttons: ['Restart and install', 'Later'],
    defaultId: 0,
    cancelId: 1,
  })
  if (response === 0) {
    // quitAndInstall closes windows before Electron emits before-quit.
    prepareToQuit()
    autoUpdater.quitAndInstall()
  }
}

export async function checkForUpdates(manual = false): Promise<void> {
  if (!app.isPackaged) {
    if (manual) {
      await dialog.showMessageBox({
        message: 'Updates are available in installed builds only.',
      })
    }
    return
  }
  if (downloadedVersion) {
    if (manual)
      await offerInstallation()
    return
  }
  if (checking) {
    await checking
    if (manual)
      return checkForUpdates(true)
    return
  }

  checking = (async () => {
    try {
      const result = await autoUpdater.checkForUpdates()
      if (manual) {
        await dialog.showMessageBox({
          message: result?.isUpdateAvailable
            ? `Downloading version ${result.updateInfo.version}…`
            : 'You are using the latest version.',
        })
      }
    }
    catch (error) {
      console.error('Error checking for updates:', error)
      if (manual) {
        await dialog.showMessageBox({
          type: 'error',
          message: 'Unable to check for updates.',
          detail: 'Please check your connection and try again later.',
        })
      }
    }
  })()
  try {
    await checking
  }
  finally {
    checking = undefined
  }
}

export function initializeUpdates(beforeInstall: () => void) {
  if (!app.isPackaged || initialized)
    return
  initialized = true
  prepareToQuit = beforeInstall
  autoUpdater.autoDownload = false
  autoUpdater.autoInstallOnAppQuit = true
  autoUpdater.allowPrerelease = false
  autoUpdater.logger = null

  autoUpdater.on('update-available', () => {
    if (downloading || downloadedVersion)
      return
    downloading = true
    void autoUpdater
      .downloadUpdate()
      .catch((error) => {
        console.error('Error downloading update:', error)
      })
      .finally(() => {
        downloading = false
      })
  })
  autoUpdater.on('update-downloaded', (info) => {
    downloadedVersion = info.version
    void offerInstallation().catch(console.error)
  })
  autoUpdater.on('error', error =>
    console.error('Auto-update error:', error))

  void checkForUpdates()
  const timer = setInterval(() => void checkForUpdates(), CHECK_INTERVAL)
  timer.unref()
  app.once('will-quit', () => clearInterval(timer))
}
