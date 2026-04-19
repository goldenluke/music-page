#  MusicaBR

MusicaBR é uma rede social de descoberta musical que combina comportamento do usuário, grafos semânticos e inteligência artificial para conectar pessoas, músicas e experiências no mundo real.

A plataforma une o melhor de Spotify, Reddit, YouTube, Last.fm e TikTok — e evolui para algo maior: descoberta de eventos.

---

#  Visão

Transformar descoberta musical em descoberta de experiências.

Não apenas recomendar música.  
Mas conectar pessoas ao que está acontecendo.

---

#  O Problema

Hoje, a descoberta musical está fragmentada:

- Spotify recomenda, mas não conecta pessoas  
- Reddit discute, mas não personaliza  
- TikTok engaja, mas não estrutura conhecimento  
- Eventos estão desconectados da descoberta  

MusicaBR resolve isso unificando:

👉 conteúdo  
👉 comportamento  
👉 contexto  
👉 mundo real  

---

#  Core do Produto

##  Feed Inteligente

- Feed híbrido (ranking estilo Reddit + comportamento do usuário)
- Personalização em tempo real
- Sistema de exploração vs explotação (multi-armed bandit)
- Persistência de aprendizado no banco

---

##  Sistema de Recomendação

Baseado em comportamento implícito:

- 👀 view  
- ❤️ like  
- ⏱️ watch time  
- ⏭️ skip  

Inspirado em TikTok + Spotify.

---

##  Grafo Semântico

- Conecta:
  - gêneros
  - artistas
  - usuários
  - conteúdos
- Permite descoberta não linear
- Navegação por relações musicais

---

##  Mood Search

Busca por contexto emocional:

```

noite chuvosa
treino pesado
madrugada sozinho

```

- Heurística inicial
- Evolução para embeddings (LLM + vector search)

---

##  Banco de Dados Semântico

- Estrutura orientada a significado
- Integra:
  - comportamento
  - conteúdo
  - contexto
- Base para IA e recomendação

---

##  Ingestão de Conteúdo

- YouTube API
- Metadata musical
- Expansão contínua da base

---

##  Comunidades (subs)

- Estilo Reddit
- Feed por comunidade
- Ranking independente
- Segmentação por nicho

---

##  Analytics + IA

- Dashboard com Plotly
- Métricas em tempo real
- Detecção automática de tendências
- Insights baseados em dados

---

##  Notificações Inteligentes

- Baseadas em comportamento real
- Adaptativas
- Não dependem de regras fixas

---

##  UX estilo TikTok

- Scroll infinito
- Feedback implícito
- Otimização por retenção

---

#  Descoberta de Eventos (Dê um rolê)

A camada de eventos conecta música ao mundo real.

##  Implementado

- Eventos integrados ao feed  
- Eventos tratados como conteúdo recomendável  
- Modal de evento com detalhes  
- Interação “Vou” (intenção de presença)  
- Base de dados para ranking de eventos  
- Integração com comportamento do usuário  

---

##  Em desenvolvimento

###  Recomendação de Eventos

- Baseada em:
  - gosto musical
  - comportamento no feed
  - histórico de interação

---

###  Descoberta Local

- Eventos por cidade  
- Ranking local  
- Hotspots culturais  

---

###  Ranking de Eventos

- Trending events  
- Score por engajamento real  
- Atualização em tempo real  

---

###  Camada Social

- Ver quem vai  
- Eventos populares entre perfis similares  
- Formação de grupos  

---

###  IA de Tendências

- Identificação de eventos emergentes  
- Crescimento de cenas locais  
- Padrões culturais  

---

###  Música → Evento

Pipeline completo:

```

descoberta → interesse → presença

```

---

###  Histórico de Experiências

- Eventos frequentados  
- Perfil cultural do usuário  

---

#  Arquitetura

## Backend

- Django + Django Ninja  
- PostgreSQL  
- Serviços:
  - ranking
  - bandit
  - analytics
  - tendências
  - eventos  

---

## Frontend

- React + Vite  
- Plotly (analytics)  
- Axios  
- Componentização modular  

---

#  API

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

````

---

#  Setup

## 1. Clonar

```bash
git clone https://github.com/goldenluke/music-page.git
cd music-page
````

---

## 2. Backend

```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

---

## 3. Variáveis de ambiente

Crie `.env`:

```env
SECRET_KEY=...
DB_NAME=music
DB_USER=postgres
DB_PASSWORD=...
DB_HOST=localhost
DB_PORT=5432

YOUTUBE_API_KEY=...
SPOTIFY_CLIENT_ID=...
SPOTIFY_CLIENT_SECRET=...
LASTFM_API_KEY=...
```

---

## 4. Rodar backend

```bash
python manage.py migrate
python manage.py runserver
```

---

## 5. Frontend

```bash
cd frontend
npm install
npm run dev
```

---

#  Segurança

* Nunca commitar `.env`
* Nunca expor API keys no frontend
* Rotacionar credenciais em caso de vazamento
* Usar proxy backend para APIs externas

---

#  Status

* Feed híbrido funcionando
* Sistema de recomendação ativo
* Graph funcional
* Analytics operacional
* Eventos em integração

---

#  Direção

MusicaBR está evoluindo de:

```
rede de música
→ rede de descoberta
→ rede de experiências
```

---

# ⚡ Filosofia

Dados → contexto → recomendação → ação no mundo real

---

#  Origem

O projeto resgata um conceito iniciado em 2012:

**Dê um rolê** — rede de descoberta de eventos.

Agora reconstruído com IA, grafos e dados comportamentais.

---

# 👤 Autor

Lucas Amaral Dourado
