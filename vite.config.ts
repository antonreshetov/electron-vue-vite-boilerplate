import path from 'node:path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

const root = path.resolve(__dirname)
const rootSrc = path.resolve(__dirname, 'src')
const rootRenderer = path.resolve(__dirname, 'src/renderer')

export default defineConfig({
  root: rootRenderer,
  base: './',
  plugins: [vue()],
  build: {
    outDir: path.resolve(__dirname, 'build/renderer'),
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': rootRenderer,
      '~': rootSrc,
    },
  },
  server: {
    watch: {
      ignored: [
        `${root}/scripts/**/*`,
        `${root}/build/**/*`,
        `${root}/src/main/**/*`,
      ],
    },
  },
})
