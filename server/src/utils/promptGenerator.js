const { LGPD_CONTEXT, LGPD_PRINCIPLES } = require('../constants/lgpd');

function createAnalysisPrompt(policyText, companyName) {
	return `
Você é um especialista em análise de políticas de privacidade e conformidade com a Lei Geral de Proteção de Dados (LGPD) do Brasil.

CONTEXTO DA LGPD:
${LGPD_CONTEXT}

TAREFA:
Analise a política de privacidade da empresa "${companyName}" abaixo e avalie sua conformidade com os princípios da LGPD.

POLÍTICA DE PRIVACIDADE A ANALISAR:
${policyText}

INSTRUÇÕES PARA ANÁLISE:
1. Avalie cada um dos 10 princípios da LGPD de forma criteriosa e detalhada.
2. Para cada princípio, atribua uma pontuação de 0 a 10 baseada na conformidade.
3. Identifique brechas específicas e violações aos princípios da LGPD.
4. Calcule uma pontuação geral de conformidade (média das pontuações individuais).
5. Avalie o risco de vazamento baseado na análise geral.

CRITÉRIOS DE PONTUAÇÃO:
- 9-10: Totalmente conforme, práticas exemplares
- 7-8: Conforme com pequenas melhorias possíveis
- 5-6: Parcialmente conforme, requer melhorias
- 3-4: Não conforme com problemas significativos
- 0-2: Totalmente não conforme, riscos graves

FORMATO DE RESPOSTA (JSON VÁLIDO):
{
  "empresa": "${companyName}",
  "pontuacao_geral": 0.0,
  "principios": {
    "${LGPD_PRINCIPLES.FINALIDADE}": {
      "pontuacao": 0.0,
      "status": "Conforme/Não Conforme/Parcialmente Conforme",
      "observacoes": "Análise detalhada da conformidade",
      "brechas_identificadas": ["lista específica de brechas"]
    },
    "${LGPD_PRINCIPLES.ADEQUACAO}": {
      "pontuacao": 0.0,
      "status": "Conforme/Não Conforme/Parcialmente Conforme",
      "observacoes": "Análise detalhada da conformidade",
      "brechas_identificadas": ["lista específica de brechas"]
    },
    "${LGPD_PRINCIPLES.NECESSIDADE}": {
      "pontuacao": 0.0,
      "status": "Conforme/Não Conforme/Parcialmente Conforme",
      "observacoes": "Análise detalhada da conformidade",
      "brechas_identificadas": ["lista específica de brechas"]
    },
    "${LGPD_PRINCIPLES.LIVRE_ACESSO}": {
      "pontuacao": 0.0,
      "status": "Conforme/Não Conforme/Parcialmente Conforme",
      "observacoes": "Análise detalhada da conformidade",
      "brechas_identificadas": ["lista específica de brechas"]
    },
    "${LGPD_PRINCIPLES.QUALIDADE_DADOS}": {
      "pontuacao": 0.0,
      "status": "Conforme/Não Conforme/Parcialmente Conforme",
      "observacoes": "Análise detalhada da conformidade",
      "brechas_identificadas": ["lista específica de brechas"]
    },
    "${LGPD_PRINCIPLES.TRANSPARENCIA}": {
      "pontuacao": 0.0,
      "status": "Conforme/Não Conforme/Parcialmente Conforme",
      "observacoes": "Análise detalhada da conformidade",
      "brechas_identificadas": ["lista específica de brechas"]
    },
    "${LGPD_PRINCIPLES.SEGURANCA}": {
      "pontuacao": 0.0,
      "status": "Conforme/Não Conforme/Parcialmente Conforme",
      "observacoes": "Análise detalhada da conformidade",
      "brechas_identificadas": ["lista específica de brechas"]
    },
    "${LGPD_PRINCIPLES.PREVENCAO}": {
      "pontuacao": 0.0,
      "status": "Conforme/Não Conforme/Parcialmente Conforme",
      "observacoes": "Análise detalhada da conformidade",
      "brechas_identificadas": ["lista específica de brechas"]
    },
    "${LGPD_PRINCIPLES.NAO_DISCRIMINACAO}": {
      "pontuacao": 0.0,
      "status": "Conforme/Não Conforme/Parcialmente Conforme",
      "observacoes": "Análise detalhada da conformidade",
      "brechas_identificadas": ["lista específica de brechas"]
    },
    "${LGPD_PRINCIPLES.RESPONSABILIZACAO}": {
      "pontuacao": 0.0,
      "status": "Conforme/Não Conforme/Parcialmente Conforme",
      "observacoes": "Análise detalhada da conformidade",
      "brechas_identificadas": ["lista específica de brechas"]
    }
  },
  "resumo_executivo": "Resumo abrangente da análise e principais descobertas",
  "recomendacoes": ["lista detalhada de recomendações específicas"],
  "risco_vazamento": "Alto/Médio/Baixo",
  "metadata": {
    "data_analise": "${new Date().toISOString()}",
    "versao_lgpd": "Lei 13.709/2018",
    "caracteres_analisados": ${policyText.length}
  }
}

IMPORTANTE: Responda APENAS com o JSON válido, sem markdown, sem texto adicional antes ou depois.
`;
}

function createAnalysisPromptWithUrlContext(url, companyName) {
	return `
Você é um especialista em análise de políticas de privacidade e conformidade com a Lei Geral de Proteção de Dados (LGPD) do Brasil.

CONTEXTO DA LGPD:
${LGPD_CONTEXT}

TAREFA:
Analise a política de privacidade da empresa "${companyName}" acessando diretamente a URL fornecida e avalie sua conformidade com os princípios da LGPD.

URL DA POLÍTICA DE PRIVACIDADE:
${url}

INSTRUÇÕES PARA ANÁLISE:
1. Acesse a URL fornecida e extraia o conteúdo da política de privacidade.
2. Avalie cada um dos 10 princípios da LGPD de forma criteriosa e detalhada.
3. Para cada princípio, atribua uma pontuação de 0 a 10 baseada na conformidade.
4. Identifique brechas específicas e violações aos princípios da LGPD.
5. Calcule uma pontuação geral de conformidade (média das pontuações individuais).
6. Avalie o risco de vazamento baseado na análise geral.

CRITÉRIOS DE PONTUAÇÃO:
- 9-10: Totalmente conforme, práticas exemplares
- 7-8: Conforme com pequenas melhorias possíveis
- 5-6: Parcialmente conforme, requer melhorias
- 3-4: Não conforme com problemas significativos
- 0-2: Totalmente não conforme, riscos graves

FORMATO DE RESPOSTA (JSON VÁLIDO):
{
  "empresa": "${companyName}",
  "pontuacao_geral": 0.0,
  "principios": {
    "${LGPD_PRINCIPLES.FINALIDADE}": {
      "pontuacao": 0.0,
      "status": "Conforme/Não Conforme/Parcialmente Conforme",
      "observacoes": "Análise detalhada da conformidade",
      "brechas_identificadas": ["lista específica de brechas"]
    },
    "${LGPD_PRINCIPLES.ADEQUACAO}": {
      "pontuacao": 0.0,
      "status": "Conforme/Não Conforme/Parcialmente Conforme",
      "observacoes": "Análise detalhada da conformidade",
      "brechas_identificadas": ["lista específica de brechas"]
    },
    "${LGPD_PRINCIPLES.NECESSIDADE}": {
      "pontuacao": 0.0,
      "status": "Conforme/Não Conforme/Parcialmente Conforme",
      "observacoes": "Análise detalhada da conformidade",
      "brechas_identificadas": ["lista específica de brechas"]
    },
    "${LGPD_PRINCIPLES.LIVRE_ACESSO}": {
      "pontuacao": 0.0,
      "status": "Conforme/Não Conforme/Parcialmente Conforme",
      "observacoes": "Análise detalhada da conformidade",
      "brechas_identificadas": ["lista específica de brechas"]
    },
    "${LGPD_PRINCIPLES.QUALIDADE_DADOS}": {
      "pontuacao": 0.0,
      "status": "Conforme/Não Conforme/Parcialmente Conforme",
      "observacoes": "Análise detalhada da conformidade",
      "brechas_identificadas": ["lista específica de brechas"]
    },
    "${LGPD_PRINCIPLES.TRANSPARENCIA}": {
      "pontuacao": 0.0,
      "status": "Conforme/Não Conforme/Parcialmente Conforme",
      "observacoes": "Análise detalhada da conformidade",
      "brechas_identificadas": ["lista específica de brechas"]
    },
    "${LGPD_PRINCIPLES.SEGURANCA}": {
      "pontuacao": 0.0,
      "status": "Conforme/Não Conforme/Parcialmente Conforme",
      "observacoes": "Análise detalhada da conformidade",
      "brechas_identificadas": ["lista específica de brechas"]
    },
    "${LGPD_PRINCIPLES.PREVENCAO}": {
      "pontuacao": 0.0,
      "status": "Conforme/Não Conforme/Parcialmente Conforme",
      "observacoes": "Análise detalhada da conformidade",
      "brechas_identificadas": ["lista específica de brechas"]
    },
    "${LGPD_PRINCIPLES.NAO_DISCRIMINACAO}": {
      "pontuacao": 0.0,
      "status": "Conforme/Não Conforme/Parcialmente Conforme",
      "observacoes": "Análise detalhada da conformidade",
      "brechas_identificadas": ["lista específica de brechas"]
    },
    "${LGPD_PRINCIPLES.RESPONSABILIZACAO}": {
      "pontuacao": 0.0,
      "status": "Conforme/Não Conforme/Parcialmente Conforme",
      "observacoes": "Análise detalhada da conformidade",
      "brechas_identificadas": ["lista específica de brechas"]
    }
  },
  "resumo_executivo": "Resumo abrangente da análise e principais descobertas",
  "recomendacoes": ["lista detalhada de recomendações específicas"],
  "risco_vazamento": "Alto/Médio/Baixo",
  "metadata": {
    "data_analise": "${new Date().toISOString()}",
    "versao_lgpd": "Lei 13.709/2018",
    "url_analisada": "${url}",
    "metodo_analise": "URL Context"
  }
}

IMPORTANTE: Responda APENAS com o JSON válido, sem markdown, sem texto adicional antes ou depois.
`;
}

module.exports = {
	createAnalysisPrompt,
	createAnalysisPromptWithUrlContext
};
