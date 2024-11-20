import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // 모든 IP 주소에서 접근 가능하도록 설정
    port: 5173,  // 기본 포트는 5173입니다
  },
});
