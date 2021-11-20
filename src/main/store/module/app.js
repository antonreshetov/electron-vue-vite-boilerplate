const Store = require('electron-store')

const app = new Store({
  name: 'app',

  schema: {
    bounds: {
      default: null
    }
  }
})

module.exports = app
