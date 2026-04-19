import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import App from './App.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import ArtistPage from './pages/ArtistPage.jsx'
import AnalyticsPage from './pages/AnalyticsPage.jsx'
import PostPage from './pages/PostPage.jsx'

import './index.css'
import './i18n'

const queryClient = new QueryClient()

const container = document.getElementById('root')
const root = createRoot(container)

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/s/:subSlug" element={<App />} />
          <Route path="/profile/:username" element={<ProfilePage />} />
          <Route path="/artist/:slug" element={<ArtistPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/post/:id" element={<PostPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
)
