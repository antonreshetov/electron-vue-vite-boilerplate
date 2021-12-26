<template>
  <div class="app-title-bar" />
  <AppInfo />
</template>

<script setup lang="ts">
import AppInfo from './components/AppInfo.vue'
</script>

<style lang="scss">
body {
  margin: 0;
}
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
