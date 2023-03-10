import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import electron from 'vite-plugin-electron'
import electronRenderer from 'vite-plugin-electron-renderer'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': '/src/'
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        math: 'always',
        globalVars: {
          // 全局变量
        }
      }
    }
  },
  plugins: [
    vue(),
    electron({
      entry: 'electron/main.js'
    }),
    electronRenderer()
  ],
})
