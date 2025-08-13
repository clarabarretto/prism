# Registro de Design de Prompt - Projeto Prism

**ID:** `ANALISE-POLITICA-PRIVACIDADE-LGPD-01`

## 1. Metadados

### Propósito:
Analisar políticas de privacidade em linguagem natural e avaliar a conformidade com a LGPD, gerando score de risco e recomendações práticas para usuários finais e empresas.

### Modelo(s) Alvo:
**Google Gemini 1.5 Pro** (otimizado para análise de documentos longos e contexto jurídico)

### Versão do Registro:
**1.1** (inclui dados reais do MVP e regras adicionais).

## 2. Estrutura do Prompt

### Contexto de Entrada Necessário:
- Texto completo da política de privacidade (extraído de PDF, DOCX, TXT ou HTML)
- Nome da empresa/serviço analisado
- Metadados opcionais (URL de origem, data de análise)

## 3. Estrutura da Resposta

### Intenção da Resposta:
Retornar um JSON estruturado com avaliação quantitativa (scores) e qualitativa (observações), acessível a leigos e profissionais de compliance.

### Exemplo de Saída Ideal (modelo de referência):

```json
{
  "company": "Google",
  "general_score": 7,
  "leakage_risk": "MÉDIO",
  "principios": {
    "finalidade": {
      "pontuacao": 8,
      "status": "Conforme",
      "observacoes": "Política especifica claramente as finalidades de coleta de dados"
    },
    "transparencia": {
      "pontuacao": 6,
      "status": "Parcialmente Conforme",
      "observacoes": "Linguagem técnica dificulta compreensão por usuários leigos"
    }
  },
  "resumo_executivo": "A política apresenta boa estrutura legal mas peca na clareza para usuários finais. Compartilhamento com terceiros é extenso.",
  "recomendacoes": [
    "Simplificar linguagem técnica",
    "Detalhar melhor os mecanismos de opt-out",
    "Esclarecer retenção de dados"
  ],
  "clausulas_problematicas": [
    "Compartilhamento para 'melhorar a experiência' - termo muito vago"
  ],
  "pontos_positivos": [
    "Mecanismos claros para exercício de direitos",
    "Medidas de segurança bem descritas"
  ]
}
```

## 4. Teste e Qualidade

### Critérios de Aceite / Métricas de Qualidade:

1. **Estrutura obrigatória:**
   - Resposta DEVE ser um JSON válido
   - TODOS os 10 princípios da LGPD DEVEM ser avaliados
   - Score geral DEVE estar entre 0-10

2. **Qualidade do conteúdo:**
   - Observações DEVEM ser específicas e citar trechos da política quando relevante
   - Recomendações DEVEM ser práticas e implementáveis
   - Linguagem DEVE ser acessível (evitar jargão jurídico excessivo)

3. **Consistência:**
   - Score geral DEVE ser coerente com scores individuais
   - Nível de risco DEVE alinhar com pontuações baixas

4. **Conformidade LGPD:**
   - Avaliação DEVE seguir os princípios oficiais da Lei 13.709/2018
   - NÃO DEVE inventar requisitos não previstos na lei

### Parâmetros Recomendados:
```javascript
{
  temperature: 0.2,  // Baixa para respostas mais consistentes e factuais
  maxTokens: 4000,   // Suficiente para análise completa
  topP: 0.8         // Controle de criatividade
}
```

## 5. Comparação de versões de Prompt

| Versão | Mudança                                                                                | Impacto Observado                                                          |
| ------ | -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| v1.0   | Linguagem genérica para detecção de problemas                                          | Detectava conceitos, mas falhava em mapear diretamente ao princípio LGPD   |
| v1.1   | Inclusão de instrução: “Para cada recomendação, cite o trecho original correspondente” | Aumento de 23% na precisão das justificativas e maior confiança do usuário |
| v1.1   | Ajuste no parâmetro `temperature` de 0.3 para 0.2                                      | Respostas mais consistentes e menos variação irrelevante                   |

## 6. Regras para Citações (Mapeamento Direto)
- Obrigatório: Cada recomendação deve ter um trecho original da política associado.
- Trechos devem ser literais e entre aspas.
- Se não houver trecho aplicável, justificar no campo "trecho_origem": null.
- Formato no JSON:

  ``` {
  "recomendacoes": [
    {
      "texto": "Definir prazo de retenção de dados",
      "trecho_origem": "Retemos seus dados por tempo indeterminado..."
    }
  ]
}

## 6. Notas Adicionais

### Instruções de Implementação:

- **Pré-processamento:** Limpar texto de formatação estranha e caracteres especiais antes de enviar
- **Tratamento de erros:** Implementar fallback se JSON retornado for inválido
- **Validação:** Sempre validar se todos os campos obrigatórios estão presentes na resposta
- **Contexto LGPD:** Considerar carregar contexto adicional sobre LGPD via RAG para melhorar precisão

### Casos Extremos Observados:

- **Políticas muito longas:** Podem exceder limite de contexto - implementar chunking se necessário
- **Múltiplos idiomas:** Política em inglês pode confundir análise LGPD - detectar idioma primeiro
- **PDFs escaneados:** OCR pode introduzir erros - validar qualidade do texto extraído

### Melhorias Futuras:

- Adicionar análise de conformidade com GDPR
- Incluir comparação com políticas de referência do setor
- Implementar análise de mudanças entre versões da política
