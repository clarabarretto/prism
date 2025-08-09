const { LGPD_CONTEXT, PRINCIPLES } = require('../constants/lgpd');

function createAnalysisPrompt(policyText, companyName) {
	return `
Você é um especialista em análise de políticas de privacidade e conformidade com a Lei Geral de Proteção de Dados (LGPD) do Brasil. Sua análise deve ser extremamente rigorosa, detalhada e não deixar brechas ou generalidades, refletindo uma compreensão profunda das nuances da legislação brasileira.

CONTEXTO DA LGPD:
${LGPD_CONTEXT}

TAREFA:
Analise a política de privacidade da empresa "${companyName}" abaixo e avalie sua conformidade com os princípios e requisitos da LGPD (Lei 13.709/2018). Sua análise deve ser robusta, detalhada e especializada na legislação brasileira.

POLÍTICA DE PRIVACIDADE A ANALISAR:
${policyText}

INSTRUÇÕES PARA ANÁLISE ESPECIALIZADA EM LGPD:
1. Avalie cada um dos 10 princípios da LGPD de forma EXTREMAMENTE criteriosa e detalhada, identificando como a política se alinha ou falha em relação a cada princípio específico da lei brasileira.
2. Para cada princípio, atribua uma pontuação de 0 a 10 baseada na conformidade real com os artigos específicos da LGPD.
3. Identifique brechas específicas, violações e áreas de melhoria citando os artigos da LGPD (Art. 6º, 7º, 8º, etc.).
4. Calcule uma pontuação geral de conformidade LGPD (média das pontuações individuais).
5. Avalie o risco de vazamento de dados e não conformidade considerando as sanções da ANPD.
6. Forneça recomendações específicas e acionáveis para adequação à LGPD.

CRITÉRIOS DE PONTUAÇÃO LGPD:
- 9-10: Conformidade exemplar com a LGPD, vai além dos requisitos mínimos.
- 7-8: Boa conformidade com a LGPD, pequenas melhorias possíveis.
- 5-6: Conformidade parcial com a LGPD; requer melhorias significativas.
- 3-4: Baixa conformidade com a LGPD; problemas significativos.
- 0-2: Não conformidade crítica com a LGPD; riscos graves de sanções.

FORMATO DE RESPOSTA (JSON VÁLIDO):
{
  "empresa": "${companyName}",
  "pontuacao_geral": 0.0,
  "principios": {
    "${PRINCIPLES.LGPD.FINALIDADE}": {
      "pontuacao": 0.0,
      "status": "Conforme/Não Conforme/Parcialmente Conforme",
      "observacoes": "Análise detalhada da conformidade com o Art. 6º, I da LGPD sobre finalidade específica e legítima.",
      "brechas_identificadas": ["lista específica de brechas relacionadas ao princípio da finalidade"],
      "artigos_lgpd_relevantes": ["Art. 6º, I", "Art. 7º"]
    },
    "${PRINCIPLES.LGPD.ADEQUACAO}": {
      "pontuacao": 0.0,
      "status": "Conforme/Não Conforme/Parcialmente Conforme",
      "observacoes": "Análise detalhada da conformidade com o Art. 6º, II da LGPD sobre adequação dos dados às finalidades.",
      "brechas_identificadas": ["lista específica de brechas relacionadas ao princípio da adequação"],
      "artigos_lgpd_relevantes": ["Art. 6º, II"]
    },
    "${PRINCIPLES.LGPD.NECESSIDADE}": {
      "pontuacao": 0.0,
      "status": "Conforme/Não Conforme/Parcialmente Conforme",
      "observacoes": "Análise detalhada da conformidade com o Art. 6º, III da LGPD sobre necessidade e proporcionalidade.",
      "brechas_identificadas": ["lista específica de brechas relacionadas ao princípio da necessidade"],
      "artigos_lgpd_relevantes": ["Art. 6º, III"]
    },
    "${PRINCIPLES.LGPD.LIVRE_ACESSO}": {
      "pontuacao": 0.0,
      "status": "Conforme/Não Conforme/Parcialmente Conforme",
      "observacoes": "Análise detalhada da conformidade com o Art. 6º, IV da LGPD sobre livre acesso pelos titulares.",
      "brechas_identificadas": ["lista específica de brechas relacionadas ao princípio do livre acesso"],
      "artigos_lgpd_relevantes": ["Art. 6º, IV", "Art. 18"]
    },
    "${PRINCIPLES.LGPD.QUALIDADE_DADOS}": {
      "pontuacao": 0.0,
      "status": "Conforme/Não Conforme/Parcialmente Conforme",
      "observacoes": "Análise detalhada da conformidade com o Art. 6º, V da LGPD sobre qualidade dos dados.",
      "brechas_identificadas": ["lista específica de brechas relacionadas ao princípio da qualidade dos dados"],
      "artigos_lgpd_relevantes": ["Art. 6º, V"]
    },
    "${PRINCIPLES.LGPD.TRANSPARENCIA}": {
      "pontuacao": 0.0,
      "status": "Conforme/Não Conforme/Parcialmente Conforme",
      "observacoes": "Análise detalhada da conformidade com o Art. 6º, VI da LGPD sobre transparência das informações.",
      "brechas_identificadas": ["lista específica de brechas relacionadas ao princípio da transparência"],
      "artigos_lgpd_relevantes": ["Art. 6º, VI", "Art. 9º"]
    },
    "${PRINCIPLES.LGPD.SEGURANCA}": {
      "pontuacao": 0.0,
      "status": "Conforme/Não Conforme/Parcialmente Conforme",
      "observacoes": "Análise detalhada da conformidade com o Art. 6º, VII da LGPD sobre segurança dos dados.",
      "brechas_identificadas": ["lista específica de brechas relacionadas ao princípio da segurança"],
      "artigos_lgpd_relevantes": ["Art. 6º, VII", "Art. 46", "Art. 48"]
    },
    "${PRINCIPLES.LGPD.PREVENCAO}": {
      "pontuacao": 0.0,
      "status": "Conforme/Não Conforme/Parcialmente Conforme",
      "observacoes": "Análise detalhada da conformidade com o Art. 6º, VIII da LGPD sobre prevenção de danos.",
      "brechas_identificadas": ["lista específica de brechas relacionadas ao princípio da prevenção"],
      "artigos_lgpd_relevantes": ["Art. 6º, VIII", "Art. 48"]
    },
    "${PRINCIPLES.LGPD.NAO_DISCRIMINACAO}": {
      "pontuacao": 0.0,
      "status": "Conforme/Não Conforme/Parcialmente Conforme",
      "observacoes": "Análise detalhada da conformidade com o Art. 6º, IX da LGPD sobre não discriminação.",
      "brechas_identificadas": ["lista específica de brechas relacionadas ao princípio da não discriminação"],
      "artigos_lgpd_relevantes": ["Art. 6º, IX"]
    },
    "${PRINCIPLES.LGPD.RESPONSABILIZACAO}": {
      "pontuacao": 0.0,
      "status": "Conforme/Não Conforme/Parcialmente Conforme",
      "observacoes": "Análise detalhada da conformidade com o Art. 6º, X da LGPD sobre responsabilização e prestação de contas.",
      "brechas_identificadas": ["lista específica de brechas relacionadas ao princípio da responsabilização"],
      "artigos_lgpd_relevantes": ["Art. 6º, X", "Art. 37", "Art. 38"]
    }
  },
  "bases_legais_analisadas": {
    "consentimento": "Análise do uso do consentimento conforme Art. 7º, I da LGPD",
    "cumprimento_obrigacao_legal": "Análise do cumprimento de obrigação legal conforme Art. 7º, II da LGPD",
    "execucao_contrato": "Análise da execução de contrato conforme Art. 7º, V da LGPD",
    "legitimo_interesse": "Análise do legítimo interesse conforme Art. 7º, IX da LGPD"
  },
  "direitos_titulares_lgpd": {
    "confirmacao_existencia": "Verificação se a política garante o Art. 18, I da LGPD",
    "acesso_dados": "Verificação se a política garante o Art. 18, II da LGPD",
    "correcao_dados": "Verificação se a política garante o Art. 18, III da LGPD",
    "anonimizacao_eliminacao": "Verificação se a política garante o Art. 18, IV da LGPD",
    "portabilidade": "Verificação se a política garante o Art. 18, V da LGPD",
    "revogacao_consentimento": "Verificação se a política garante o Art. 18, IX da LGPD"
  },
  "resumo_executivo": "Resumo abrangente da análise de conformidade com a LGPD, destacando os principais achados e riscos específicos da legislação brasileira.",
  "recomendacoes": ["lista detalhada de recomendações específicas para adequação à LGPD"],
  "risco_vazamento_e_nao_conformidade": "Alto/Médio/Baixo",
  "potenciais_sancoes_anpd": "Análise das possíveis sanções da ANPD baseada nas não conformidades identificadas (Art. 52 da LGPD)",
  "metadata": {
    "data_analise": "${new Date().toISOString()}",
    "versao_lei": "LGPD Lei 13.709/2018",
    "caracteres_analisados": ${policyText.length},
    "especialidade": "Análise especializada em LGPD"
  }
}

IMPORTANTE: Responda APENAS com o JSON válido, sem markdown, sem texto adicional antes ou depois. Foque exclusivamente na legislação brasileira (LGPD).
`;
}

function createAnalysisPromptWithUrlContext(url, companyName) {
	return `
Você é um especialista em análise de políticas de privacidade e conformidade com a Lei Geral de Proteção de Dados (LGPD) do Brasil. Sua análise deve ser extremamente rigorosa, detalhada e especializada na legislação brasileira.

CONTEXTO DA LGPD:
${LGPD_CONTEXT}

TAREFA:
Analise a política de privacidade da empresa "${companyName}" acessando diretamente a URL fornecida e avalie sua conformidade com os princípios e requisitos da LGPD (Lei 13.709/2018).

URL DA POLÍTICA DE PRIVACIDADE:
${url}

INSTRUÇÕES PARA ANÁLISE ESPECIALIZADA EM LGPD:
1. Acesse a URL fornecida e extraia o conteúdo da política de privacidade.
2. Avalie cada um dos 10 princípios da LGPD de forma criteriosa e detalhada.
3. Para cada princípio, atribua uma pontuação de 0 a 10 baseada na conformidade com a LGPD.
4. Identifique brechas específicas citando artigos da LGPD.
5. Calcule uma pontuação geral de conformidade LGPD.
6. Avalie riscos considerando as sanções da ANPD.

CRITÉRIOS DE PONTUAÇÃO LGPD:
- 9-10: Conformidade exemplar com a LGPD.
- 7-8: Boa conformidade com a LGPD.
- 5-6: Conformidade parcial com a LGPD.
- 3-4: Baixa conformidade com a LGPD.
- 0-2: Não conformidade crítica com a LGPD.

FORMATO DE RESPOSTA (JSON VÁLIDO):
{
  "empresa": "${companyName}",
  "pontuacao_geral": 0.0,
  "principios": {
    "${PRINCIPLES.LGPD.FINALIDADE}": { "pontuacao": 0.0, "status": "Conforme/Não Conforme/Parcialmente Conforme", "observacoes": "Análise detalhada LGPD.", "brechas_identificadas": ["lista de brechas LGPD"], "artigos_lgpd_relevantes": ["Art. 6º, I"] },
    "${PRINCIPLES.LGPD.ADEQUACAO}": { "pontuacao": 0.0, "status": "Conforme/Não Conforme/Parcialmente Conforme", "observacoes": "Análise detalhada LGPD.", "brechas_identificadas": ["lista de brechas LGPD"], "artigos_lgpd_relevantes": ["Art. 6º, II"] },
    "${PRINCIPLES.LGPD.NECESSIDADE}": { "pontuacao": 0.0, "status": "Conforme/Não Conforme/Parcialmente Conforme", "observacoes": "Análise detalhada LGPD.", "brechas_identificadas": ["lista de brechas LGPD"], "artigos_lgpd_relevantes": ["Art. 6º, III"] },
    "${PRINCIPLES.LGPD.LIVRE_ACESSO}": { "pontuacao": 0.0, "status": "Conforme/Não Conforme/Parcialmente Conforme", "observacoes": "Análise detalhada LGPD.", "brechas_identificadas": ["lista de brechas LGPD"], "artigos_lgpd_relevantes": ["Art. 6º, IV"] },
    "${PRINCIPLES.LGPD.QUALIDADE_DADOS}": { "pontuacao": 0.0, "status": "Conforme/Não Conforme/Parcialmente Conforme", "observacoes": "Análise detalhada LGPD.", "brechas_identificadas": ["lista de brechas LGPD"], "artigos_lgpd_relevantes": ["Art. 6º, V"] },
    "${PRINCIPLES.LGPD.TRANSPARENCIA}": { "pontuacao": 0.0, "status": "Conforme/Não Conforme/Parcialmente Conforme", "observacoes": "Análise detalhada LGPD.", "brechas_identificadas": ["lista de brechas LGPD"], "artigos_lgpd_relevantes": ["Art. 6º, VI"] },
    "${PRINCIPLES.LGPD.SEGURANCA}": { "pontuacao": 0.0, "status": "Conforme/Não Conforme/Parcialmente Conforme", "observacoes": "Análise detalhada LGPD.", "brechas_identificadas": ["lista de brechas LGPD"], "artigos_lgpd_relevantes": ["Art. 6º, VII"] },
    "${PRINCIPLES.LGPD.PREVENCAO}": { "pontuacao": 0.0, "status": "Conforme/Não Conforme/Parcialmente Conforme", "observacoes": "Análise detalhada LGPD.", "brechas_identificadas": ["lista de brechas LGPD"], "artigos_lgpd_relevantes": ["Art. 6º, VIII"] },
    "${PRINCIPLES.LGPD.NAO_DISCRIMINACAO}": { "pontuacao": 0.0, "status": "Conforme/Não Conforme/Parcialmente Conforme", "observacoes": "Análise detalhada LGPD.", "brechas_identificadas": ["lista de brechas LGPD"], "artigos_lgpd_relevantes": ["Art. 6º, IX"] },
    "${PRINCIPLES.LGPD.RESPONSABILIZACAO}": { "pontuacao": 0.0, "status": "Conforme/Não Conforme/Parcialmente Conforme", "observacoes": "Análise detalhada LGPD.", "brechas_identificadas": ["lista de brechas LGPD"], "artigos_lgpd_relevantes": ["Art. 6º, X"] }
  },
  "bases_legais_analisadas": {
    "consentimento": "Análise do consentimento conforme LGPD",
    "cumprimento_obrigacao_legal": "Análise de obrigação legal conforme LGPD",
    "execucao_contrato": "Análise de execução de contrato conforme LGPD",
    "legitimo_interesse": "Análise do legítimo interesse conforme LGPD"
  },
  "direitos_titulares_lgpd": {
    "confirmacao_existencia": "Verificação Art. 18, I LGPD",
    "acesso_dados": "Verificação Art. 18, II LGPD",
    "correcao_dados": "Verificação Art. 18, III LGPD",
    "anonimizacao_eliminacao": "Verificação Art. 18, IV LGPD",
    "portabilidade": "Verificação Art. 18, V LGPD",
    "revogacao_consentimento": "Verificação Art. 18, IX LGPD"
  },
  "resumo_executivo": "Resumo da análise especializada em LGPD com principais achados.",
  "recomendacoes": ["lista de recomendações específicas para LGPD"],
  "risco_vazamento_e_nao_conformidade": "Alto/Médio/Baixo",
  "potenciais_sancoes_anpd": "Análise das possíveis sanções da ANPD baseada nas não conformidades",
  "metadata": {
    "data_analise": "${new Date().toISOString()}",
    "versao_lei": "LGPD Lei 13.709/2018",
    "url_analisada": "${url}",
    "metodo_analise": "URL Context",
    "especialidade": "Análise especializada em LGPD"
  }
}

IMPORTANTE: Responda APENAS com o JSON válido, sem markdown, sem texto adicional antes ou depois. Foque exclusivamente na LGPD.
`;
}

module.exports = {
	createAnalysisPrompt,
	createAnalysisPromptWithUrlContext
};
