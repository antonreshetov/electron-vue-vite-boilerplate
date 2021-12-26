<template>
  <div id="app-info">
    <div>
      <img src="/assets/logo.svg">
      <h1>Electron Vue Vite</h1>
      <h2>Boilerplate</h2>
      <code>{{ info }}</code>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ipc } from '@/electron'

const info = ref('')

ipc.send('request-info', null, (_, message) => {
  info.value = message
})
</script>

<style scoped lang="scss">
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
