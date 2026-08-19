import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// GitHub Pages 專案頁是 https://<user>.github.io/<repo>/，資源要走子路徑。
// 之後若接自訂網域，build 時用 VITE_BASE=/ 覆蓋。
const base = process.env.VITE_BASE ?? '/susunfilm/'

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
  // react-router-dom 被預先打包時會帶進第二份 React，導致 "Invalid hook call"
  resolve: { dedupe: ['react', 'react-dom'] },
  optimizeDeps: { include: ['react', 'react-dom', 'react-dom/client', 'react-router-dom'] },
  server: { port: 5273 },
})
