import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // 確保 @ 指向 src 資料夾
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8081', // 後端 API 地址
        changeOrigin: true,
      },
    },
  },
  // 新增這行，base 設定為你的 GitHub Repository 名稱
  base: '/Vue_Insurance2/',
});
