import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [],
  build: {
    outDir: 'my-static-site/theme/assets',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/scripts/main.ts')
      },
      output: {
        entryFileNames: 'js/[name].js',
        chunkFileNames: 'js/[name].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.')
          const ext = info[info.length - 1]
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `images/[name][extname]`
          }
          if (/css/i.test(ext)) {
            return `css/[name][extname]`
          }
          return `[name][extname]`
        }
      }
    },
    manifest: true,
    emptyOutDir: true
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "bootstrap/scss/bootstrap";`
      }
    }
  }
})