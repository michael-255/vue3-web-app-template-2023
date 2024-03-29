import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'url'
import { defineConfig } from 'vite'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls },
    }),
    quasar({
      autoImportComponentCase: 'pascal',
    }),
  ],
  resolve: {
    alias: {
      // This lets you use the import shorthand (@*)
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  /**
   * This should be your GitHub repo name. You can find it on the GitHub URL.
   * @example
   * https://github.com/my-username/my-app-repo
   * my-app-repo
   */
  base: '/vue3-web-app-template-2023/',
})
