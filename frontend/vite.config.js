import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],

                            server: {
                              port: 3001,
                              host: true,

                              // Permite acesso via ngrok
                              allowedHosts: [
                                "labsus.ngrok-free.app",
                                "musicpage.ngrok-free.app",
                                "musicabrchat.ngrok-free.app"
                              ],

                              proxy: {
                                // API Django
                                '/api': {
                                  target: 'http://127.0.0.1:8000',
                            changeOrigin: true,
                                },

                            // Arquivos de mídia do Django
                            '/media': {
                              target: 'http://127.0.0.1:8000',
                            changeOrigin: true,
                            }
                              }
                            }
})
