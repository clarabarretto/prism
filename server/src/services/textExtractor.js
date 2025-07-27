const axios = require('axios');
const cheerio = require('cheerio');
const { config } = require('../config/environment');
const { DEFAULT_HEADERS, ERROR_MESSAGES } = require('../constants/api');

class TextExtractorService {
	constructor() {
		this.axiosInstance = axios.create({
			timeout: config.requestTimeout,
			maxRedirects: config.maxRedirects,
			headers: DEFAULT_HEADERS
		});
	}

	/**
	 * Extrai o texto de uma política de privacidade a partir de uma URL
	 * @param {string} url - URL da política de privacidade
	 * @returns {Promise<string|null>} - Texto extraído ou null em caso de erro
	 */
	async extractText(url) {
		try {
			// Validação da URL
			if (!this.isValidUrl(url)) {
				throw new Error(ERROR_MESSAGES.INVALID_URL);
			}

			console.log(`🔍 Extraindo texto da URL: ${url}`);

			const response = await this.axiosInstance.get(url);

			if (!response.data) {
				throw new Error('Resposta vazia da URL');
			}

			const $ = cheerio.load(response.data);

			// Remove elementos desnecessários
			this.removeUnwantedElements($);

			// Extrai o texto principal
			const text = this.extractMainText($);

			if (!text || text.trim().length === 0) {
				throw new Error('Nenhum texto encontrado na página');
			}

			console.log(`✅ Texto extraído com sucesso (${text.length} caracteres)`);
			return text;

		} catch (error) {
			console.error(`❌ Erro ao extrair texto da URL ${url}:`, error.message);

			if (error.code === 'ENOTFOUND') {
				throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
			} else if (error.code === 'ECONNABORTED') {
				throw new Error(ERROR_MESSAGES.TIMEOUT_ERROR);
			}

			throw error;
		}
	}

	/**
	 * Valida se a URL é válida
	 * @param {string} url - URL para validar
	 * @returns {boolean} - True se válida
	 */
	isValidUrl(url) {
		try {
			const urlObj = new URL(url);
			return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
		} catch {
			return false;
		}
	}

	/**
	 * Remove elementos desnecessários do DOM
	 * @param {Object} $ - Instância do Cheerio
	 */
	removeUnwantedElements($) {
		// Remove scripts, estilos, comentários e outros elementos desnecessários
		$(
			'script, style, noscript, iframe, object, embed, ' +
			'nav, header, footer, aside, .navigation, .menu, ' +
			'.sidebar, .advertisement, .ads, .social-media, ' +
			'.cookie-banner, .newsletter, .popup'
		).remove();

		// Remove comentários HTML
		$('*').contents().filter(function () {
			return this.nodeType === 8; // Node.COMMENT_NODE
		}).remove();
	}

	/**
	 * Extrai o texto principal do documento
	 * @param {Object} $ - Instância do Cheerio
	 * @returns {string} - Texto extraído e limpo
	 */
	extractMainText($) {
		// Tenta encontrar o conteúdo principal
		let mainContent = '';

		// Prioriza elementos que geralmente contêm o conteúdo principal
		const contentSelectors = [
			'main',
			'[role="main"]',
			'.content',
			'.main-content',
			'#content',
			'#main',
			'.policy-content',
			'.privacy-policy',
			'article',
			'.container'
		];

		for (const selector of contentSelectors) {
			const element = $(selector);
			if (element.length > 0) {
				mainContent = element.first().text();
				if (mainContent.trim().length > 500) {
					break;
				}
			}
		}

		// Se não encontrou conteúdo específico, usa o body
		if (!mainContent || mainContent.trim().length < 500) {
			mainContent = $('body').text();
		}

		// Limpa e formata o texto
		return this.cleanText(mainContent);
	}

	/**
	 * Limpa e formata o texto extraído
	 * @param {string} text - Texto para limpar
	 * @returns {string} - Texto limpo
	 */
	cleanText(text) {
		if (!text) return '';

		return text
			// Remove múltiplos espaços e quebras de linha
			.replace(/\s+/g, ' ')
			.replace(/\n+/g, ' ')
			// Remove caracteres especiais desnecessários
			.replace(/[^\w\s\.,;:!?()"\-]/g, ' ')
			// Remove espaços extras
			.replace(/\s{2,}/g, ' ')
			.trim();
	}

	/**
	 * Extrai metadados da página
	 * @param {string} url - URL da página
	 * @returns {Promise<Object>} - Metadados extraídos
	 */
	async extractMetadata(url) {
		try {
			const response = await this.axiosInstance.get(url);
			const $ = cheerio.load(response.data);

			return {
				title: $('title').text().trim() || '',
				description: $('meta[name="description"]').attr('content') || '',
				keywords: $('meta[name="keywords"]').attr('content') || '',
				lastModified: $('meta[name="last-modified"]').attr('content') ||
					$('meta[property="article:modified_time"]').attr('content') || '',
				language: $('html').attr('lang') || $('meta[http-equiv="content-language"]').attr('content') || 'pt-BR'
			};
		} catch (error) {
			console.warn(`⚠️ Erro ao extrair metadados: ${error.message}`);
			return {};
		}
	}
}

module.exports = TextExtractorService;
