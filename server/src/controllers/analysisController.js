const PrivacyPolicyAnalyzerService = require('../services/privacyPolicyAnalyzer');

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
			const result = await this.analyzerService.analyzeFromUrl(url, company_name);

			res.status(result.status || 200).json(result);
		} catch (error) {
			console.error('Error in controller analyzeFromUrl:', error.message);
			res.status(500).json({
				success: false,
				error: 'Internal server error'
			});
		}
	}

	/**
	 * Analisa uma política de privacidade a partir de texto direto
	 */
	async analyzeFromText(req, res) {
		try {
			const { text, company_name } = req.body;
			const result = await this.analyzerService.analyzeFromText(text, company_name);

			res.status(result.status || 200).json(result);
		} catch (error) {
			console.error('Error in controller analyzeFromText:', error.message);
			res.status(500).json({
				success: false,
				error: 'Internal server error'
			});
		}
	}

	/**
	 * Lista todas as análises salvas
	 */
	async listAnalyses(req, res) {
		try {
			const { include_details } = req.query;
			const result = await this.analyzerService.listResults(include_details);

			res.status(result.status || 200).json(result);
		} catch (error) {
			console.error('Error in controller listAnalyses:', error.message);
			res.status(500).json({
				success: false,
				error: 'Internal server error'
			});
		}
	}

	/**
	 * Carrega uma análise específica
	 */
	async getAnalysis(req, res) {
		try {
			const { filename } = req.params;
			const result = await this.analyzerService.loadResult(filename);

			res.status(result.status || 200).json(result);
		} catch (error) {
			console.error('Error in controller getAnalysis:', error.message);
			res.status(500).json({
				success: false,
				error: 'Internal server error'
			});
		}
	}

	/**
	 * Extrai apenas o texto de uma URL (sem análise)
	 */
	async extractText(req, res) {
		try {
			const { url } = req.body;
			const result = await this.analyzerService.extractText(url);

			res.status(result.status || 200).json(result);
		} catch (error) {
			console.error('Error in controller extractText:', error.message);
			res.status(500).json({
				success: false,
				error: 'Internal server error'
			});
		}
	}

	/**
	 * Endpoint de healthcheck específico para análises
	 */
	async healthCheck(req, res) {
		try {
			const result = await this.analyzerService.healthCheck();
			res.status(result.status || 200).json(result);
		} catch (error) {
			console.error('Error in controller healthCheck:', error.message);
			res.status(500).json({
				success: false,
				error: 'Internal server error'
			});
		}
	}
}

module.exports = AnalysisController;
