const PDFDocument = require('pdfkit');

class PdfGenerator {
  generate(analysisData) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 });
        const buffers = [];

        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
          const pdfData = Buffer.concat(buffers);
          resolve(pdfData);
        });

        // Título principal
        doc.fontSize(24).text('Relatório de Conformidade LGPD', { align: 'center' });
        doc.moveDown();

        // Informações da empresa
        if (analysisData.empresa) {
          doc.fontSize(16).text(`Empresa: ${analysisData.empresa}`, { underline: true });
          doc.moveDown();
        }

        // Pontuação geral
        doc.fontSize(14).text(`Pontuação Geral de Conformidade: ${analysisData.pontuacao_geral || 'N/A'}/10`);
        doc.moveDown();

        // Resumo executivo
        if (analysisData.resumo_executivo) {
          doc.fontSize(16).text('Resumo Executivo', { underline: true });
          doc.fontSize(12).text(analysisData.resumo_executivo);
          doc.moveDown();
        }

        // Análise dos princípios LGPD
        if (analysisData.principios) {
          doc.fontSize(16).text('Análise dos Princípios da LGPD', { underline: true });
          doc.moveDown();

          Object.entries(analysisData.principios).forEach(([principio, analise]) => {
            doc.fontSize(14).text(`${principio}`, { underline: true });
            doc.fontSize(12).text(`Pontuação: ${analise.pontuacao || 'N/A'}/10`);
            doc.text(`Status: ${analise.status || 'N/A'}`);

            if (analise.observacoes) {
              doc.text(`Observações: ${analise.observacoes}`);
            }

            if (analise.brechas_identificadas && analise.brechas_identificadas.length > 0) {
              doc.text('Brechas Identificadas:');
              analise.brechas_identificadas.forEach(brecha => {
                doc.text(`  • ${brecha}`);
              });
            }

            if (analise.artigos_lgpd_relevantes && analise.artigos_lgpd_relevantes.length > 0) {
              doc.text(`Artigos LGPD Relevantes: ${analise.artigos_lgpd_relevantes.join(', ')}`);
            }

            doc.moveDown();
          });
        }

        // Bases legais analisadas
        if (analysisData.bases_legais_analisadas) {
          doc.fontSize(16).text('Bases Legais Analisadas', { underline: true });
          doc.moveDown();

          Object.entries(analysisData.bases_legais_analisadas).forEach(([base, analise]) => {
            doc.fontSize(12).text(`${base}: ${analise}`);
          });
          doc.moveDown();
        }

        // Direitos dos titulares
        if (analysisData.direitos_titulares_lgpd) {
          doc.fontSize(16).text('Direitos dos Titulares (LGPD)', { underline: true });
          doc.moveDown();

          Object.entries(analysisData.direitos_titulares_lgpd).forEach(([direito, verificacao]) => {
            doc.fontSize(12).text(`${direito}: ${verificacao}`);
          });
          doc.moveDown();
        }

        // Recomendações
        if (analysisData.recomendacoes && analysisData.recomendacoes.length > 0) {
          doc.fontSize(16).text('Recomendações', { underline: true });
          doc.moveDown();

          analysisData.recomendacoes.forEach((recomendacao, index) => {
            doc.fontSize(12).text(`${index + 1}. ${recomendacao}`);
          });
          doc.moveDown();
        }

        // Riscos e sanções
        if (analysisData.risco_vazamento_e_nao_conformidade) {
          doc.fontSize(16).text('Avaliação de Riscos', { underline: true });
          doc.fontSize(12).text(`Risco de Vazamento e Não Conformidade: ${analysisData.risco_vazamento_e_nao_conformidade}`);
          doc.moveDown();
        }

        if (analysisData.potenciais_sancoes_anpd) {
          doc.fontSize(14).text('Potenciais Sanções da ANPD', { underline: true });
          doc.fontSize(12).text(analysisData.potenciais_sancoes_anpd);
          doc.moveDown();
        }

        // Metadata
        if (analysisData.metadata) {
          doc.fontSize(16).text('Informações da Análise', { underline: true });
          doc.fontSize(10).text(`Data da Análise: ${analysisData.metadata.data_analise || 'N/A'}`);
          doc.text(`Versão da Lei: ${analysisData.metadata.versao_lei || 'LGPD Lei 13.709/2018'}`);
          if (analysisData.metadata.caracteres_analisados) {
            doc.text(`Caracteres Analisados: ${analysisData.metadata.caracteres_analisados}`);
          }
          doc.text(`Especialidade: ${analysisData.metadata.especialidade || 'Análise LGPD'}`);
        }

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
}

module.exports = PdfGenerator;
