import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      // 기상청 API CORS 에러 방지를 위한 프록시 설정
      '/api/weather': {
        target: 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/weather/, ''),
      },
    },
  },
})
