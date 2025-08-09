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

        // Add content to the PDF
        doc.fontSize(25).text('Relatório de Análise de Política de Privacidade', { align: 'center' });
        doc.moveDown();

        doc.fontSize(18).text('Resumo Executivo');
        doc.moveDown();

        if (analysisData.resumo_executivo) {
            doc.fontSize(12).text('Principais Problemas Identificados:');
            analysisData.resumo_executivo.principais_problemas_identificados.forEach(item => {
                doc.text(`- ${item.descricao}`);
            });
            doc.moveDown();

            doc.fontSize(12).text('Pontos Positivos:');
            analysisData.resumo_executivo.pontos_positivos.forEach(item => {
                doc.text(`- ${item.descricao}`);
            });
            doc.moveDown();
        }


        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
}

module.exports = PdfGenerator;
