// utils/pdfGenerator.js
const PDFDocument = require('pdfkit');
const fs = require('fs');
const QRCode = require('qrcode');

async function generarFacturaPDF(invoice, pathFile) {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const stream = fs.createWriteStream(pathFile);
      doc.pipe(stream);

      // Cabecera
      doc.fontSize(20).text('Factura', { align: 'left' });
      doc.moveDown();
      doc.fontSize(12).text(`Número: ${invoice.numero}`);
      doc.text(`Fecha emisión: ${invoice.fecha_emision}`);
      doc.text(`Vence: ${invoice.fecha_vencimiento}`);
      doc.moveDown();
      doc.text(`Residente: ${invoice.residente_nombre}`);
      doc.moveDown();

      // Detalles
      doc.fontSize(14).text('Detalle:');
      doc.fontSize(12).text(invoice.descripcion || 'Servicio de administración');
      doc.moveDown();

      // Monto
      doc.fontSize(16).text(`Total: $ ${Number(invoice.monto).toFixed(2)}`, { align: 'right' });
      doc.moveDown();

      // Generar QR y pegar en el PDF
      const qrData = invoice.qr_text || `payment:${invoice.id}|amount:${invoice.monto}`;
      const qrDataURL = await QRCode.toDataURL(qrData);

      const base64Data = qrDataURL.replace(/^data:image\/png;base64,/, "");
      const tmpPath = `/tmp/qr-${invoice.id}.png`;
      fs.writeFileSync(tmpPath, base64Data, 'base64');

      doc.image(tmpPath, { fit: [100, 100], align: 'left' });
      doc.moveDown();

      doc.text('Gracias por su pago', { align: 'center' });

      doc.end();

      stream.on('finish', () => {
        // limpiar temporal
        try { fs.unlinkSync(tmpPath); } catch(e){}
        resolve(pathFile);
      });
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = { generarFacturaPDF };
