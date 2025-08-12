# Canvas de Mapeamento de Fontes de Dados - Projeto Prism

## Fonte de Dados 1: Políticas de Privacidade (Input do Usuário)

### Nome da Fonte de Dados
**Políticas de Privacidade Fornecidas pelo Usuário**

### Descrição da Fonte de Dados
Documentos de texto não estruturado (oriundos de arquivos ou URLs) que contêm os termos legais de privacidade de um serviço, aplicativo ou site. É o objeto principal da análise da IA.

### Origem dos Dados
**Externa.** Os dados são fornecidos diretamente pelo usuário final (individual ou empresarial) através da interface da aplicação Prism.

### Tipo de Dados
- Predominantemente textual (linguagem jurídica e comercial)
- Metadados (nome do arquivo, URL de origem)

### Formato dos Dados
Arquivos digitais (PDF, DOCX, TXT) ou conteúdo HTML extraído de URLs. Os dados são inerentemente não estruturados.

### Frequência de Atualização
**Sob demanda.** Os dados são recebidos e processados em tempo real, sempre que um usuário inicia uma nova análise.

### Qualidade dos Dados
Altamente variável. A qualidade pode variar de documentos bem estruturados a PDFs escaneados de baixa qualidade (com ruído de OCR), textos ambíguos ou com formatação complexa. A baixa qualidade é um desafio central a ser tratado.

### Métodos de Coleta
- Upload de arquivo via interface web (ex: drag-and-drop)
- Extração de texto (web scraping) a partir de uma URL fornecida pelo usuário

### Acesso aos Dados
Acesso via backend da aplicação, que recebe o arquivo ou a URL, realiza o parsing e envia o conteúdo textual para o modelo de IA.

### Proprietário dos Dados
A empresa que publicou a política de privacidade. O usuário do Prism tem a posse temporária para fins de análise.

### Restrições de Privacidade e Segurança
**Crítico.** Embora não sejam dados pessoais do usuário do Prism, são propriedade intelectual da empresa de origem. A solução não deve armazenar o conteúdo das políticas após a análise para garantir confidencialidade e segurança, tratando os dados de forma efêmera.

### Requisitos de Integração
- Necessidade de um robusto sistema de parsing para extrair texto limpo de múltiplos formatos (PDF, DOCX, HTML)
- Implementar pré-processamento de texto para normalização e limpeza antes de enviar para a IA

---

## Fonte de Dados 2: Conhecimento Jurídico (Base da IA)

### Nome da Fonte de Dados
**Base de Conhecimento Jurídico (LGPD, GDPR e Boas Práticas)**

### Descrição da Fonte de Dados
Corpus de documentos que contém os textos completos de leis de proteção de dados (como LGPD e GDPR), artigos, jurisprudência e guias de boas práticas. Funciona como a "fonte da verdade" contra a qual a IA compara as políticas.

### Origem dos Dados
Fontes públicas (sites governamentais, diários oficiais) e curadoria interna por especialistas em direito digital.

### Tipo de Dados
- Textual (artigos de lei, descrições)
- Categórico (classificação de artigos por princípio da lei, ex: Finalidade, Necessidade, Transparência)

### Formato dos Dados
Originalmente em formatos diversos (HTML, PDF). Para uso na solução, são transformados em um formato estruturado ou semiestruturado (ex: JSON, Markdown) e/ou indexados em um banco de dados vetorial.

### Frequência de Atualização
**Baixa.** Atualizada apenas quando há alterações na legislação ou publicação de novas diretrizes pelas autoridades de proteção de dados. Requer monitoramento periódico.

### Qualidade dos Dados
**Alta.** A fonte primária são documentos oficiais, garantindo alta precisão e confiabilidade.

### Métodos de Coleta
- Web scraping de portais legislativos
- Consumo de APIs de bases de dados jurídicas
- Inserção manual de conteúdo curado pela equipe

### Acesso aos Dados
Acesso via uma base de dados interna (preferencialmente um banco de dados vetorial) otimizada para buscas de similaridade semântica (RAG - Retrieval-Augmented Generation).

### Proprietário dos Dados
Domínio público (no caso das leis) ou a própria empresa Prism (no caso do conteúdo curado).

### Restrições de Privacidade e Segurança
Nenhuma restrição significativa, pois se trata majoritariamente de informação pública.

### Requisitos de Integração
- Os dados precisam ser processados, divididos em fragmentos (chunks) e convertidos em vetores (embeddings) para serem armazenados no banco de dados vetorial
- A solução de IA deve ser integrada a este banco para realizar consultas em tempo real durante a análise da política do usuário