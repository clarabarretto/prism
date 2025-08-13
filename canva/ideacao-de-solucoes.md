# Canvas de Ideação de Soluções - Projeto Prism

## 1. Problema a Ser Resolvido
**Usuários individuais se sentem inseguros e empresas enfrentam riscos jurídicos e de reputação por não conseguirem compreender adequadamente as políticas de privacidade. A complexidade e ambiguidade desses documentos impedem decisões informadas e a conformidade com a LGPD/GDPR.**

## 2. Ideias de Solução (Brainstorming)

### Ideia A: Analisador IA com Score de Risco e Relatório Simplificado
Ferramenta que analisa políticas de privacidade (via upload ou URL), gera um score visual de risco (0-100) e um relatório explicativo com os pontos críticos e boas práticas em linguagem acessível. *(Foco: Usuário Individual)*

### Ideia B: Comparador de Versões de Políticas
Sistema que permite ao usuário comparar duas versões de uma mesma política (ou políticas de concorrentes) e destaca visualmente as cláusulas que foram alteradas, adicionadas ou removidas, apontando o impacto das mudanças.

### Ideia C: Dashboard de Compliance para Empresas
Plataforma B2B que, além da análise, gera um dashboard executivo com o status de conformidade, alertas de risco, ações prioritárias por legislação e um resumo dos documentos analisados. *(Foco: Empresa)*

### Ideia D: Assistente de Redação e Adequação LGPD
Ferramenta de IA que não apenas identifica problemas, mas também sugere textos alternativos e mais seguros para as cláusulas, ajudando empresas a corrigirem ativamente suas políticas para alcançar a conformidade.

### Ideia E: Monitoramento e Alertas de Mudanças
Serviço que monitora continuamente as URLs de políticas de privacidade salvas pelo usuário e envia uma notificação sempre que uma alteração for detectada, acionando uma nova análise.

## 3. Critérios de Priorização
- Impacto: medido pelo potencial de aumento de retenção e engajamento dos usuários e/ou empresas (escala 1–5).
- Esforço: estimado em homens-hora de desenvolvimento, incluindo design, backend, frontend e QA (escala 1–5).
- Viabilidade Técnica: nível de complexidade tecnológica considerando integração de APIs, NLP e infraestrutura (Baixa / Média / Alta).
- Alinhamento Estratégico: grau de aderência ao objetivo principal do Prism (Alta / Média / Baixa).

## 4. Matriz de Priorização (Impacto vs. Esforço - com estimativa de tempo/custo)

| Solução                                  | Impacto (1–5) | Esforço (1–5) | Tempo Estimado | Faixa de Custo\*                        | Viabilidade Técnica | Observações                                       |
| ---------------------------------------- | ------------- | ------------- | -------------- | --------------------------------------- | ------------------- | ------------------------------------------------- |
| **Score de risco (MVP)**                 | 5             | 2             | 4 semanas      | **Baixo** (até \~R\$ 40 mil)            | Alta                | Base de toda a plataforma                         |
| **Comparador entre versões**             | 4             | 3             | 6 semanas      | **Médio** (\~R\$ 40–70 mil)             | Média               | Depende de módulo de parsing robusto              |
| **Dashboard executivo**                  | 4             | 3             | 6 semanas      | **Médio** (\~R\$ 40–70 mil)             | Alta                | Requer integração com backend do MVP              |
| **Detector de cláusulas vagas/abusivas** | 5             | 4             | 8 semanas      | **Alto** (\~R\$ 70–100 mil)             | Média               | Depende de treinamento de modelos NLP específicos |
| **Sugestões automáticas de melhoria**    | 4             | 4             | 8 semanas      | **Alto** (\~R\$ 70–100 mil)             | Alta                | Pode ser integrado ao detector                    |
| **API de integração**                    | 3             | 3             | 6 semanas      | **Médio** (\~R\$ 40–70 mil)             | Alta                | Útil para B2B e parcerias                         |
| **Monitoramento contínuo**               | 4             | 5             | 10 semanas     | **Muito Alto** (acima de \~R\$ 100 mil) | Média               | Exige crawling e alertas automatizados            |

*Custo estimado considerando equipe interna + eventuais APIs de terceiros.
*Legenda de custos (compatível com mercado brasileiro de IA/SaaS em 2025):
- Baixo → até ~R$ 40 mil
- Médio → ~R$ 40–70 mil
- Alto → ~R$ 70–100 mil
- Muito Alto → acima de ~R$ 100 mil

## 5. Dependências Técnicas
- RAG (Retrieval-Augmented Generation) precisa estar implementado antes do comparador de políticas e do detector de cláusulas vagas.
- Parsing e OCR precisam ser 100% estáveis antes do monitoramento contínuo e do comparador.
- Backend do MVP deve ter endpoints escaláveis antes da API pública.
- Base de treinamento de cláusulas precisa estar validada antes de gerar sugestões automáticas.

## 6. Solução Priorizada para Prototipagem

**🎯 Ideia A: Analisador IA com Score de Risco e Relatório Simplificado**

### Justificativa:

- **Resolve a Dor Central:** Atende diretamente à necessidade do usuário que deseja "Análise rápida", "Explicação simples" e "Score visual"
- **MVP Perfeito:** É a funcionalidade mais essencial do Prism. Permite validar a tecnologia (Gemini AI), a proposta de valor e a experiência do usuário com esforço contido
- **Base para o Futuro:** O sucesso desta funcionalidade é a porta de entrada para desenvolver as soluções B2B (Ideias C e D), que são o futuro do modelo de negócio
- **Viabilidade Técnica:** A tecnologia já foi escolhida (Gemini 1.5 Pro) e a engenharia de prompt é a técnica central, tornando o desenvolvimento inicial mais direto

### Próximos Passos para o Protótipo:

#### 1. Interface de Entrada
Desenvolver a UI para upload de arquivos (PDF, DOCX, TXT) e inserção de URL

#### 2. Módulo de Extração
Criar o backend para extrair o texto limpo dos diferentes formatos

#### 3. Integração com a IA
Conectar com a API do Gemini, enviando o texto extraído junto com o prompt de análise focado em LGPD

#### 4. Módulo de Saída
Receber a resposta da IA e estruturá-la em:
- **Score de Risco** (0-100)
- **Relatório Simplificado** com "Principais Problemas Identificados" e "Recomendações Imediatas"

#### 5. UI de Resultados
Apresentar o score e o relatório de forma clara e visual para o usuário, seguindo os princípios de UX definidos

### Tecnologias Identificadas:
- **Frontend:** React + TypeScript + ShadCN/UI + Tailwind
- **Backend:** Node.js + Express + Gemini AI
- **Processamento:** PDF-parse, Cheerio (web scraping), Multer (upload)
