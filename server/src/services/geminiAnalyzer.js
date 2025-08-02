const { GoogleGenerativeAI } = require('@google/generative-ai');
const { config } = require('../config/environment');
const { LGPD_CONTEXT, LGPD_PRINCIPLES } = require('../constants/lgpd');
const { ERROR_MESSAGES } = require('../constants/api');
const { createAnalysisPrompt, createAnalysisPromptWithUrlContext } = require('../utils/promptGenerator');

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
