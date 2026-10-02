<script setup lang="ts">
import { ref } from 'vue'
import { updates } from '@/electron'

const checking = ref(false)

async function checkForUpdates() {
  checking.value = true
  try {
    await updates.check()
  }
  finally {
    checking.value = false
  }
}
</script>

<template>
  <div class="flex flex-col items-center gap-3">
    <h2>About</h2>
    <button
      class="rounded-md bg-blue-500 px-3 py-1 text-white disabled:opacity-50"
      :disabled="checking"
      @click="checkForUpdates"
    >
      {{ checking ? "Checking…" : "Check for updates" }}
    </button>
  </div>
</template>
