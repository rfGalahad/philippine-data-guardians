import {
  PDFDocument, PDFFont, PDFImage, PDFPage, StandardFonts, rgb,
  pushGraphicsState, popGraphicsState, rectangle, clip, endPath,
} from 'npm:pdf-lib@1.17.1';
import QRCode from 'npm:qrcode@1.5.4';

// --------------------------------------------------------------------------------------------//
// TYPES
// --------------------------------------------------------------------------------------------//

interface IdData {
  memberId: string;
  fullName: string;
  plan: string | null;
  fullAddress: string;
  qrValue: string;
  templateBytes: Uint8Array;       // PNG background
  photoBytes?: Uint8Array | null;  // PNG or JPG
}

// --------------------------------------------------------------------------------------------//
// CONSTANTS
// --------------------------------------------------------------------------------------------//

const W = 243;
const H = 153;
const LAYOUT = {
  photo:   { x: 10,  top: 44, w: 88, h: 92 },            // near square, bottom edge at 136pt
  text:    { x: 108, maxW: 125 },                         // 10pt right margin
  plan:    { top: 52, size: 8 },
  name:    { top: 65, maxSize: 11, minSize: 7 },
  address: { top: 75, size: 6.5, lineHeight: 7.5, maxLines: 2 },
  qr:      { x: 108, bottom: 17, size: 34, padding: 2 },  // bottom aligned with the photo
  idText:  { x: 154, labelY: 40, valueY: 29 },            // vertically centered on the QR
};

const WHITE = rgb(1, 1, 1);
const GOLD = rgb(1, 0.8, 0);

// --------------------------------------------------------------------------------------------//
// SUB-FUNCTIONS
// --------------------------------------------------------------------------------------------//

const formatPlan = (p: string) =>
  p.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

async function drawPhoto(
  pdf: PDFDocument, page: PDFPage, bytes: Uint8Array | null | undefined,
  fullName: string, bold: PDFFont,
) {
  const { x, top, w, h } = LAYOUT.photo;
  const y = H - top - h;

  let img: PDFImage | null = null;
  if (bytes) {
    try {
      img = bytes[0] === 0x89 ? await pdf.embedPng(bytes) : await pdf.embedJpg(bytes);
    } catch (e) {
      console.error('[id-pdf] photo_embed_failed', e); // e.g. WebP, fall back to placeholder
    }
  }

  if (img) {
    // "Cover" fit: scale to fill the box, center, and clip the overflow
    const scale = Math.max(w / img.width, h / img.height);
    const dw = img.width * scale;
    const dh = img.height * scale;

    page.pushOperators(pushGraphicsState(), rectangle(x, y, w, h), clip(), endPath());
    page.drawImage(img, { x: x + (w - dw) / 2, y: y + h - dh, width: dw, height: dh });
    page.pushOperators(popGraphicsState());
  } else {
    page.drawRectangle({ x, y, width: w, height: h, color: WHITE, opacity: 0.12 });
    const initials = fullName.split(/\s+/).filter(Boolean).slice(0, 2)
      .map((p) => p[0].toUpperCase()).join('');
    const tw = bold.widthOfTextAtSize(initials, 20);
    page.drawText(initials, { x: x + (w - tw) / 2, y: y + h / 2 - 7, size: 20, font: bold, color: WHITE });
  }

  page.drawRectangle({ x, y, width: w, height: h, borderColor: WHITE, borderWidth: 1 });
}

function drawDetails(page: PDFPage, d: IdData, bold: PDFFont, regular: PDFFont) {
  const { x, maxW } = LAYOUT.text;

  if (d.plan) {
    page.drawText(formatPlan(d.plan), {
      x, y: H - LAYOUT.plan.top, size: LAYOUT.plan.size, font: bold, color: GOLD,
    });
  }

  // Shrink the name to fit on one line
  let nameSize = LAYOUT.name.maxSize;
  while (nameSize > LAYOUT.name.minSize && bold.widthOfTextAtSize(d.fullName, nameSize) > maxW) {
    nameSize -= 0.5;
  }
  page.drawText(d.fullName, { x, y: H - LAYOUT.name.top, size: nameSize, font: bold, color: WHITE });

  // Wrapped address
  const lines = wrapText(d.fullAddress, regular, LAYOUT.address.size, maxW, LAYOUT.address.maxLines);
  lines.forEach((line, i) => {
    page.drawText(line, {
      x,
      y: H - LAYOUT.address.top - i * LAYOUT.address.lineHeight,
      size: LAYOUT.address.size,
      font: regular,
      color: WHITE,
    });
  });

  // Human-readable ID, for when the QR can't be scanned
  page.drawText('MEMBER ID', {
    x: LAYOUT.idText.x, y: LAYOUT.idText.labelY, size: 5.5, font: regular, color: WHITE, opacity: 0.75,
  });
  page.drawText(d.memberId, {
    x: LAYOUT.idText.x, y: LAYOUT.idText.valueY, size: 9, font: bold, color: GOLD,
  });
}

function drawQr(page: PDFPage, value: string) {
  const { x, bottom, size, padding } = LAYOUT.qr;
  const qr = QRCode.create(value, { errorCorrectionLevel: 'M' });
  const n = qr.modules.size;
  const cell = size / n;
  const x0 = x + padding;
  const y0 = bottom + padding;

  page.drawRectangle({
    x, y: bottom,
    width: size + padding * 2, height: size + padding * 2, color: WHITE,
  });

  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (qr.modules.get(r, c)) {
        page.drawRectangle({
          x: x0 + c * cell, y: y0 + (n - 1 - r) * cell,
          width: cell, height: cell, color: rgb(0, 0, 0),
        });
      }
    }
  }
}

function wrapText(text: string, font: PDFFont, size: number, maxW: number, maxLines: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = '';

  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(test, size) <= maxW) {
      line = test;
    } else {
      if (line) lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);

  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines);
    kept[maxLines - 1] = kept[maxLines - 1].replace(/\s*\S*$/, '…');
    return kept;
  }
  return lines;
}

// --------------------------------------------------------------------------------------------//
// FUNCTION
// --------------------------------------------------------------------------------------------//

export async function generateIdPdf(d: IdData): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([W, H]);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const regular = await pdf.embedFont(StandardFonts.Helvetica);

  // Background
  const bg = await pdf.embedPng(d.templateBytes);
  page.drawImage(bg, { x: 0, y: 0, width: W, height: H });

  await drawPhoto(pdf, page, d.photoBytes, d.fullName, bold);
  drawDetails(page, d, bold, regular);
  drawQr(page, d.qrValue);

  return await pdf.save();
}


