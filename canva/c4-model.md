# Modelo C4 - Projeto Prism

## Nível 1: Contexto

### Diagrama de Contexto para Sistema Prism

**Descrição:** Mostra os atores externos e sua interação com o sistema de análise de políticas de privacidade.

#### Elementos:

**🎯 Sistema Central:** Prism (Analisador de Políticas de Privacidade)

**👥 Atores Externos:**
- **Carlos (Usuário Individual):** Consumidor que quer avaliar riscos de privacidade
- **Sofia (Gestora de Compliance):** Profissional que precisa garantir conformidade LGPD
- **Gemini AI:** Serviço de IA generativa para análise de texto
- **Sites/Empresas:** Fontes das políticas de privacidade

#### Interações:
- **Carlos → Prism:** "Analisar política do app X"
- **Sofia → Prism:** "Verificar conformidade LGPD da nossa política"
- **Prism → Gemini AI:** "Analisar texto da política com prompt LGPD"
- **Prism → Sites/Empresas:** "Extrair política via URL"

---

## Nível 2: Contêiner

### Diagrama de Contêiner para Sistema Prism

**Descrição:** Detalha os componentes principais da arquitetura do sistema.

#### Elementos:

**🖥️ Frontend Web App**
- **Tecnologia:** React + TypeScript + ShadCN/UI + Tailwind
- **Função:** Interface para upload/URL, exibição de resultados e scores

**⚙️ Backend API**
- **Tecnologia:** Node.js + Express + JavaScript
- **Função:** Processamento de arquivos, integração IA, orquestração

**🧠 Serviço de IA**
- **Tecnologia:** Google Gemini 1.5 Pro API
- **Função:** Análise de conformidade LGPD e geração de scores

**📁 Processamento de Arquivos**
- **Tecnologia:** PDF-parse + Cheerio + Multer
- **Função:** Extração de texto de PDFs, URLs e documentos

**🔄 Comunicação**
- **Tecnologia:** HTTP/HTTPS + JSON
- **Função:** Comunicação entre frontend, backend e APIs externas

---

## Nível 3: Componente

### Diagrama de Componentes para Backend API

**Descrição:** Detalha os componentes internos do backend e suas responsabilidades.

#### Elementos:

**📤 Upload Controller**
- **Função:** Gerenciar upload de arquivos (PDF, DOCX, TXT)
- **Tecnologia:** Multer + Express

**🌐 URL Extractor**
- **Função:** Extrair texto de políticas via web scraping
- **Tecnologia:** Cheerio + Axios

**📄 Document Parser**
- **Função:** Processar e limpar texto de diferentes formatos
- **Tecnologia:** PDF-parse + Custom text cleaning

**🎯 Prompt Engineer**
- **Função:** Construir prompts estruturados para análise LGPD
- **Tecnologia:** Template strings + Validation

**🤖 AI Analyzer**
- **Função:** Enviar prompts para Gemini e processar respostas
- **Tecnologia:** @google/generative-ai

**📊 Result Formatter**
- **Função:** Estruturar e validar JSON de resposta
- **Tecnologia:** JSON validation + Error handling

**🔧 API Routes**
- **Função:** Endpoints REST para análise de políticas
- **Tecnologia:** Express Router

#### Fluxo de Dados:
1. **Upload Controller** → **Document Parser** → **Prompt Engineer**
2. **URL Extractor** → **Document Parser** → **Prompt Engineer**
3. **Prompt Engineer** → **AI Analyzer** → **Result Formatter**
4. **Result Formatter** → **API Routes** → **Frontend**

---

## Tecnologias Identificadas

### Frontend:
- React 18 + TypeScript
- ShadCN/UI + Radix UI
- Tailwind CSS
- React Query (TanStack)

### Backend:
- Node.js 20+ + Express
- Google Gemini 1.5 Pro
- PDF-parse, Cheerio, Multer
- CORS, dotenv, JWT

### Deployment:
- Render (configurado via render.yaml)
- PNPM (package manager)
- ESLint + Prettier