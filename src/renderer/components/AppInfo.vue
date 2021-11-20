<template>
  <div id="app-info">
    <div>
      <img src="assets/logo.svg">
      <h1>Electron Vue Vite</h1>
      <h2>Boilerplate</h2>
      <code>{{ info }}</code>
    </div>
  </div>
</template>

<script>
import { ipc } from '@/electron'

export default {
  name: 'AppInfo',

  data () {
    return {
      info: {}
    }
  },

  created () {
    ipc.send('request-info', null, (event, message) => {
      this.info = message
    })
  }
}
</script>

<style lang="scss">
#app-info {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  h1 {
    font-size: 36px;
    margin-bottom: 0;
  }
  h2 {
    margin-top: 0;
  }
  img {
    max-width: 300px;
  }
}
</style>
