<template>
  <div class="app-title-bar" />
  <AppInfo />
</template>

<script>
import AppInfo from './components/AppInfo.vue'
import { ipc } from '@/electron'

export default {
  name: 'App',

  components: {
    AppInfo
  },

  data () {
    return {
      x: 2
    }
  },

  created () {
    ipc.send('message', 'Hello from App.vue!', () => {})
  }
}
</script>

<style lang="scss">
.app {
  &-title-bar {
    position: absolute;
    top: 0;
    width: 100%;
    height: 30px;
    user-select: none;
    -webkit-app-region: drag;
    z-index: 1010;
    transition: all 0.5s;
  }
}
</style>
