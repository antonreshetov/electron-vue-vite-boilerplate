const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {
  ipc: {
    on: (channel, cb) => ipcRenderer.on(channel, cb),
    send: (channel, data, cb) => {
      ipcRenderer.send(channel, data)
      if (cb && typeof cb === 'function') {
        ipcRenderer.on(channel, cb)
      }
    },
    removeListener: (channel, cb) => ipcRenderer.removeListener(channel, cb),
    removeListeners: channel => ipcRenderer.removeAllListeners(channel)
  }
})
