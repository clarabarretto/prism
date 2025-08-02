const fs = require('fs').promises;
const pdfParse = require('pdf-parse');
const path = require('path');

class PdfExtractorService {
	constructor() {
		this.supportedMimeTypes = ['application/pdf'];
	}

		/**
	 * Extrai texto de um arquivo PDF
	 * @param {string} filePath - Caminho do arquivo PDF
	 * @returns {Promise<Object>} - Texto extraído e metadados
	 */
	async extractTextFromPdf(filePath) {
		try {
			// Verifica se o arquivo existe
			await fs.access(filePath);

			// Lê o arquivo PDF
			const dataBuffer = await fs.readFile(filePath);

			// Extrai texto e metadados do PDF
			const pdfData = await pdfParse(dataBuffer);

			// Limpa o texto extraído
			const cleanText = this.cleanExtractedText(pdfData.text);

			return {
				success: true,
				text: cleanText,
				metadata: {
					pages: pdfData.numpages,
					info: pdfData.info,
					version: pdfData.version,
					textLength: cleanText.length
				}
			};

		} catch (error) {
			return {
				success: false,
				error: `Falha na extração do PDF: ${error.message}`,
				filePath
			};
		}
	}

	/**
	 * Limpa o texto extraído do PDF
	 * @param {string} text - Texto bruto extraído
	 * @returns {string} - Texto limpo
	 */
	cleanExtractedText(text) {
		if (!text) return '';

		return text
			// Remove quebras de linha excessivas
			.replace(/\n\s*\n\s*\n/g, '\n\n')
			// Remove espaços em branco no início e fim
			.trim()
			// Normaliza espaços
			.replace(/\s+/g, ' ');
	}

	/**
	 * Valida se o arquivo é um PDF válido
	 * @param {string} filePath - Caminho do arquivo
	 * @returns {Promise<boolean>} - True se válido
	 */
	async validatePdfFile(filePath) {
		try {
			// Verifica se o arquivo existe
			await fs.access(filePath);

			// Verifica extensão
			const ext = path.extname(filePath).toLowerCase();
			if (ext !== '.pdf') {
				return false;
			}

			// Tenta ler o arquivo para verificar se é um PDF válido
			const dataBuffer = await fs.readFile(filePath);
			const pdfData = await pdfParse(dataBuffer);

			// Verifica se tem conteúdo
			return pdfData && pdfData.text && pdfData.text.trim().length > 0;

		} catch (error) {
			return false;
		}
	}

	/**
	 * Remove arquivo temporário
	 * @param {string} filePath - Caminho do arquivo
	 */
	async cleanupFile(filePath) {
		try {
			await fs.unlink(filePath);
		} catch (error) {
			// Silenciosamente ignora erros de limpeza
		}
	}

	/**
	 * Obtém informações básicas do arquivo PDF
	 * @param {string} filePath - Caminho do arquivo
	 * @returns {Promise<Object>} - Informações do arquivo
	 */
	async getFileInfo(filePath) {
		try {
			const stats = await fs.stat(filePath);
			const ext = path.extname(filePath);
			const filename = path.basename(filePath);

			return {
				filename,
				extension: ext,
				size: stats.size,
				created: stats.birthtime,
				modified: stats.mtime
			};
		} catch (error) {
			return null;
		}
	}
}

module.exports = PdfExtractorService;
