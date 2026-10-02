import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

const root = path.resolve(import.meta.dirname)
const rootSrc = path.resolve(import.meta.dirname, 'src')
const rootRenderer = path.resolve(import.meta.dirname, 'src/renderer')

export default defineConfig({
  root: rootRenderer,
  base: './',
  plugins: [vue(), tailwindcss()],
  build: {
    outDir: path.resolve(import.meta.dirname, 'build/renderer'),
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': rootRenderer,
      '~': rootSrc,
    },
  },
  define: {
    'process.env': {},
    'process': {},
  },
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
    watch: {
      ignored: [
        `${root}/scripts/**/*`,
        `${root}/build/**/*`,
        `${root}/src/main/**/*`,
      ],
    },
  },
})
