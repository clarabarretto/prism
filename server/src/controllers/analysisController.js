const PrivacyPolicyAnalyzerService = require('../services/privacyPolicyAnalyzer');
const PdfGenerator = require('../services/pdfGenerator');

class AnalysisController {
	constructor() {
		this.analyzerService = new PrivacyPolicyAnalyzerService();
		this.pdfGenerator = new PdfGenerator();
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
	 * Analisa uma política de privacidade a partir de um arquivo PDF
	 */
	async analyzeFromPdf(req, res) {
		try {
			// Verifica se o arquivo foi enviado
			if (!req.file) {
				return res.status(400).json({
					success: false,
					error: 'Nenhum arquivo PDF foi enviado'
				});
			}

			const { company_name } = req.body;
			const filePath = req.file.path;

			// Analisa o PDF (o serviço cuida da limpeza do arquivo)
			const result = await this.analyzerService.analyzeFromPdf(filePath, company_name);

			res.status(result.status || 200).json(result);
		} catch (error) {
			res.status(500).json({
				success: false,
				error: 'Internal server error'
			});
		}
	}

	/**
	 * Analisa uma política de privacidade usando contexto de URL do Gemini
	 */
	async analyzeWithUrlContext(req, res) {
		try {
			const { url, company_name } = req.body;

			// Verifica se a URL foi fornecida
			if (!url) {
				return res.status(400).json({
					success: false,
					error: 'URL não fornecida'
				});
			}

			// Analisa usando contexto de URL
			const result = await this.analyzerService.analyzeWithUrlContext(url, company_name);

			res.status(result.status || 200).json(result);
		} catch (error) {
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

	/**
	 * Gera e baixa um PDF da análise
	 */
	async downloadPdf(req, res) {
		try {
			let { filename } = req.params;

			// Remove a extensão .pdf se presente e adiciona .json para encontrar o arquivo de resultado
			if (filename.endsWith('.pdf')) {
				filename = filename.slice(0, -4); // Remove '.pdf'
			}
			const jsonFilename = `${filename}.json`;

			const analysisResult = await this.analyzerService.loadResult(jsonFilename);

			if (!analysisResult) {
				return res.status(404).json({ success: false, error: 'Análise não encontrada' });
			}

			const pdfBuffer = await this.pdfGenerator.generate(analysisResult);

			res.setHeader('Content-Type', 'application/pdf');
			res.setHeader('Content-Disposition', `attachment; filename="${filename}.pdf"`);
			res.send(pdfBuffer);
		} catch (error) {
			console.error('Error in controller downloadPdf:', error.message);
			res.status(500).json({
				success: false,
				error: 'Internal server error'
			});
		}
	}
}

module.exports = AnalysisController;
