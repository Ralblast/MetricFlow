import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export const generateDailyReport = async (reportData) => {
  return new Promise((resolve, reject) => {
    try {
      const reportsDir = path.join(process.cwd(), 'reports');
      
      if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir, { recursive: true });
      }

      const fileName = `report-${reportData.orgName}-${Date.now()}.pdf`;
      const filePath = path.join(reportsDir, fileName);

      const doc = new PDFDocument();
      const stream = fs.createWriteStream(filePath);

      doc.pipe(stream);

      doc.fontSize(24).text('Sentinel Daily Report', { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).text(`Organization: ${reportData.orgName}`);
      doc.text(`Date: ${reportData.date}`);
      doc.moveDown();

      doc.fontSize(16).text('Performance Summary');
      doc.moveDown();
      doc.fontSize(12).text(`Average CPU Usage: ${reportData.avgCPU.toFixed(2)}%`);
      doc.text(`Average Memory Usage: ${reportData.avgMemory.toFixed(2)}%`);
      doc.text(`Average API Latency: ${reportData.avgLatency.toFixed(2)}ms`);
      doc.moveDown();

      doc.fontSize(16).text('Alert Summary');
      doc.moveDown();
      doc.fontSize(12).text(`Total Alerts: ${reportData.totalAlerts}`);
      doc.text(`Critical Alerts: ${reportData.criticalAlerts}`);
      doc.text(`Warning Alerts: ${reportData.warningAlerts}`);

      doc.end();

      stream.on('finish', () => {
        console.log(`PDF report generated: ${fileName}`);
        resolve(filePath);
      });

      stream.on('error', (error) => {
        reject(error);
      });
    } catch (error) {
      reject(error);
    }
  });
};
