const fs = require('fs').promises;
const path = require('path');
const TextExtractorService = require('./textExtractor');
const GeminiAnalyzerService = require('./geminiAnalyzer');
const PdfExtractorService = require('./pdfExtractor');
const { config } = require('../config/environment');
const { ERROR_MESSAGES, SUCCESS_MESSAGES } = require('../constants/api');

class PrivacyPolicyAnalyzerService {
	constructor() {
		this.textExtractor = new TextExtractorService();
		this.geminiAnalyzer = new GeminiAnalyzerService();
		this.pdfExtractor = new PdfExtractorService();
	}

	/**
	 * Analisa uma política de privacidade a partir de uma URL
	 * @param {string} url - URL da política de privacidade
	 * @param {string} companyName - Nome da empresa
	 * @returns {Promise<Object>} - Resultado da análise
	 */
	async analyzeFromUrl(url, companyName = '') {
		try {
			console.log(`Starting privacy policy analysis`);
			console.log(`URL: ${url}`);
			console.log(`Company: ${companyName || 'Not specified'}`);

			// Extrai o texto da URL
			const policyText = await this.textExtractor.extractText(url);

			if (!policyText) {
				throw new Error(ERROR_MESSAGES.EXTRACTION_FAILED);
			}

			// Extrai metadados da página
			const metadata = await this.textExtractor.extractMetadata(url);

			// Analisa o texto extraído
			const analysisResult = await this.geminiAnalyzer.analyzePolicy(policyText, companyName);

			if (analysisResult.error) {
				return analysisResult;
			}

			// Adiciona informações extras ao resultado
			const enrichedResult = this.enrichResult(analysisResult, { url, metadata });

			console.log(`✅ ${SUCCESS_MESSAGES.ANALYSIS_COMPLETED}`);
			return enrichedResult;

		} catch (error) {
			console.error(`Error in analysis:`, error.message);
			return {
				error: error.message,
				timestamp: new Date().toISOString(),
				url,
				company: companyName
			};
		}
	}

	/**
	 * Analisa uma política de privacidade a partir de texto direto
	 * @param {string} policyText - Texto da política de privacidade
	 * @param {string} companyName - Nome da empresa
	 * @returns {Promise<Object>} - Resultado da análise
	 */
	async analyzeFromText(policyText, companyName = '') {
		try {
			console.log(`Starting direct text analysis`);
			console.log(`Company: ${companyName || 'Not specified'}`);
			console.log(`Text length: ${policyText.length} characters`);

			if (!policyText || policyText.trim().length === 0) {
				throw new Error(ERROR_MESSAGES.EMPTY_POLICY_TEXT);
			}

			// Analisa o texto
			const analysisResult = await this.geminiAnalyzer.analyzePolicy(policyText, companyName);

			if (analysisResult.error) {
				return analysisResult;
			}

			// Adiciona informações extras ao resultado
			const enrichedResult = this.enrichResult(analysisResult, { source: 'text' });

			console.log(`✅ ${SUCCESS_MESSAGES.ANALYSIS_COMPLETED}`);
			return enrichedResult;

		} catch (error) {
			console.error(`❌ Erro na análise:`, error.message);
			return {
				error: error.message,
				timestamp: new Date().toISOString(),
				company: companyName,
				source: 'text'
			};
		}
	}

				/**
	 * Analisa uma política de privacidade a partir de um arquivo PDF
	 * @param {string} filePath - Caminho do arquivo PDF
	 * @param {string} companyName - Nome da empresa
	 * @returns {Promise<Object>} - Resultado da análise
	 */
	async analyzeFromPdf(filePath, companyName = '') {
		try {
			// Valida o arquivo PDF
			const isValidPdf = await this.pdfExtractor.validatePdfFile(filePath);
			if (!isValidPdf) {
				// Limpa o arquivo inválido
				await this.pdfExtractor.cleanupFile(filePath);
				throw new Error('Arquivo PDF inválido ou corrompido');
			}

			// Extrai texto do PDF
			const extractionResult = await this.pdfExtractor.extractTextFromPdf(filePath);

			if (!extractionResult.success) {
				// Limpa o arquivo em caso de falha na extração
				await this.pdfExtractor.cleanupFile(filePath);
				throw new Error(extractionResult.error);
			}

			const { text: policyText, metadata: pdfMetadata } = extractionResult;

			// Verifica se o texto extraído é válido
			if (!policyText || policyText.trim().length === 0) {
				// Limpa o arquivo se não conseguiu extrair texto
				await this.pdfExtractor.cleanupFile(filePath);
				throw new Error('Não foi possível extrair texto do PDF');
			}

			// Analisa o texto extraído
			const analysisResult = await this.geminiAnalyzer.analyzePolicy(policyText, companyName);

			// Limpa o arquivo após a análise (sucesso ou erro)
			await this.pdfExtractor.cleanupFile(filePath);

			if (analysisResult.error) {
				return analysisResult;
			}

			// Adiciona informações extras ao resultado
			const enrichedResult = this.enrichResult(analysisResult, {
				source: 'pdf',
				filePath,
				pdfMetadata
			});

			return enrichedResult;

		} catch (error) {
			// Garante que o arquivo seja limpo mesmo em caso de erro
			try {
				await this.pdfExtractor.cleanupFile(filePath);
			} catch (cleanupError) {
				// Silenciosamente ignora erros de limpeza
			}

			return {
				error: error.message,
				timestamp: new Date().toISOString(),
				company: companyName,
				source: 'pdf',
				filePath
			};
		}
	}

	/**
	 * Analisa uma política de privacidade usando contexto de URL do Gemini
	 * @param {string} url - URL da política de privacidade
	 * @param {string} companyName - Nome da empresa
	 * @returns {Promise<Object>} - Resultado da análise
	 */
	async analyzeWithUrlContext(url, companyName = '') {
		try {
			// Valida a URL
			if (!url || url.trim().length === 0) {
				throw new Error('URL não fornecida');
			}

			// Analisa usando o contexto de URL do Gemini
			const analysisResult = await this.geminiAnalyzer.analyzePolicyWithUrlContext(url, companyName);

			if (analysisResult.error) {
				return analysisResult;
			}

			// Adiciona informações extras ao resultado
			const enrichedResult = this.enrichResult(analysisResult, {
				source: 'url_context',
				url
			});

			return enrichedResult;

		} catch (error) {
			return {
				error: error.message,
				timestamp: new Date().toISOString(),
				company: companyName,
				source: 'url_context',
				url
			};
		}
	}

	/**
	 * Enriquece o resultado da análise com informações adicionais
	 * @param {Object} result - Resultado original da análise
	 * @param {Object} extra - Informações extras para adicionar
	 * @returns {Object} - Resultado enriquecido
	 */
	enrichResult(result, extra = {}) {
		return {
			...result,
			analise_info: {
				timestamp: new Date().toISOString(),
				versao_sistema: '1.0.0',
				fonte: extra.source || 'url',
				url: extra.url || null,
				metadata_pagina: extra.metadata || null,
				configuracoes: {
					max_texto_analisado: config.maxTextLength,
					modelo_ia: 'gemini-1.5-flash'
				}
			}
		};
	}

	/**
	 * Salva o resultado da análise em um arquivo JSON
	 * @param {Object} result - Resultado da análise
	 * @param {string} filename - Nome do arquivo (opcional)
	 * @returns {Promise<string>} - Caminho do arquivo salvo
	 */
	async saveResult(result, filename = null) {
		try {
			// Gera nome do arquivo se não fornecido
			if (!filename) {
				const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
				const company = result.empresa ? result.empresa.replace(/\s+/g, '_').toLowerCase() : 'analise';
				filename = `${company}_${timestamp}.json`;
			}

			// Garante que o diretório de resultados existe
			const resultsDir = path.join(process.cwd(), 'results');
			await this.ensureDirectoryExists(resultsDir);

			const filepath = path.join(resultsDir, filename);

			// Salva o arquivo
			await fs.writeFile(filepath, JSON.stringify(result, null, 2), 'utf-8');

			console.log(`💾 ${SUCCESS_MESSAGES.RESULT_SAVED}: ${filepath}`);
			return filepath;

		} catch (error) {
			console.error('Error saving result:', error.message);
			throw error;
		}
	}

	/**
	 * Carrega um resultado salvo anteriormente
	 * @param {string} filename - Nome do arquivo
	 * @returns {Promise<Object>} - Resultado carregado
	 */
	async loadResult(filename) {
		try {
			const resultsDir = path.join(process.cwd(), 'results');
			const filepath = path.join(resultsDir, filename);

			const data = await fs.readFile(filepath, 'utf-8');
			return JSON.parse(data);

		} catch (error) {
			console.error('Error loading result:', error.message);
			throw error;
		}
	}

	/**
	 * Lista todos os resultados salvos
	 * @returns {Promise<Array>} - Lista de arquivos de resultados
	 */
	async listResults() {
		try {
			const resultsDir = path.join(process.cwd(), 'results');

			// Verifica se o diretório existe
			try {
				await fs.access(resultsDir);
			} catch {
				return [];
			}

			const files = await fs.readdir(resultsDir);
			const jsonFiles = files
				.filter(file => file.endsWith('.json'))
				.map(file => ({
					filename: file,
					path: path.join(resultsDir, file)
				}));

			return jsonFiles;

		} catch (error) {
			console.error('Error listing results:', error.message);
			return [];
		}
	}

	/**
	 * Garante que um diretório existe, criando-o se necessário
	 * @param {string} dirPath - Caminho do diretório
	 */
	async ensureDirectoryExists(dirPath) {
		try {
			await fs.access(dirPath);
		} catch {
			await fs.mkdir(dirPath, { recursive: true });
		}
	}

	/**
	 * Gera um relatório resumido da análise
	 * @param {Object} result - Resultado da análise
	 * @returns {Object} - Relatório resumido
	 */
	generateSummaryReport(result) {
		if (result.error) {
			return {
				status: 'erro',
				empresa: result.company || 'N/A',
				erro: result.error,
				timestamp: result.timestamp
			};
		}

		const principiosConformes = Object.values(result.principios)
			.filter(p => p.status === 'Conforme').length;

		const principiosParciais = Object.values(result.principios)
			.filter(p => p.status === 'Parcialmente Conforme').length;

		const principiosNaoConformes = Object.values(result.principios)
			.filter(p => p.status === 'Não Conforme').length;

		return {
			status: 'sucesso',
			empresa: result.empresa,
			pontuacao_geral: result.pontuacao_geral,
			risco_vazamento: result.risco_vazamento,
			conformidade: {
				conformes: principiosConformes,
				parcialmente_conformes: principiosParciais,
				nao_conformes: principiosNaoConformes,
				total_principios: 10
			},
			principais_problemas: this.extractMainProblems(result),
			timestamp: result.analise_info?.timestamp || new Date().toISOString()
		};
	}

	/**
	 * Extrai os principais problemas da análise
	 * @param {Object} result - Resultado da análise
	 * @returns {Array} - Lista dos principais problemas
	 */
	extractMainProblems(result) {
		const problems = [];

		Object.entries(result.principios).forEach(([principio, dados]) => {
			if (dados.status !== 'Conforme' && dados.brechas_identificadas.length > 0) {
				problems.push({
					principio,
					status: dados.status,
					pontuacao: dados.pontuacao,
					principais_brechas: dados.brechas_identificadas.slice(0, 2) // Top 2 brechas
				});
			}
		});

		// Ordena por pontuação (problemas mais graves primeiro)
		return problems.sort((a, b) => a.pontuacao - b.pontuacao).slice(0, 5);
	}

	/**
	 * Aplica rate limiting entre requisições
	 * @returns {Promise<void>}
	 */
	async applyRateLimit() {
		if (config.rateLimitDelay > 0) {
			console.log(`Waiting ${config.rateLimitDelay}ms for next request...`);
			await new Promise(resolve => setTimeout(resolve, config.rateLimitDelay));
		}
	}
}

module.exports = PrivacyPolicyAnalyzerService;
