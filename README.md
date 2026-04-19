<<<<<<< HEAD
# 🎧 MusicaBR — AI-Powered Social Music Platform

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
=======
# 🎧 MusicaBR

MusicaBR é uma rede social de descoberta musical que combina comportamento do usuário, grafos semânticos e IA para conectar pessoas, músicas e experiências no mundo real.

A plataforma une o melhor de Spotify, Reddit, YouTube, Last.fm e TikTok — e agora evolui para algo maior: descoberta de eventos.

---

# 🚀 Visão

Transformar descoberta musical em descoberta de experiências.

Não apenas recomendar música.  
Mas conectar pessoas ao que está acontecendo.

---

# 🧠 Core do Produto

## 🔥 Feed Inteligente

- Feed híbrido (ranking estilo Reddit + comportamento do usuário)
- Personalização em tempo real
- Sistema de exploração vs explotação (multi-armed bandit)
- Persistência de aprendizado no banco

---

## 🎯 Sistema de Recomendação

- Baseado em comportamento implícito:
  - view
  - like
  - watch time
  - skip
- Modelo inspirado em TikTok + Spotify
- Aprendizado contínuo por usuário

---

## 🧩 Grafo Semântico

- Conexões entre:
  - gêneros
  - artistas
  - usuários
  - conteúdos
- Navegação não linear
- Descoberta por proximidade semântica

---

## 🔍 Mood Search

Busca por contexto emocional:

```bash
/noite chuvosa em SP
/treino pesado
/madrugada sozinho
```

* Heurística inicial
* Evolução para embeddings reais (LLM / vector search)

---

## 🧠 Banco de Dados Semântico

* Estrutura orientada a significado, não só entidades
* Integra:

  * comportamento
  * conteúdo
  * contexto
* Base para IA e recomendação

---

## 📡 Ingestão de Conteúdo

* YouTube (API oficial)
* Metadata musical
* Expansão contínua da base

---

## 🧑‍🤝‍🧑 Comunidades (subs)

* Estilo Reddit
* Feed por comunidade
* Ranking independente
* Segmentação por nicho musical

---

## 📊 Analytics + IA

* Dashboard com Plotly
* Métricas em tempo real
* Detecção automática de tendências
* Insights gerados por IA

---

## 🔔 Notificações Inteligentes

* Baseadas em comportamento real
* Não são regras fixas
* Aprendem com o usuário

---

## 🎥 UX estilo TikTok

* Scroll infinito
* Feedback implícito
* Otimização por retenção

---

# 🎟️ Eventos (Dê um rolê)

Nova camada do produto.

Integração entre:

* descoberta musical
* eventos reais

## Features

* Eventos dentro do feed
* Modal interativo
* Interesse ("vou")
* Base para:

  * ranking de eventos
  * recomendação de rolês
  * descoberta por cidade

---

# 🧠 Arquitetura

## Backend

* Django + Django Ninja
* PostgreSQL
* Modelos comportamentais
* Serviços:
>>>>>>> 168a4c1 (commit)

  * ranking
  * bandit
  * analytics
  * tendências

### 🎨 Frontend

<<<<<<< HEAD
```bash
cd frontend
npm install
npm run dev
=======
* React + Vite
* Plotly (analytics)
* Axios
* Componentização modular

---

# ⚙️ Endpoints principais

## Feed

```
GET /api/feed/rl
```

## Posts

```
GET /api/posts
```

## Mood Search

```
GET /api/mood-search?q=
```

## Graph

```
GET /api/graph?node=
```

## Analytics

```
GET /api/analytics
```

## Eventos

```
GET /api/events
GET /api/events/:id
POST /api/events/:id/going
```

## Ingest

```
POST /api/ingest
>>>>>>> 168a4c1 (commit)
```

---

<<<<<<< HEAD
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

Lucas Amaral Dourado

Medicina + Engenharia + IA + Saúde Coletiva

---

## ⭐ Contribua

Pull requests são bem-vindos.

Se quiser construir o futuro da descoberta musical:
👉 bora.
=======
# 🧪 Estado Atual

* Sistema de recomendação funcional
* Feed híbrido ativo
* Analytics funcionando
* Graph implementado
* Mood search inicial
* Eventos em fase de integração

---

# 🔮 Próximos Passos

* Embeddings reais (LLM + vector DB)
* Ranking de eventos
* Recomendação de rolês
* Social layer (amigos / presença)
* Mobile first UX
* Escala de dados

---

# ⚡ Filosofia

MusicaBR não é só uma rede de música.

É um sistema de descoberta.

Onde:

* dados viram contexto
* contexto vira recomendação
* recomendação vira experiência

---

# 🧠 Origem

O projeto evolui a partir de um conceito iniciado em 2012:

**Dê um rolê** — uma rede de descoberta de eventos.

Hoje, com a infraestrutura certa, ele finalmente volta integrado ao MusicaBR.

---

# 👤 Autor

Lucas Dourado
>>>>>>> 168a4c1 (commit)
