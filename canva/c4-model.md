# Modelo C4 - Projeto Prism

---

## Nível 1: Contexto

**Descrição:** Mostra os atores externos e sua interação com o sistema Prism.

### Atores Externos:
- **Carlos (Usuário Individual):** Avalia riscos de privacidade.
- **Sofia (Gestora de Compliance):** Garante conformidade LGPD.
- **Gemini AI:** IA generativa para análise de texto.
- **Sites/Empresas:** Fontes das políticas de privacidade.

### Interações:
- **Carlos → Prism:** Solicita análise.
- **Sofia → Prism:** Solicita verificação LGPD.
- **Prism → Gemini AI:** Envia prompt e texto.
- **Prism → Sites/Empresas:** Extrai política.

**Pontos de risco identificados:**
- Latência alta na comunicação com Gemini AI.
- Erros de OCR em PDFs grandes.
- Quebra de compatibilidade se a estrutura da política mudar.

**ADR relacionado:**  
- **ADR-001** – Uso de serviço de IA externo para análise LGPD (trade-off: rapidez x dependência externa).

---

## Nível 2: Contêiner

![Diagrama de Contêiner - Prism](link_para_imagem_container.png)

**Frontend Web App**
- React + TypeScript + ShadCN/UI + Tailwind.
- Exibe resultados, permite upload e URL.

**Backend API**
- Node.js + Express.
- Processa arquivos, integra IA, orquestra fluxo.

**Serviço de IA**
- Google Gemini 1.5 Pro API.
- Analisa conformidade LGPD e gera scores.

**Processamento de Arquivos**
- PDF-parse + Cheerio + Multer.
- Extrai e limpa texto.

**Pontos de risco:**
- Sobrecarga do backend em picos de upload.
- Limite de tokens da API Gemini.
- Falha em parsing de documentos não convencionais.

**ADRs relevantes:**
- **ADR-002** – Separação de frontend/backend.
- **ADR-003** – Uso de parsing próprio para maior controle.

---

## Nível 3: Componente

![Diagrama de Componentes - Backend API](link_para_imagem_component.png)

**Upload Controller** – Gerencia upload (PDF, DOCX, TXT).  
**URL Extractor** – Extrai texto via scraping.  
**Document Parser** – Limpa e processa texto.  
**Prompt Engineer** – Constrói prompts estruturados.  
**AI Analyzer** – Envia para Gemini e processa resposta.  
**Result Formatter** – Valida e formata JSON.  
**API Routes** – Exposição via REST.

**Fluxo de Dados:**
1. Upload Controller → Document Parser → Prompt Engineer.
2. URL Extractor → Document Parser → Prompt Engineer.
3. Prompt Engineer → AI Analyzer → Result Formatter.
4. Result Formatter → API Routes → Frontend.

**Pontos de risco:**
- Parsing incorreto em arquivos corrompidos.
- Resposta inválida da IA (JSON malformado).
- Lentidão em scraping devido a bloqueios.

**ADRs relevantes:**
- **ADR-004** – Implementação de fallback em parsing.
- **ADR-005** – Validação estrita de JSON antes de enviar ao frontend.

---

## Tecnologias Identificadas

**Frontend:**
- React 18 + TypeScript, ShadCN/UI, Tailwind, React Query.

**Backend:**
- Node.js 20+, Express, Google Gemini 1.5 Pro, PDF-parse, Cheerio, Multer, JWT.

**Deployment:**
- Render, PNPM, ESLint, Prettier.

---

## Observações Finais
- Todos os diagramas devem ser gerados em formato **PNG e SVG** usando ferramentas como **Structurizr** ou **PlantUML** para consistência.
- ADRs devem ser atualizados a cada mudança arquitetural relevante.
