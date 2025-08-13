# 🔐 PRISM — Privacy Risk Insight & Scoring Mechanism

Aplicação completa para analisar políticas de privacidade e termos de uso. O frontend é em React + Vite + TypeScript e o backend é em Node.js + Express com integração à API Gemini.

---

## 📘 Visão Geral

- **Frontend (client/)**: React, Vite, TypeScript, shadcn-ui, Tailwind.
- **Backend (server/)**: Node.js, Express, integração com `@google/generative-ai`.
- **Funcionalidades principais**:
  - Análise por URL, texto direto ou upload de PDF.
  - Geração de pontuação e resumo executivo de conformidade.
  - Listagem e leitura de análises salvas.

---

## 📂 Estrutura do Projeto

```
prism_fork/
├── client/                 # Frontend React + Vite + TS
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
├── server/                 # Backend Node + Express
│   ├── src/
│   │   ├── app.js
│   │   ├── routes/
│   │   │   └── analysisRoutes.js
│   │   ├── controllers/
│   │   ├── services/
│   │   └── config/environment.js
│   ├── index.js
│   └── package.json
└── README.md
```

---

## ✅ Pré-requisitos

- Node.js 18+ (recomendado)
- npm, yarn ou pnpm

---

## 🔧 Configuração de Ambiente

Crie os arquivos de ambiente conforme abaixo.

### Backend (`server/.env`)

```
GEMINI_API_KEY=coloque_sua_chave_aqui
PORT=3000
NODE_ENV=development
JWT_SECRET=troque_no_producao
JWT_EXPIRES_IN=24h
MAX_TEXT_LENGTH=8000
REQUEST_TIMEOUT=30000
MAX_REDIRECTS=5
RATE_LIMIT_DELAY=2000
CORS_ORIGIN=http://127.0.0.1:8080
```

- `GEMINI_API_KEY` é obrigatório.

### Frontend (`client/.env`)

```
VITE_API_URL=http://127.0.0.1:3000
```

---

## 🚀 Como Rodar Localmente

Em dois terminais separados (ou use um gerenciador de processos):

1) Backend

```bash
cd server
npm i
npm run dev
# Servidor em http://127.0.0.1:3000
```

2) Frontend

```bash
cd client
npm i
npm run dev
# App em http://127.0.0.1:8080
```

---

## 🧪 Teste Rápido dos Endpoints (Backend)

Base URL: `http://127.0.0.1:3000`

- Health

```bash
curl http://127.0.0.1:3000/api/health
```

- Analisar por texto

```bash
curl -X POST http://127.0.0.1:3000/api/analyze/text \
  -H "Content-Type: application/json" \
  -d '{"text":"Seu texto de política aqui...","company_name":"Empresa X"}'
```

- Analisar por URL

```bash
curl -X POST http://127.0.0.1:3000/api/analyze/url \
  -H "Content-Type: application/json" \
  -d '{"url":"https://exemplo.com/privacidade","company_name":"Empresa X"}'
```

- Analisar PDF

```bash
curl -X POST http://127.0.0.1:3000/api/analyze/pdf \
  -F pdf=@/caminho/para/arquivo.pdf \
  -F company_name="Empresa X"
```

- Listar análises salvas

```bash
curl http://127.0.0.1:3000/api/analyze/results
```

- Obter análise específica

```bash
curl http://127.0.0.1:3000/api/analyze/results/NOME_DO_ARQUIVO.json
```

---

## 🔗 Endpoints Principais

Prefixo: `/api/analyze`

- `POST /url` — body: `{ url, company_name? }`
- `POST /text` — body: `{ text, company_name? }`
- `POST /pdf` — form-data: `pdf` (arquivo), `company_name?`
- `POST /extract-text` — body: `{ url }`
- `GET /results` — lista arquivos de análise
- `GET /results/:filename` — carrega análise salva
- Health geral: `GET /api/health`

---

## 🧱 Notas de Desenvolvimento

- O CORS permite origem definida em `CORS_ORIGIN` (ou `*` por padrão).
- Logs detalhados são exibidos em `development`.
- O frontend lê a variável `VITE_API_URL` para chamar o backend.

---

## 📋 Canvas Estratégicos

Para acessar a documentação estratégica completa do projeto Prism, consulte os seguintes documentos:

### 🧑‍🤝‍🧑 **Personas e Usuários**
- **[Persona Model Canvas](./canva/persona.md)** - Definição das personas principais (Carlos - usuário individual e Sofia - gestora de compliance)

### 🎯 **Definição do Problema e Domínio**
- **[Identificação de Domínio](./canva/identificacao-de-dominio.md)** - Análise do domínio de políticas de privacidade e oportunidades de IA
- **[Ideação de Soluções](./canva/ideacao-de-solucoes.md)** - Brainstorming de soluções e priorização via matriz impacto vs esforço

### 📊 **Dados e Tecnologia**
- **[Mapeamento de Fontes de Dados](./canva/mapeamento-de-fontes.md)** - Definição das fontes de dados (políticas dos usuários + base jurídica LGPD)
- **[Registro de Design de Prompt](./canva/registro-design-de-prompt.md)** - Template estruturado para análise LGPD com Gemini AI
- **[Estratégia de IA](./canva/registro-de-estrategia.md)** - Abordagem técnica (prompt engineering) e roadmap de evolução

### 🏗️ **Arquitetura e Implementação**
- **[Modelo C4](./canva/c4-model.md)** - Arquitetura do sistema em 3 níveis (contexto, contêiner, componente)

### 📈 **Métricas e Feedback**
- **[Escala e Impacto](./canva/escala-de-impacto.md)** - Sistema de métricas para monitoramento de performance e crescimento
- **[Feedback e Insights](./canva/feedback-insights.md)** - Framework para coleta de feedback e geração de insights acionáveis

**📚 Para documentação completa:** Veja o [README da pasta Canvas](./canva/README.md)

---

## 📄 Licença

Este projeto é de uso educacional e pode ser adaptado livremente. Ajuste a licença conforme necessário.

## Deploy

https://prism-client.vercel.app/

## Slides

https://www.canva.com/design/DAGvu8Lx7IQ/_CHQgcrGkNfRy77BnLOL0Q/edit?ui=eyJIIjp7IkEiOnRydWV9fQ

Relatório


