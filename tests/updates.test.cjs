const assert = require('node:assert/strict')
const { EventEmitter } = require('node:events')
const { readFileSync } = require('node:fs')
const { test } = require('node:test')
const { runInNewContext } = require('node:vm')

function setup(packaged = true) {
  const app = Object.assign(new EventEmitter(), { isPackaged: packaged })
  const updater = new EventEmitter()
  const messages = []
  const order = []
  let checks = 0
  let downloads = 0
  let response = 1
  let timerCallback
  let interval
  let cleared = false
  updater.checkForUpdates = async () => {
    checks++
    return { isUpdateAvailable: false }
  }
  updater.downloadUpdate = async () => {
    downloads++
  }
  updater.quitAndInstall = () => order.push('install')
  const exports = {}
  runInNewContext(readFileSync('build/main/updates/index.js', 'utf8'), {
    exports,
    require: (name) => {
      if (name === 'electron') {
        return { app, dialog: { showMessageBox: async (options) => {
          messages.push(options)
          return { response }
        } } }
      }
      if (name === 'electron-updater')
        return { autoUpdater: updater }
      throw new Error(name)
    },
    console: { error() {} },
    setInterval: (fn, ms) => {
      timerCallback = fn
      interval = ms
      return { unref() {} }
    },
    clearInterval: () => { cleared = true },
  })
  return {
    app,
    updater,
    messages,
    order,
    api: exports,
    initialize: () => exports.initializeUpdates(() => order.push('prepare')),
    tick: () => timerCallback(),
    respond: (value) => { response = value },
    get checks() { return checks },
    get downloads() { return downloads },
    get interval() { return interval },
    get cleared() { return cleared },
  }
}

const flush = () => new Promise(resolve => setImmediate(resolve))

test('development never contacts the update service', async () => {
  const s = setup(false)
  s.initialize()
  await s.api.checkForUpdates(true)
  assert.equal(s.checks, 0)
  assert.match(s.messages[0].message, /installed builds/)
})

test('checks at startup and every three hours, installs listeners once, cleans timer', async () => {
  const s = setup()
  s.initialize()
  s.initialize()
  await flush()
  assert.equal(s.checks, 1)
  assert.equal(s.updater.listenerCount('update-available'), 1)
  assert.equal(s.interval, 3 * 60 * 60 * 1000)
  s.tick()
  await flush()
  assert.equal(s.checks, 2)
  s.app.emit('will-quit')
  assert.equal(s.cleared, true)
})

test('downloads once and prepares window lifecycle before installing', async () => {
  const s = setup()
  s.initialize()
  await flush()
  s.updater.emit('update-available', { version: '2.3.8' })
  s.updater.emit('update-available', { version: '2.3.8' })
  assert.equal(s.downloads, 1)
  s.updater.emit('update-downloaded', { version: '2.3.8' })
  await flush()
  assert.deepEqual(s.order, [])
  s.respond(0)
  await s.api.checkForUpdates(true)
  assert.deepEqual(s.order, ['prepare', 'install'])
  assert.equal(s.updater.autoInstallOnAppQuit, true)
})

test('manual network failures show an error instead of claiming no updates', async () => {
  const s = setup()
  s.initialize()
  await flush()
  s.updater.checkForUpdates = async () => {
    throw new Error('offline')
  }
  await s.api.checkForUpdates(true)
  assert.equal(s.messages.at(-1).type, 'error')
})

test('download failure permits a retry on the next check', async () => {
  const s = setup()
  s.initialize()
  await flush()
  let attempts = 0
  s.updater.downloadUpdate = async () => {
    attempts++
    throw new Error('offline')
  }
  s.updater.emit('update-available')
  await flush()
  s.updater.emit('update-available')
  await flush()
  assert.equal(attempts, 2)
})
