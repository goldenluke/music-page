# 🎧 MusicaBR (Music Page)

**MusicaBR** é um protótipo de rede social para descoberta musical inspirado na combinação de **Reddit, Last.fm e Spotify**.  
A plataforma permite compartilhar músicas, organizar comunidades musicais e explorar relações entre **artistas, gêneros e posts** através de um **grafo musical navegável**.

⚠️ **Status do projeto:**  
O sistema ainda está em desenvolvimento e **não está online publicamente**, pois algumas vulnerabilidades e melhorias de segurança ainda precisam ser resolvidas.  

Mesmo assim, **todo o código está disponível neste repositório** para estudo, testes e colaboração.

---

# 🌐 Arquitetura

O projeto é dividido em duas partes principais:

```
Frontend
React + Vite + Tailwind + React Query

Backend
Django + Django Ninja API
```

Estrutura geral:

```
music-page
│
├── backend (Django)
│   ├── models
│   ├── API REST
│   ├── autenticação
│   ├── notificações
│   └── seed de dados
│
└── frontend (React)
    ├── feed
    ├── comunidades
    ├── artistas
    ├── comentários
    └── UI
```

---

# 🎵 Funcionalidades Implementadas

## 📌 Feed musical

- criação de posts de música
- embeds automáticos
- suporte a:
  - YouTube
  - Spotify
  - SoundCloud
- sistema de **upvotes**
- score de posts
- comentários
- salvar posts
- compartilhamento

---

## 👥 Comunidades

Sistema inspirado em **subreddits**.

```
s/electronic
s/idm
s/hiphop
```

Funcionalidades:

- criar comunidade
- entrar / sair de comunidades
- busca de comunidades
- posts por comunidade
- sidebar de comunidades

---

## 🎧 Grafo Musical

O sistema conecta automaticamente:

```
Post
 ↓
Artist
 ↓
Genre
 ↓
Community
```

Exemplo:

```
Aphex Twin - Windowlicker
```

gera automaticamente:

```
Artist: Aphex Twin
Genre: IDM
Community: s/idm
```

---

## 👤 Artistas

Páginas automáticas de artista:

```
/artist/aphex-twin
```

mostram:

- posts do artista
- gêneros associados
- artistas relacionados
- comunidades relacionadas

---

## 🔔 Sistema Social

Implementado:

- comentários
- notificações
- perfis de usuário
- biblioteca de posts salvos
- status online (last_seen)

---

## 📝 Composer de Post

O formulário de criação de post permite:

- título da música
- URL da música
- comentário
- upload de imagem
- seleção de gênero
- seleção de comunidade

O backend automaticamente:

- detecta o artista
- gera embed
- conecta artista ↔ gênero

---

# 🎨 Frontend

Tecnologias:

- React
- Vite
- React Query
- TailwindCSS

Funcionalidades UI:

- modo claro / escuro
- scroll infinito
- filtro de posts
- layout responsivo
- UI inspirada em Spotify

Filtros disponíveis:

```
New
Top
Trending
```

---

# ⚙️ Backend

Tecnologias:

- Django
- Django Ninja API
- PostgreSQL / SQLite

A API fornece endpoints para:

```
/posts
/vote
/comments
/subs
/genres
/artists
/notifications
```

Também inclui:

- geração automática de embeds
- detecção de artista
- criação automática de gêneros
- seed de dados para popular a rede

---

# 🌱 Seed de Dados

O projeto inclui um comando para popular a rede com posts de música.

Executar:

```
python manage.py seed_posts
```

Isso cria:

- posts
- artistas
- gêneros
- comunidades

automaticamente.

---

# 💬 Chat da Comunidade

Um chat experimental foi criado para discussão musical e testes da comunidade.

Acesse:

```
https://musicabrchat.ngrok-free.app
```

O chat serve para:

- discussão musical
- sugestões de features
- testes da comunidade

---

# ⚠️ Status de Segurança

O projeto **ainda não está pronto para produção**.

Alguns pontos que ainda precisam de melhoria:

- auditoria de segurança
- rate limiting
- proteção contra spam
- validações adicionais
- melhorias na autenticação

Por isso o sistema principal ainda **não está hospedado publicamente**.

---

# 🚀 Roadmap

Próximas funcionalidades planejadas:

- grafo visual de artistas
- recomendação automática de música
- integração com APIs musicais
- descoberta baseada em grafos
- playlists comunitárias
- ranking global de músicas

---

# 📂 Instalação

## Backend

```
git clone https://github.com/goldenluke/music-page.git
cd music-page
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

---

## Frontend

```
cd frontend
npm install
npm run dev
```

---

# 📜 Licença

Copyright (c) 2026  
**Lucas Amaral Dourado**  
**João Machado**

Todos os direitos reservados.

Este software é propriedade intelectual de **Lucas Amaral Dourado e João Machado**.

O código é disponibilizado publicamente para **fins de estudo, demonstração e colaboração**, porém:

- não pode ser redistribuído comercialmente
- não pode ser utilizado para criar serviços concorrentes
- não pode ser vendido ou sublicenciado

sem autorização explícita dos autores.

Para permissões adicionais, entre em contato com os autores.

---

# 👨‍💻 Autores

**Lucas Amaral Dourado**  
Arquitetura do sistema, backend e design do grafo musical.

**João Machado**  
Colaboração no desenvolvimento e implementação da plataforma.

---

# 🎧 MusicaBR

Uma tentativa de criar uma **rede social para descoberta musical baseada em grafos e comunidades**.
