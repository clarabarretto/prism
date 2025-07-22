const { GoogleGenerativeAI } = require('@google/generative-ai');
const { config } = require('../config/environment');
const { LGPD_CONTEXT, LGPD_PRINCIPLES } = require('../constants/lgpd');
const { ERROR_MESSAGES } = require('../constants/api');

class GeminiAnalyzerService {
	constructor() {
		if (!config.geminiApiKey) {
			throw new Error(ERROR_MESSAGES.INVALID_GEMINI_KEY);
		}

		this.genAI = new GoogleGenerativeAI(config.geminiApiKey);
		this.model = this.genAI.getGenerativeModel({
			model: 'gemini-1.5-flash',
			generationConfig: {
				temperature: 0.3,
				topK: 40,
				topP: 0.95,
				maxOutputTokens: 8192,
			}
		});
	}

	/**
	 * Analisa uma política de privacidade usando o Gemini
	 * @param {string} policyText - Texto da política de privacidade
	 * @param {string} companyName - Nome da empresa
	 * @returns {Promise<Object>} - Resultado da análise
	 */
	async analyzePolicy(policyText, companyName = '') {
		try {
			if (!policyText || policyText.trim().length === 0) {
				throw new Error(ERROR_MESSAGES.EMPTY_POLICY_TEXT);
			}

			console.log(`Starting privacy policy analysis${companyName ? ` for ${companyName}` : ''}`);

			// Limita o texto para evitar exceder limites da API
			const limitedText = this.limitText(policyText);

			// Cria o prompt para análise
			const prompt = this.createAnalysisPrompt(limitedText, companyName);

			// Faz a chamada para a API do Gemini
			const result = await this.model.generateContent(prompt);
			const response = await result.response;
			const text = response.text();

			// Processa a resposta
			const analysisResult = this.processResponse(text);

			console.log(`Analysis completed successfully for ${companyName || 'company'}`);
			return analysisResult;

		} catch (error) {
			console.error(`Error in Gemini analysis:`, error.message);

			if (error.message.includes('API_KEY')) {
				throw new Error(ERROR_MESSAGES.INVALID_GEMINI_KEY);
			}

			throw new Error(`${ERROR_MESSAGES.ANALYSIS_FAILED}: ${error.message}`);
		}
	}

	/**
	 * Limita o texto para não exceder limites da API
	 * @param {string} text - Texto original
	 * @returns {string} - Texto limitado
	 */
	limitText(text) {
		if (text.length <= config.maxTextLength) {
			return text;
		}

		// Mantém o início e fim do texto para preservar informações importantes
		const halfLength = Math.floor(config.maxTextLength / 2);
		const start = text.substring(0, halfLength);
		const end = text.substring(text.length - halfLength);

		return `${start}\n\n[... TEXTO TRUNCADO PARA ANÁLISE ...]\n\n${end}`;
	}

	/**
	 * Cria o prompt para análise da política de privacidade
	 * @param {string} policyText - Texto da política
	 * @param {string} companyName - Nome da empresa
	 * @returns {string} - Prompt formatado
	 */
	createAnalysisPrompt(policyText, companyName) {
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

	/**
	 * Processa a resposta do Gemini e converte para JSON
	 * @param {string} responseText - Texto da resposta
	 * @returns {Object} - Objeto JSON processado
	 */
	processResponse(responseText) {
		try {
			// Remove possíveis marcadores de código markdown
			let cleanedText = responseText.trim();

			// Remove ```json e ``` se presentes
			if (cleanedText.startsWith('```json')) {
				cleanedText = cleanedText.substring(7);
			} else if (cleanedText.startsWith('```')) {
				cleanedText = cleanedText.substring(3);
			}

			if (cleanedText.endsWith('```')) {
				cleanedText = cleanedText.substring(0, cleanedText.length - 3);
			}

			// Remove espaços extras
			cleanedText = cleanedText.trim();

			// Converte para JSON
			const analysisResult = JSON.parse(cleanedText);

			// Valida a estrutura do resultado
			this.validateAnalysisResult(analysisResult);

			return analysisResult;

		} catch (error) {
			console.error('Error processing JSON response:', error.message);
			console.log('Original response:', responseText.substring(0, 500) + '...');

			return {
				error: ERROR_MESSAGES.PARSING_ERROR,
				raw_response: responseText.substring(0, 1000),
				details: error.message
			};
		}
	}

	/**
	 * Valida a estrutura do resultado da análise
	 * @param {Object} result - Resultado para validar
	 * @throws {Error} - Se a estrutura for inválida
	 */
	validateAnalysisResult(result) {
		const requiredFields = ['empresa', 'pontuacao_geral', 'principios', 'resumo_executivo', 'recomendacoes', 'risco_vazamento'];

		for (const field of requiredFields) {
			if (!(field in result)) {
				throw new Error(`Required field missing: ${field}`);
			}
		}

		// Valida se todos os princípios estão presentes
		const principios = Object.values(LGPD_PRINCIPLES);
		for (const principio of principios) {
			if (!(principio in result.principios)) {
				throw new Error(`Principle missing: ${principio}`);
			}
		}
	}
}

module.exports = GeminiAnalyzerService;
