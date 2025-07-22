const PrivacyPolicyAnalyzerService = require('../services/privacyPolicyAnalyzer');
const { HTTP_STATUS, ERROR_MESSAGES, SUCCESS_MESSAGES, API_LIMITS } = require('../constants/api');

class AnalysisController {
	constructor() {
		this.analyzerService = new PrivacyPolicyAnalyzerService();
	}

	/**
	 * Analisa uma política de privacidade a partir de uma URL
	 */
	async analyzeFromUrl(req, res) {
		try {
			const { url, company_name } = req.body;

			// Validações
			if (!url) {
				return res.status(HTTP_STATUS.BAD_REQUEST).json({
					success: false,
					error: 'URL is required'
				});
			}

			if (url.length > API_LIMITS.MAX_URL_LENGTH) {
				return res.status(HTTP_STATUS.BAD_REQUEST).json({
					success: false,
					error: `URL too long. Maximum ${API_LIMITS.MAX_URL_LENGTH} characters`
				});
			}

			if (company_name && company_name.length > API_LIMITS.MAX_COMPANY_NAME_LENGTH) {
				return res.status(HTTP_STATUS.BAD_REQUEST).json({
					success: false,
					error: `Company name too long. Maximum ${API_LIMITS.MAX_COMPANY_NAME_LENGTH} characters`
				});
			}

			// Executa a análise
			const result = await this.analyzerService.analyzeFromUrl(url, company_name || '');

			if (result.error) {
				return res.status(HTTP_STATUS.BAD_REQUEST).json({
					success: false,
					error: result.error,
					details: result
				});
			}

			// Salva o resultado
			const savedPath = await this.analyzerService.saveResult(result);

			// Gera resumo
			const summary = this.analyzerService.generateSummaryReport(result);

			res.status(HTTP_STATUS.OK).json({
				success: true,
				message: SUCCESS_MESSAGES.ANALYSIS_COMPLETED,
				data: {
					analysis: result,
					summary,
					saved_to: savedPath
				}
			});

		} catch (error) {
			console.error('Error in controller analyzeFromUrl:', error.message);
			res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
				success: false,
				error: 'Internal server error',
				details: error.message
			});
		}
	}

	/**
	 * Analisa uma política de privacidade a partir de texto direto
	 */
	async analyzeFromText(req, res) {
		try {
			const { text, company_name } = req.body;

			// Validações
			if (!text) {
				return res.status(HTTP_STATUS.BAD_REQUEST).json({
					success: false,
					error: 'Privacy policy text is required'
				});
			}

			if (text.length < API_LIMITS.MIN_TEXT_LENGTH) {
				return res.status(HTTP_STATUS.BAD_REQUEST).json({
					success: false,
					error: `Text too short. Minimum ${API_LIMITS.MIN_TEXT_LENGTH} characters`
				});
			}

			if (company_name && company_name.length > API_LIMITS.MAX_COMPANY_NAME_LENGTH) {
				return res.status(HTTP_STATUS.BAD_REQUEST).json({
					success: false,
					error: `Company name too long. Maximum ${API_LIMITS.MAX_COMPANY_NAME_LENGTH} characters`
				});
			}

			// Executa a análise
			const result = await this.analyzerService.analyzeFromText(text, company_name || '');

			if (result.error) {
				return res.status(HTTP_STATUS.BAD_REQUEST).json({
					success: false,
					error: result.error,
					details: result
				});
			}

			// Salva o resultado
			const savedPath = await this.analyzerService.saveResult(result);

			// Gera resumo
			const summary = this.analyzerService.generateSummaryReport(result);

			res.status(HTTP_STATUS.OK).json({
				success: true,
				message: SUCCESS_MESSAGES.ANALYSIS_COMPLETED,
				data: {
					analysis: result,
					summary,
					saved_to: savedPath
				}
			});

		} catch (error) {
			console.error('Error in controller analyzeFromText:', error.message);
			res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
				success: false,
				error: 'Internal server error',
				details: error.message
			});
		}
	}

	/**
	 * Lista todas as análises salvas
	 */
	async listAnalyses(req, res) {
		try {
			const results = await this.analyzerService.listResults();

			// Se solicitado, carrega os resumos
			const includeDetails = req.query.include_details === 'true';

			if (includeDetails && results.length > 0) {
				const detailedResults = await Promise.all(
					results.map(async (file) => {
						try {
							const data = await this.analyzerService.loadResult(file.filename);
							const summary = this.analyzerService.generateSummaryReport(data);
							return {
								...file,
								summary
							};
						} catch (error) {
							console.warn(`⚠️ Erro ao carregar ${file.filename}:`, error.message);
							return {
								...file,
								error: 'Error loading file'
							};
						}
					})
				);

				return res.status(HTTP_STATUS.OK).json({
					success: true,
					count: results.length,
					data: detailedResults
				});
			}

			res.status(HTTP_STATUS.OK).json({
				success: true,
				count: results.length,
				data: results
			});

		} catch (error) {
			console.error('❌ Erro no controller listAnalyses:', error.message);
			res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
				success: false,
				error: 'Erro interno do servidor',
				details: error.message
			});
		}
	}

	/**
	 * Carrega uma análise específica
	 */
	async getAnalysis(req, res) {
		try {
			const { filename } = req.params;

			if (!filename) {
				return res.status(HTTP_STATUS.BAD_REQUEST).json({
					success: false,
					error: 'Nome do arquivo é obrigatório'
				});
			}

			// Garante que tem extensão .json
			const jsonFilename = filename.endsWith('.json') ? filename : `${filename}.json`;

			const result = await this.analyzerService.loadResult(jsonFilename);
			const summary = this.analyzerService.generateSummaryReport(result);

			res.status(HTTP_STATUS.OK).json({
				success: true,
				data: {
					analysis: result,
					summary
				}
			});

		} catch (error) {
			console.error('❌ Erro no controller getAnalysis:', error.message);

			if (error.message.includes('no such file')) {
				return res.status(HTTP_STATUS.NOT_FOUND).json({
					success: false,
					error: 'Análise não encontrada'
				});
			}

			res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
				success: false,
				error: 'Erro interno do servidor',
				details: error.message
			});
		}
	}

	/**
	 * Extrai apenas o texto de uma URL (sem análise)
	 */
	async extractText(req, res) {
		try {
			const { url } = req.body;

			if (!url) {
				return res.status(HTTP_STATUS.BAD_REQUEST).json({
					success: false,
					error: 'URL é obrigatória'
				});
			}

			const text = await this.analyzerService.textExtractor.extractText(url);
			const metadata = await this.analyzerService.textExtractor.extractMetadata(url);

			if (!text) {
				return res.status(HTTP_STATUS.BAD_REQUEST).json({
					success: false,
					error: ERROR_MESSAGES.EXTRACTION_FAILED
				});
			}

			res.status(HTTP_STATUS.OK).json({
				success: true,
				message: SUCCESS_MESSAGES.TEXT_EXTRACTED,
				data: {
					text,
					metadata,
					char_count: text.length,
					url
				}
			});

		} catch (error) {
			console.error('❌ Erro no controller extractText:', error.message);
			res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
				success: false,
				error: ERROR_MESSAGES.EXTRACTION_FAILED,
				details: error.message
			});
		}
	}

	/**
	 * Endpoint de healthcheck específico para análises
	 */
	async healthCheck(req, res) {
		try {
			// Testa os serviços
			const textExtractorOk = this.analyzerService.textExtractor !== null;
			const geminiAnalyzerOk = this.analyzerService.geminiAnalyzer !== null;

			const status = textExtractorOk && geminiAnalyzerOk ? 'healthy' : 'degraded';

			res.status(HTTP_STATUS.OK).json({
				success: true,
				status,
				services: {
					text_extractor: textExtractorOk,
					gemini_analyzer: geminiAnalyzerOk
				},
				timestamp: new Date().toISOString()
			});

		} catch (error) {
			console.error('❌ Erro no healthcheck:', error.message);
			res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
				success: false,
				status: 'unhealthy',
				error: error.message,
				timestamp: new Date().toISOString()
			});
		}
	}
}

module.exports = AnalysisController;
