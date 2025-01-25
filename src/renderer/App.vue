<script setup lang="ts">
import { ipc } from '@/electron'
import { ref } from 'vue'

const info = ref('')

ipc.send('request-info', null, (_, message) => {
  info.value = message
})
</script>

<template>
  <div class="app-title-bar absolute top-0 h-[30px] w-full select-none z-50" />
  <div
    class="container mx-auto p-4 flex flex-col items-center justify-center h-screen"
  >
    <img
      src="@/assets/logo.png"
      class="w-24 h-24"
    >
    <h1 class="text-3xl font-semibold _text-green-600">
      Electron Vue Boilerplate
    </h1>
    <nav class="mb-3 font-bold">
      <router-link to="/">
        Home
      </router-link>
      |
      <router-link to="/about">
        About
      </router-link>
    </nav>
    <RouterView />
    <div class="mt-4 text-gray-500">
      {{ info }}
    </div>
  </div>
</template>

<style>
.app-title-bar {
  -webkit-app-region: drag;
}
</style>
