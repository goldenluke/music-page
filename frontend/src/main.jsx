import React from 'react'
import { createRoot } from 'react-dom/client' // Importação correta para React 18
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.jsx'
import ProfilePage from './pages/ProfilePage.jsx' // Certifique-se de criar este arquivo
import './index.css'
import './i18n' // Importa a configuração de idiomas
import ArtistPage from "./pages/ArtistPage"

// 1. Instância do cliente de cache (React Query)
const queryClient = new QueryClient()

// 2. Seleciona o elemento root do HTML
const container = document.getElementById('root')
const root = createRoot(container)

// 3. Renderiza o App com Rotas e Query Client
root.render(
  <React.StrictMode>
  <QueryClientProvider client={queryClient}>
  <BrowserRouter>
  <Routes>
  {/* Rota principal: Feed da Music Page */}
  <Route path="/" element={<App />} />
  <Route path="/s/:subSlug" element={<App />} />
  {/* Rota de Perfil: u/username */}
  <Route path="/profile/:username" element={<ProfilePage />} />
  <Route path="/artist/:slug" element={<ArtistPage />} />
  </Routes>
  </BrowserRouter>
  </QueryClientProvider>
  </React.StrictMode>
)
