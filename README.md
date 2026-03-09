# Music Page

Plataforma open source de descoberta musical inspirada em comunidades colaborativas como o Reddit.

O objetivo do projeto é criar um espaço onde usuários possam compartilhar músicas, discutir lançamentos, descobrir artistas e organizar conteúdos musicais em comunidades temáticas.

A curadoria é feita pela própria comunidade através de votos, comentários e participação ativa.

---

## Ideia do Projeto

Hoje a maior parte da descoberta musical depende de algoritmos de plataformas de streaming. Embora eficientes, esses algoritmos muitas vezes limitam a diversidade de descobertas.

Este projeto busca criar uma alternativa baseada em comunidade.

A proposta inclui:

- comunidades musicais organizadas por gênero ou tema  
- compartilhamento de músicas e lançamentos  
- sistema de votos para destacar conteúdos relevantes  
- comentários e discussões  
- biblioteca pessoal de músicas salvas  
- notificações de interações  
- presença online de usuários  

A ideia é permitir desde descobertas populares até garimpos underground.

---

## Tecnologias Utilizadas

Backend

- Python
- Django
- Django Ninja
- Django ORM
- SQLite (desenvolvimento)

Frontend

- React
- Vite
- Javascript

Outros

- REST API
- Arquitetura modular
- Projeto open source

---

## Estrutura do Projeto

```
music-page/
│
├── core/                # Configurações do Django
│
├── music/               # Aplicação principal
│   ├── models.py
│   ├── api.py
│   ├── middleware.py
│   ├── signals.py
│
├── frontend/            # Aplicação React
│
├── manage.py
├── popula_banco.py
└── db.sqlite3
```

---

## Funcionalidades

- autenticação de usuários  
- criação de comunidades  
- criação de posts musicais  
- sistema de votos  
- comentários  
- salvar posts  
- notificações de interação  
- perfil de usuário  
- organização por gênero musical  
- presença online  

---

## Instalação

### 1. Clonar o repositório

```
git clone https://github.com/seuusuario/music-page.git
cd music-page
```

---

### 2. Criar ambiente virtual

Linux / Mac

```
python3 -m venv venv
source venv/bin/activate
```

Windows

```
python -m venv venv
venv\Scripts\activate
```

---

### 3. Instalar dependências

```
pip install django
pip install django-ninja
pip install django-cors-headers
pip install pillow
```

---

### 4. Rodar migrações

```
python manage.py migrate
```

---

### 5. Popular banco inicial

```
python popula_banco.py
```

Esse script cria:

- usuário admin
- comunidades iniciais
- gêneros musicais

---

### 6. Rodar servidor

```
python manage.py runserver
```

Servidor disponível em:

```
http://127.0.0.1:8000
```

---

## API

A documentação automática da API pode ser acessada em:

```
http://127.0.0.1:8000/api/docs
```

Exemplos de endpoints:

```
/api/login
/api/register
/api/posts
/api/subs
/api/comments
/api/notifications
```

---

## Painel Administrativo

```
http://127.0.0.1:8000/admin
```

Usuário inicial:

```
admin
admin123
```

---

## Roadmap

Possíveis evoluções do projeto:

- integração com Spotify / YouTube / SoundCloud  
- playlists colaborativas  
- sistema de recomendação musical  
- ranking de tendências  
- moderação comunitária  
- busca avançada  

---

## Contribuindo

Contribuições são bem-vindas.

Você pode contribuir com:

- código
- melhorias de arquitetura
- sugestões de features
- correções de bugs
- documentação

Fluxo recomendado:

```
fork
branch
pull request
```

---

## Licença

Projeto open source.

Licença MIT.

---

## Motivação

A ideia deste projeto é explorar novas formas de descoberta musical baseadas em comunidade e colaboração aberta.

Se você gosta de música, tecnologia ou open source, fique à vontade para acompanhar ou contribuir.
