const { LGPD_CONTEXT, GDPR_CONTEXT, PRINCIPLES } = require('../constants/lgpd');

function createAnalysisPrompt(policyText, companyName) {
	return `
Você é um especialista em análise de políticas de privacidade e conformidade com a Lei Geral de Proteção de Dados (LGPD) do Brasil e o General Data Protection Regulation (GDPR) da União Europeia.

CONTEXTO DA LGPD:
${LGPD_CONTEXT}

CONTEXTO DA GDPR:
${GDPR_CONTEXT}

TAREFA:
Analise a política de privacidade da empresa "${companyName}" abaixo e avalie sua conformidade com os princípios e requisitos da LGPD e da GDPR. Sua análise deve ser robusta, detalhada e não deixar brechas ou generalidades.

POLÍTICA DE PRIVACIDADE A ANALISAR:
${policyText}

INSTRUÇÕES PARA ANÁLISE:
1. Avalie cada um dos princípios da LGPD e da GDPR de forma criteriosa e detalhada, identificando como a política de privacidade se alinha ou falha em relação a cada um deles.
2. Para cada princípio, atribua uma pontuação de 0 a 10 baseada na conformidade. Considere as nuances e especificidades de cada lei.
3. Identifique brechas específicas, violações e áreas de melhoria em relação a AMBAS as legislações (LGPD e GDPR).
4. Calcule uma pontuação geral de conformidade para LGPD e outra para GDPR (média das pontuações individuais de cada lei).
5. Avalie o risco de vazamento de dados e não conformidade com base na análise geral, considerando as implicações de ambas as leis.
6. Forneça recomendações específicas e acionáveis para cada brecha identificada, visando a conformidade plena com LGPD e GDPR.

CRITÉIOS DE PONTUAÇÃO:
- 9-10: Totalmente conforme, práticas exemplares e alinhadas com as melhores práticas de ambas as leis.
- 7-8: Conforme com pequenas melhorias possíveis, demonstrando bom entendimento e aplicação das leis.
- 5-6: Parcialmente conforme, requer melhorias significativas para atender aos requisitos de ambas as leis.
- 3-4: Não conforme com problemas significativos, indicando falhas graves na implementação das leis.
- 0-2: Totalmente não conforme, riscos graves e violações flagrantes das leis.

FORMATO DE RESPOSTA (JSON VÁLIDO):
{
  "empresa": "${companyName}",
  "conformidade_lgpd": {
    "pontuacao_geral": 0.0,
    "principios": {
      "${PRINCIPLES.LGPD.FINALIDADE}": {
        "pontuacao": 0.0,
        "status": "Conforme/Não Conforme/Parcialmente Conforme",
        "observacoes": "Análise detalhada da conformidade com a LGPD para este princípio.",
        "brechas_identificadas": ["lista específica de brechas LGPD"]
      },
      "${PRINCIPLES.LGPD.ADEQUACAO}": {
        "pontuacao": 0.0,
        "status": "Conforme/Não Conforme/Parcialmente Conforme",
        "observacoes": "Análise detalhada da conformidade com a LGPD para este princípio.",
        "brechas_identificadas": ["lista específica de brechas LGPD"]
      },
      "${PRINCIPLES.LGPD.NECESSIDADE}": {
        "pontuacao": 0.0,
        "status": "Conforme/Não Conforme/Parcialmente Conforme",
        "observacoes": "Análise detalhada da conformidade com a LGPD para este princípio.",
        "brechas_identificadas": ["lista específica de brechas LGPD"]
      },
      "${PRINCIPLES.LGPD.LIVRE_ACESSO}": {
        "pontuacao": 0.0,
        "status": "Conforme/Não Conforme/Parcialmente Conforme",
        "observacoes": "Análise detalhada da conformidade com a LGPD para este princípio.",
        "brechas_identificadas": ["lista específica de brechas LGPD"]
      },
      "${PRINCIPLES.LGPD.QUALIDADE_DADOS}": {
        "pontuacao": 0.0,
        "status": "Conforme/Não Conforme/Parcialmente Conforme",
        "observacoes": "Análise detalhada da conformidade com a LGPD para este princípio.",
        "brechas_identificadas": ["lista específica de brechas LGPD"]
      },
      "${PRINCIPLES.LGPD.TRANSPARENCIA}": {
        "pontuacao": 0.0,
        "status": "Conforme/Não Conforme/Parcialmente Conforme",
        "observacoes": "Análise detalhada da conformidade com a LGPD para este princípio.",
        "brechas_identificadas": ["lista específica de brechas LGPD"]
      },
      "${PRINCIPLES.LGPD.SEGURANCA}": {
        "pontuacao": 0.0,
        "status": "Conforme/Não Conforme/Parcialmente Conforme",
        "observacoes": "Análise detalhada da conformidade com a LGPD para este princípio.",
        "brechas_identificadas": ["lista específica de brechas LGPD"]
      },
      "${PRINCIPLES.LGPD.PREVENCAO}": {
        "pontuacao": 0.0,
        "status": "Conforme/Não Conforme/Parcialmente Conforme",
        "observacoes": "Análise detalhada da conformidade com a LGPD para este princípio.",
        "brechas_identificadas": ["lista específica de brechas LGPD"]
      },
      "${PRINCIPLES.LGPD.NAO_DISCRIMINACAO}": {
        "pontuacao": 0.0,
        "status": "Conforme/Não Conforme/Parcialmente Conforme",
        "observacoes": "Análise detalhada da conformidade com a LGPD para este princípio.",
        "brechas_identificadas": ["lista específica de brechas LGPD"]
      },
      "${PRINCIPLES.LGPD.RESPONSABILIZACAO}": {
        "pontuacao": 0.0,
        "status": "Conforme/Não Conforme/Parcialmente Conforme",
        "observacoes": "Análise detalhada da conformidade com a LGPD para este princípio.",
        "brechas_identificadas": ["lista específica de brechas LGPD"]
      }
    }
  },
  "conformidade_gdpr": {
    "pontuacao_geral": 0.0,
    "principios": {
      "${PRINCIPLES.GDPR.LICITUDE_LEALDADE_TRANSPARENCIA}": {
        "pontuacao": 0.0,
        "status": "Conforme/Não Conforme/Parcialmente Conforme",
        "observacoes": "Análise detalhada da conformidade com a GDPR para este princípio.",
        "brechas_identificadas": ["lista específica de brechas GDPR"]
      },
      "${PRINCIPLES.GDPR.LIMITACAO_FINALIDADE}": {
        "pontuacao": 0.0,
        "status": "Conforme/Não Conforme/Parcialmente Conforme",
        "observacoes": "Análise detalhada da conformidade com a GDPR para este princípio.",
        "brechas_identificadas": ["lista específica de brechas GDPR"]
      },
      "${PRINCIPLES.GDPR.MINIMIZACAO_DADOS}": {
        "pontuacao": 0.0,
        "status": "Conforme/Não Conforme/Parcialmente Conforme",
        "observacoes": "Análise detalhada da conformidade com a GDPR para este princípio.",
        "brechas_identificadas": ["lista específica de brechas GDPR"]
      },
      "${PRINCIPLES.GDPR.EXATIDAO}": {
        "pontuacao": 0.0,
        "status": "Conforme/Não Conforme/Parcialmente Conforme",
        "observacoes": "Análise detalhada da conformidade com a GDPR para este princípio.",
        "brechas_identificadas": ["lista específica de brechas GDPR"]
      },
      "${PRINCIPLES.GDPR.LIMITACAO_CONSERVACAO}": {
        "pontuacao": 0.0,
        "status": "Conforme/Não Conforme/Parcialmente Conforme",
        "observacoes": "Análise detalhada da conformidade com a GDPR para este princípio.",
        "brechas_identificadas": ["lista específica de brechas GDPR"]
      },
      "${PRINCIPLES.GDPR.INTEGRIDADE_CONFIDENCIALIDADE}": {
        "pontuacao": 0.0,
        "status": "Conforme/Não Conforme/Parcialmente Conforme",
        "observacoes": "Análise detalhada da conformidade com a GDPR para este princípio.",
        "brechas_identificadas": ["lista específica de brechas GDPR"]
      },
      "${PRINCIPLES.GDPR.RESPONSABILIDADE}": {
        "pontuacao": 0.0,
        "status": "Conforme/Não Conforme/Parcialmente Conforme",
        "observacoes": "Análise detalhada da conformidade com a GDPR para este princípio.",
        "brechas_identificadas": ["lista específica de brechas GDPR"]
      }
    }
  },
  "resumo_executivo": "Resumo abrangente da análise e principais descobertas para LGPD e GDPR.",
  "recomendacoes": ["lista detalhada de recomendações específicas para LGPD e GDPR"],
  "risco_vazamento_e_nao_conformidade": "Alto/Médio/Baixo",
  "metadata": {
    "data_analise": "${new Date().toISOString()}",
    "versoes_leis": "LGPD Lei 13.709/2018 e GDPR Regulamento (UE) 2016/679",
    "caracteres_analisados": ${policyText.length}
  }
}

IMPORTANTE: Responda APENAS com o JSON válido, sem markdown, sem texto adicional antes ou depois.
`;
}

function createAnalysisPromptWithUrlContext(url, companyName) {
	return `
Você é um especialista em análise de políticas de privacidade e conformidade com a Lei Geral de Proteção de Dados (LGPD) do Brasil e o General Data Protection Regulation (GDPR) da União Europeia.

CONTEXTO DA LGPD:
${LGPD_CONTEXT}

CONTEXTO DA GDPR:
${GDPR_CONTEXT}

TAREFA:
Analise a política de privacidade da empresa "${companyName}" acessando diretamente a URL fornecida e avalie sua conformidade com os princípios e requisitos da LGPD e da GDPR. Sua análise deve ser robusta, detalhada e não deixar brechas ou generalidades.

URL DA POLÍTICA DE PRIVACIDADE:
${url}

INSTRUÇÕES PARA ANÁLISE:
1. Acesse a URL fornecida e extraia o conteúdo da política de privacidade.
2. Avalie cada um dos princípios da LGPD e da GDPR de forma criteriosa e detalhada, identificando como a política de privacidade se alinha ou falha em relação a cada um deles.
3. Para cada princípio, atribua uma pontuação de 0 a 10 baseada na conformidade. Considere as nuances e especificidades de cada lei.
4. Identifique brechas específicas, violações e áreas de melhoria em relação a AMBAS as legislações (LGPD e GDPR).
5. Calcule uma pontuação geral de conformidade para LGPD e outra para GDPR (média das pontuações individuais de cada lei).
6. Avalie o risco de vazamento de dados e não conformidade com base na análise geral, considerando as implicações de ambas as leis.
7. Forneça recomendações específicas e acionáveis para cada brecha identificada, visando a conformidade plena com LGPD e GDPR.

CRITÉRIOS DE PONTUAÇÃO:
- 9-10: Totalmente conforme, práticas exemplares e alinhadas com as melhores práticas de ambas as leis.
- 7-8: Conforme com pequenas melhorias possíveis, demonstrando bom entendimento e aplicação das leis.
- 5-6: Parcialmente conforme, requer melhorias significativas para atender aos requisitos de ambas as leis.
- 3-4: Não conforme com problemas significativos, indicando falhas graves na implementação das leis.
- 0-2: Totalmente não conforme, riscos graves e violações flagrantes das leis.

FORMATO DE RESPOSTA (JSON VÁLIDO):
{
  "empresa": "${companyName}",
  "conformidade_lgpd": {
    "pontuacao_geral": 0.0,
    "principios": {
      "${PRINCIPLES.LGPD.FINALIDADE}": {
        "pontuacao": 0.0,
        "status": "Conforme/Não Conforme/Parcialmente Conforme",
        "observacoes": "Análise detalhada da conformidade com a LGPD para este princípio.",
        "brechas_identificadas": ["lista específica de brechas LGPD"]
      },
      "${PRINCIPLES.LGPD.ADEQUACAO}": {
        "pontuacao": 0.0,
        "status": "Conforme/Não Conforme/Parcialmente Conforme",
        "observacoes": "Análise detalhada da conformidade com a LGPD para este princípio.",
        "brechas_identificadas": ["lista específica de brechas LGPD"]
      },
      "${PRINCIPLES.LGPD.NECESSIDADE}": {
        "pontuacao": 0.0,
        "status": "Conforme/Não Conforme/Parcialmente Conforme",
        "observacoes": "Análise detalhada da conformidade com a LGPD para este princípio.",
        "brechas_identificadas": ["lista específica de brechas LGPD"]
      },
      "${PRINCIPLES.LGPD.LIVRE_ACESSO}": {
        "pontuacao": 0.0,
        "status": "Conforme/Não Conforme/Parcialmente Conforme",
        "observacoes": "Análise detalhada da conformidade com a LGPD para este princípio.",
        "brechas_identificadas": ["lista específica de brechas LGPD"]
      },
      "${PRINCIPLES.LGPD.QUALIDADE_DADOS}": {
        "pontuacao": 0.0,
        "status": "Conforme/Não Conforme/Parcialmente Conforme",
        "observacoes": "Análise detalhada da conformidade com a LGPD para este princípio.",
        "brechas_identificadas": ["lista específica de brechas LGPD"]
      },
      "${PRINCIPLES.LGPD.TRANSPARENCIA}": {
        "pontuacao": 0.0,
        "status": "Conforme/Não Conforme/Parcialmente Conforme",
        "observacoes": "Análise detalhada da conformidade com a LGPD para este princípio.",
        "brechas_identificadas": ["lista específica de brechas LGPD"]
      },
      "${PRINCIPLES.LGPD.SEGURANCA}": {
        "pontuacao": 0.0,
        "status": "Conforme/Não Conforme/Parcialmente Conforme",
        "observacoes": "Análise detalhada da conformidade com a LGPD para este princípio.",
        "brechas_identificadas": ["lista específica de brechas LGPD"]
      },
      "${PRINCIPLES.LGPD.PREVENCAO}": {
        "pontuacao": 0.0,
        "status": "Conforme/Não Conforme/Parcialmente Conforme",
        "observacoes": "Análise detalhada da conformidade com a LGPD para este princípio.",
        "brechas_identificadas": ["lista específica de brechas LGPD"]
      },
      "${PRINCIPLES.LGPD.NAO_DISCRIMINACAO}": {
        "pontuacao": 0.0,
        "status": "Conforme/Não Conforme/Parcialmente Conforme",
        "observacoes": "Análise detalhada da conformidade com a LGPD para este princípio.",
        "brechas_identificadas": ["lista específica de brechas LGPD"]
      },
      "${PRINCIPLES.LGPD.RESPONSABILIZACAO}": {
        "pontuacao": 0.0,
        "status": "Conforme/Não Conforme/Parcialmente Conforme",
        "observacoes": "Análise detalhada da conformidade com a LGPD para este princípio.",
        "brechas_identificadas": ["lista específica de brechas LGPD"]
      }
    }
  },
  "conformidade_gdpr": {
    "pontuacao_geral": 0.0,
    "principios": {
      "${PRINCIPLES.GDPR.LICITUDE_LEALDADE_TRANSPARENCIA}": {
        "pontuacao": 0.0,
        "status": "Conforme/Não Conforme/Parcialmente Conforme",
        "observacoes": "Análise detalhada da conformidade com a GDPR para este princípio.",
        "brechas_identificadas": ["lista específica de brechas GDPR"]
      },
      "${PRINCIPLES.GDPR.LIMITACAO_FINALIDADE}": {
        "pontuacao": 0.0,
        "status": "Conforme/Não Conforme/Parcialmente Conforme",
        "observacoes": "Análise detalhada da conformidade com a GDPR para este princípio.",
        "brechas_identificadas": ["lista específica de brechas GDPR"]
      },
      "${PRINCIPLES.GDPR.MINIMIZACAO_DADOS}": {
        "pontuacao": 0.0,
        "status": "Conforme/Não Conforme/Parcialmente Conforme",
        "observacoes": "Análise detalhada da conformidade com a GDPR para este princípio.",
        "brechas_identificadas": ["lista específica de brechas GDPR"]
      },
      "${PRINCIPLES.GDPR.EXATIDAO}": {
        "pontuacao": 0.0,
        "status": "Conforme/Não Conforme/Parcialmente Conforme",
        "observacoes": "Análise detalhada da conformidade com a GDPR para este princípio.",
        "brechas_identificadas": ["lista específica de brechas GDPR"]
      },
      "${PRINCIPLES.GDPR.LIMITACAO_CONSERVACAO}": {
        "pontuacao": 0.0,
        "status": "Conforme/Não Conforme/Parcialmente Conforme",
        "observacoes": "Análise detalhada da conformidade com a GDPR para este princípio.",
        "brechas_identificadas": ["lista específica de brechas GDPR"]
      },
      "${PRINCIPLES.GDPR.INTEGRIDADE_CONFIDENCIALIDADE}": {
        "pontuacao": 0.0,
        "status": "Conforme/Não Conforme/Parcialmente Conforme",
        "observacoes": "Análise detalhada da conformidade com a GDPR para este princípio.",
        "brechas_identificadas": ["lista específica de brechas GDPR"]
      },
      "${PRINCIPLES.GDPR.RESPONSABILIDADE}": {
        "pontuacao": 0.0,
        "status": "Conforme/Não Conforme/Parcialmente Conforme",
        "observacoes": "Análise detalhada da conformidade com a GDPR para este princípio.",
        "brechas_identificadas": ["lista específica de brechas GDPR"]
      }
    }
  },
  "resumo_executivo": "Resumo abrangente da análise e principais descobertas para LGPD e GDPR.",
  "recomendacoes": ["lista detalhada de recomendações específicas para LGPD e GDPR"],
  "risco_vazamento_e_nao_conformidade": "Alto/Médio/Baixo",
  "metadata": {
    "data_analise": "${new Date().toISOString()}",
    "versoes_leis": "LGPD Lei 13.709/2018 e GDPR Regulamento (UE) 2016/679",
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
