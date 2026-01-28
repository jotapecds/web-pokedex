
---

# 🔴⚪ Web Pokedex - Fullstack CRUD

Uma aplicação web completa para gerenciamento de Pokémons e Tipos Elementais. O projeto permite criar, listar, editar e remover Pokémons (com suporte a tipos duplos) e gerenciar os Tipos.

A aplicação vem pré-configurada com um script de "Seed" para popular o banco de dados com os 151 Pokémons originais (Geração 1).

## 🚀 Tecnologias Utilizadas

### Frontend (`/client`)

* **Vue.js 3** (Composition API + `<script setup>`)
* **Vite** (Build tool rápida)
* **Vuetify 3** (Componentes de UI e Design Material)
* **Axios** (Requisições HTTP)

### Backend (`/server`)

* **Node.js** & **Express**
* **Prisma ORM** (Modelagem e acesso ao banco)
* **SQLite** (Banco de dados local via arquivo)

---

## ⚙️ Pré-requisitos

Certifique-se de ter instalado em sua máquina:

* [Node.js](https://nodejs.org/) (versão 18 ou superior recomendada)
* Git

---

## 🛠️ Instalação e Execução

O projeto é dividido em duas pastas: `web-pokedex-server` (API) e `web-pokedex-client` (Frontend). Você precisará de dois terminais abertos para rodar ambos simultaneamente.

### 1. Configurando o Backend (Servidor)

No primeiro terminal:

```bash
# 1. Entre na pasta do servidor
cd server

# 2. Instale as dependências
npm install

# 3. Crie o banco de dados SQLite e as tabelas
npx prisma migrate dev --name init

# 4. Popule o banco com os dados iniciais (151 Pokémons)
npx prisma db seed

# 5. Inicie o servidor
npm run dev

```

*O servidor rodará em: `http://localhost:8080`*

### 2. Configurando o Frontend (Cliente)

No segundo terminal (na raiz do projeto):

```bash
# 1. Entre na pasta do cliente
cd client

# 2. Instale as dependências
npm install

# 3. Inicie o projeto Vue
npm run dev

```

*Geralmente rodará em: `http://localhost:3000` (verifique o link no terminal)*

---

## 📂 Estrutura do Banco de Dados

O projeto utiliza **SQLite**. O arquivo do banco (`dev.db`) será criado automaticamente dentro da pasta `server/prisma/` após rodar a migration.

### Modelagem

* **Tipo:** Possui `codigo` e `nome`.
* **Pokemon:** Possui `codigo`, `nome`, e duas relações com Tipo:
* `tipoPrimario` (Obrigatório)
* `tipoSecundario` (Opcional)



---

## ✨ Funcionalidades

### Gerenciador de Pokémons

* **Listagem:** Cards responsivos com nome do pokemon e chips indicando os tipos (sendo o maior o tipo primário e o menor o tipo secundário).
* **Filtros:** Busca por nome e filtro por tipo (dinâmico).
* **Cadastro/Edição:**
* Seleção inteligente de tipos (dropdowns baseados no banco).
* Opção de limpar o tipo secundário.
* Validação de campos obrigatórios.


* **Exclusão:** Botão para remover registros.

### Gerenciador de Tipos

* **CRUD Completo:** Crie novos elementos (ex: "Sombrio", "Metal").
* **Segurança:** O banco impede a exclusão de um Tipo se ele estiver sendo usado por algum Pokémon.

### Automação (Seed)

O comando `npx prisma db seed` lê o arquivo `dados_iniciais.json`, e cadastra automaticamente no banco de dados todos os Pokémons e seus respectivos Tipos.

---

## 📝 Comandos Úteis do Prisma

Se você precisar resetar o banco de dados ou ver os dados via interface gráfica:

```bash
# Abrir interface visual para ver/editar dados do banco
cd server
npx prisma studio

# Resetar o banco completamente (apaga tudo e roda o seed de novo)
npx prisma migrate reset

```

---

## ☁️ Deploy e Arquitetura na Nuvem

Este projeto foi implantado utilizando serviços gratuitos para fins didáticos. A arquitetura está dividida da seguinte forma:

### 1. Backend (API) - [Render.com](https://render.com)

O servidor Node.js/Express está hospedado na plataforma Render.

* **Banco de Dados:** Utiliza **SQLite**. Para facilitar os testes públicos, o servidor está configurado para **resetar e popular o banco de dados** (Seed) automaticamente toda vez que é reiniciado.
* **⚠️ Aviso de "Cold Start":** Como utilizamos o plano gratuito, o servidor entra em modo de suspensão após 15 minutos de inatividade. O primeiro acesso pode levar cerca de **50 a 60 segundos** para carregar. Após "acordar", a performance volta ao normal.

### 2. Frontend (Interface) - GitHub Pages

A aplicação Vue.js é compilada e hospedada estaticamente no GitHub Pages.

* **Comunicação:** O Frontend consome a API hospedada no Render através de variáveis de ambiente configuradas no build.

---

### 📦 Como atualizar o projeto em produção

**Para atualizar o Backend:**
O deploy é contínuo (CD). Basta enviar as alterações para o GitHub:

```bash
git add .
git commit -m "feat: nova funcionalidade no back"
git push origin main
# O Render detectará o commit e fará o deploy automaticamente.

```

**Para atualizar o Frontend:**
É necessário gerar o build e enviar para a branch `gh-pages`:

```bash
cd client
npm run deploy
# Este script roda o build e envia a pasta 'dist' para o GitHub Pages.

```

---


# 🔴⚪ Web Pokedex
> **Acesse o projeto online:** [https://jotapecds.github.io/web-pokedex/](https://jotapecds.github.io/web-pokedex/)

> **Assista ao vídeo de apresentação:** [https://youtu.be/GEmNFa9J4qo](https://youtu.be/GEmNFa9J4qo)



