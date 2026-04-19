# 🎧 Music Page — AI-Powered Social Music Platform

> Uma plataforma social de descoberta musical com inteligência artificial, integrando Spotify, YouTube e Last.fm em um único feed inteligente.

---

## 🚀 Visão Geral

O **Music Page** é uma rede social musical onde usuários compartilham, descobrem e interagem com músicas em um feed dinâmico.

Diferente de plataformas tradicionais, o Music Page utiliza **IA + dados externos + comportamento do usuário** para criar uma experiência altamente personalizada.

---

## 🧠 Diferencial

> Não é só um feed musical.
> É um **motor de recomendação multimodal em tempo real**.

---

## 🔥 Principais Funcionalidades

### 🎧 Feed Social

* Postagem de músicas (YouTube, Spotify, links externos)
* Sistema de votos (upvote)
* Comentários em tempo real
* Salvamento (biblioteca pessoal)
* Comunidades (estilo Reddit)

---

### 🤖 Inteligência Artificial

#### 🧠 Embeddings (LLaMA-ready)

* Representação vetorial de músicas e textos
* Base para:

  * busca semântica
  * recomendação personalizada
  * clusterização

---

#### 🔍 Busca por Mood (NLP)

```bash
/api/mood?q=dark techno
```

* Busca músicas por sentimento/texto
* Similaridade via cosine similarity
* Embeddings comparando:

  * query do usuário
  * embedding das músicas

---

#### 🔥 Playlist IA (Hybrid Ranking)

```bash
/api/playlist/hybrid?q=techno
```

Combina:

* 🎧 Spotify (tracks)
* 🎥 YouTube (vídeos)
* 🧠 IA (embedding similarity)
* 📈 Trending (popularidade)

👉 resultado: ranking híbrido inteligente

---

#### ▶️ Autoplay Inteligente

```bash
/api/autoplay/next
```

* Fila infinita baseada em:

  * histórico do usuário
  * embeddings
  * diversidade (evita bolha)
* Estrutura pronta para:

  * multi-armed bandit
  * reinforcement learning

---

#### 🧬 Sistema de Recomendação

* Ranking híbrido:

  * IA (similaridade)
  * Engajamento
  * Tendência
* Cold start resolvido via:

  * popularidade
  * clusters

---

#### 🔥 Exploração vs Exploração

* Base preparado para:

  * bandits
  * diversidade controlada
  * evitar bolha algorítmica

---

## 🌐 Integrações

### 🎧 Spotify API

* Busca de músicas
* Metadata:

  * título
  * artista
  * thumbnail
  * embed player
* Base para:

  * BPM (futuro)
  * energia da música

---

### 🎥 YouTube API

* Busca de vídeos musicais
* Embeds automáticos
* Thumbnails
* Fallback quando Spotify falha

---

### 🎵 Last.fm API

* Dados enriquecidos:

  * artistas relacionados
  * tags
  * popularidade
* Usado para:

  * grafo musical
  * expansão de recomendação

---

## 🔗 Grafo Musical

```bash
/api/graph?node=techno
```

* Conecta:

  * artistas
  * gêneros
  * músicas
* Base para:

  * descoberta exploratória
  * navegação inteligente

---

## 🎨 Frontend

### ⚛️ Stack

* React + Vite
* TailwindCSS
* React Query
* i18n (multi-idioma)

---

### ✨ Features

* Feed infinito (infinite scroll)
* Tema dark/light
* Tradução automática (pt, en, es, fr, de)
* Player embutido (Spotify + YouTube)
* Thumbnails dinâmicas
* UX moderna (hover, animações)

---

## 🏗️ Backend

### 🐍 Stack

* Django
* Django Ninja (API)
* PostgreSQL (recomendado)
* NumPy (IA)

---

### 📡 Endpoints principais

| Endpoint               | Função          |
| ---------------------- | --------------- |
| `/api/posts`           | feed            |
| `/api/mood`            | busca semântica |
| `/api/playlist/hybrid` | playlist IA     |
| `/api/autoplay/next`   | autoplay        |
| `/api/graph`           | grafo musical   |
| `/api/genres`          | gêneros         |
| `/api/subs`            | comunidades     |

---

## 🧠 Arquitetura de IA

```
User Input
   ↓
Embedding (LLaMA-ready)
   ↓
Banco vetorial (futuro: pgvector)
   ↓
Similarity Search
   ↓
Ranking híbrido
   ↓
Feed personalizado
```

---

## ⚙️ Setup

### 🔧 Backend

```bash
python -m venv venv
source venv/bin/activate

pip install -r requirements.txt

python manage.py migrate
python manage.py runserver
```

---

### 🎨 Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🔐 Variáveis de Ambiente

```env
# YouTube
YOUTUBE_API_KEY=...

# Spotify
SPOTIFY_CLIENT_ID=...
SPOTIFY_CLIENT_SECRET=...

# Last.fm
LASTFM_API_KEY=...
LASTFM_SECRET=...
```

---

## 🚀 Deploy

### 🌐 Local + Ngrok

* expõe frontend/backend
* ideal para testes rápidos

### 🏠 Self-host

* domínio próprio (ex: musicabr.org)
* nginx + gunicorn (recomendado)

---

## 🔮 Roadmap

* 🧠 LLaMA embeddings reais
* 📊 pgvector (busca vetorial)
* 🤖 reinforcement learning
* 🧪 A/B testing automático
* 🎧 análise de áudio (BPM, energia)
* 🎬 autoplay estilo TikTok
* 📱 app mobile

---

## 💣 Filosofia

> O Music Page não é sobre algoritmo.
>
> É sobre construir um **ecossistema musical vivo**,
> onde IA amplifica — não substitui — o gosto humano.

---

## 👨‍💻 Autor

Lucas Dourado
Medicina + Engenharia + IA + Saúde Coletiva

---

## ⭐ Contribua

Pull requests são bem-vindos.

Se quiser construir o futuro da descoberta musical:
👉 bora.
