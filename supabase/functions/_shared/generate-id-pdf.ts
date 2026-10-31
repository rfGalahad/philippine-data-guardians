import { PDFDocument, rgb, StandardFonts } from 'npm:pdf-lib@1.17.1';
import QRCode from 'npm:qrcode@1.5.4';

interface IdData {
  memberId: string;
  fullName: string;
  plan: string | null;
  fullAddress: string;
  photoBytes?: Uint8Array | null; // PNG or JPG only (pdf-lib doesn't support WebP)
  logoBytes: Uint8Array;          // PNG
}

// CR80 card, landscape. 1 pt = 1/72 in.
const W = 243;
const H = 153;

export async function generateIdPdf(d: IdData): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([W, H]);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const regular = await pdf.embedFont(StandardFonts.Helvetica);

  // Background (pdf-lib has no gradients; solid or stacked strips)
  page.drawRectangle({ x: 0, y: 0, width: W, height: H, color: rgb(0.02, 0.2, 0.38) });

  // Watermark logo
  const logo = await pdf.embedPng(d.logoBytes);
  page.drawImage(logo, { x: W - 110, y: -30, width: 120, height: 120, opacity: 0.1 });

  // Header
  page.drawImage(logo, { x: 10, y: H - 26, width: 16, height: 16 });
  page.drawText('PHILIPPINE DATA', { x: 30, y: H - 20, size: 7, font: bold, color: rgb(1, 1, 1) });
  page.drawText('GUARDIANS', { x: 91, y: H - 20, size: 7, font: bold, color: rgb(1, 0.8, 0) });

  page.drawRectangle({ x: W - 70, y: H - 26, width: 70, height: 16, color: rgb(0.83, 0.69, 0.22) });
  page.drawText('MEMBERSHIP ID', { x: W - 64, y: H - 21, size: 6.5, font: bold, color: rgb(0.1, 0.1, 0.1) });

  // Photo
  const photoSize = 80;
  const photoY = H - 36 - photoSize;
  if (d.photoBytes) {
    const isPng = d.photoBytes[0] === 0x89;
    const img = isPng ? await pdf.embedPng(d.photoBytes) : await pdf.embedJpg(d.photoBytes);
    page.drawImage(img, { x: 10, y: photoY, width: photoSize, height: photoSize });
  }
  page.drawRectangle({
    x: 10, y: photoY, width: photoSize, height: photoSize,
    borderColor: rgb(1, 1, 1), borderWidth: 1,
  });

  // Details
  const tx = 100;
  page.drawText(d.plan ?? '', { x: tx, y: H - 44, size: 7, font: bold, color: rgb(1, 0.8, 0) });
  page.drawText(d.fullName, { x: tx, y: H - 56, size: 9, font: bold, color: rgb(1, 1, 1), maxWidth: W - tx - 10 });
  page.drawText(d.fullAddress, {
    x: tx, y: H - 67, size: 6, font: regular, color: rgb(1, 1, 1),
    maxWidth: W - tx - 10, lineHeight: 8,
  });

  // QR code drawn as vector squares (crisp, no PNG needed)
  const qr = QRCode.create(d.memberId, { errorCorrectionLevel: 'M' });
  const n = qr.modules.size;
  const qrSize = 44;
  const cell = qrSize / n;
  const qx = tx;
  const qy = 12;
  page.drawRectangle({ x: qx - 3, y: qy - 3, width: qrSize + 6, height: qrSize + 6, color: rgb(1, 1, 1) });
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (qr.modules.get(r, c)) {
        page.drawRectangle({
          x: qx + c * cell,
          y: qy + (n - 1 - r) * cell,
          width: cell, height: cell,
          color: rgb(0, 0, 0),
        });
      }
    }
  }

  return await pdf.save();
}