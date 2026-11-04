import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: loadEnv(mode, process.cwd(), '').VITE_BASE_PATH || '/Ehashanul-Portfolio-Final/',
}))
