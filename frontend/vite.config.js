import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
                            server: {
                              port: 3000,
                              host: true, // Permite acesso via NoIP/Ngrok
                              proxy: {
                                // Tudo que for /api vai para o Django
                                '/api': {
                                  target: 'http://127.0.0.1:8000',
                            changeOrigin: true,
                                },
                                // Tudo que for /media (imagens) vai para o Django
                                '/media': {
                                  target: 'http://127.0.0.1:8000',
                            changeOrigin: true,
                                }
                              }
                            }
})
