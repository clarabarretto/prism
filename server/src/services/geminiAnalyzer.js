const { GoogleGenerativeAI } = require('@google/generative-ai');
const { config } = require('../config/environment');
const { PRINCIPLES } = require('../constants/lgpd');
const { ERROR_MESSAGES } = require('../constants/api');
const { createAnalysisPrompt, createAnalysisPromptWithUrlContext } = require('../utils/promptGenerator');

class GeminiAnalyzerService {
	constructor() {
		if (!config.geminiApiKey) {
			throw new Error(ERROR_MESSAGES.INVALID_GEMINI_KEY);
		}

		this.genAI = new GoogleGenerativeAI(config.geminiApiKey);
		this.model = this.genAI.getGenerativeModel({
            model: 'gemini-2.5-flash-lite',
            generationConfig: {
                temperature: 0.1,
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

			// Limita o texto para evitar exceder limites da API
			const limitedText = this.limitText(policyText);

			// Cria o prompt para análise
			const prompt = createAnalysisPrompt(limitedText, companyName);

			// Faz a chamada para a API do Gemini
			const result = await this.model.generateContent(prompt);
			const response = await result.response;
			const text = response.text();

			// Processa a resposta
			const analysisResult = this.processResponse(text);

			return analysisResult;

		} catch (error) {
			if (error.message.includes('API_KEY')) {
				throw new Error(ERROR_MESSAGES.INVALID_GEMINI_KEY);
			}

			throw new Error(`${ERROR_MESSAGES.ANALYSIS_FAILED}: ${error.message}`);
		}
	}

	/**
	 * Analisa uma política de privacidade usando o Gemini com contexto de URL
	 * @param {string} url - URL da política de privacidade
	 * @param {string} companyName - Nome da empresa
	 * @returns {Promise<Object>} - Resultado da análise
	 */
	async analyzePolicyWithUrlContext(url, companyName = '') {
		try {
			if (!url || url.trim().length === 0) {
				throw new Error('URL não fornecida');
			}

			// Cria o prompt para análise com contexto de URL
			const prompt = createAnalysisPromptWithUrlContext(url, companyName);

			// Faz a chamada para a API do Gemini com contexto de URL
			const result = await this.model.generateContent(prompt);
			const response = await result.response;
			const text = response.text();

			// Processa a resposta
			const analysisResult = this.processResponse(text);

			return analysisResult;

		} catch (error) {
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
			const rawResult = JSON.parse(cleanedText);

			// Normaliza possíveis formatos diferentes de resposta (LGPD/GDPR novo -> legado)
			const analysisResult = this.normalizeAnalysisResult(rawResult);

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
	 * Converte respostas no formato LGPD/GDPR (novo) para o formato legado esperado pelo app
	 * Mantém o resultado inalterado se já estiver no formato legado
	 */
	normalizeAnalysisResult(result) {
		if (!result || typeof result !== 'object') {
			return result;
		}

		// Já está no formato esperado (especializado em LGPD)
		const hasExpectedShape = 'pontuacao_geral' in result && 'principios' in result;
		if (hasExpectedShape) {
			return result;
		}

		// Formato antigo com chaves conformidade_lgpd (para compatibilidade)
		const lgpd = result.conformidade_lgpd;
		if (lgpd && typeof lgpd === 'object') {
			return {
				empresa: result.empresa ?? null,
				pontuacao_geral: lgpd.pontuacao_geral ?? 0,
				principios: lgpd.principios ?? {},
				bases_legais_analisadas: result.bases_legais_analisadas ?? {},
				direitos_titulares_lgpd: result.direitos_titulares_lgpd ?? {},
				resumo_executivo: result.resumo_executivo ?? '',
				recomendacoes: result.recomendacoes ?? [],
				risco_vazamento: result.risco_vazamento_e_nao_conformidade ?? result.risco_vazamento ?? 'Indefinido',
				potenciais_sancoes_anpd: result.potenciais_sancoes_anpd ?? 'Não avaliado',
				metadata: result.metadata ?? {}
			};
		}

		// Caso não seja possível normalizar, retorna o original para que a validação trate
		return result;
	}

	/**
	 * Valida a estrutura do resultado da análise especializada em LGPD
	 * @param {Object} result - Resultado para validar
	 * @throws {Error} - Se a estrutura for inválida
	 */
	validateAnalysisResult(result) {
		const requiredFields = ['empresa', 'pontuacao_geral', 'principios', 'resumo_executivo', 'recomendacoes'];

		for (const field of requiredFields) {
			if (!(field in result)) {
				throw new Error(`Required field missing: ${field}`);
			}
		}

		// Valida se todos os princípios da LGPD estão presentes
		const principios = Object.values(PRINCIPLES.LGPD);
		for (const principio of principios) {
			if (!(principio in result.principios)) {
				throw new Error(`LGPD principle missing: ${principio}`);
			}
		}
	}
}

module.exports = GeminiAnalyzerService;
