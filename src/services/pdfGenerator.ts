import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { Techpack } from '../types/techpack';

const BLACK: [number, number, number] = [0, 0, 0];
const WHITE: [number, number, number] = [255, 255, 255];

function drawRect(doc: jsPDF, x: number, y: number, w: number, h: number, rgb: [number, number, number], filled = true) {
  doc.setFillColor(...rgb);
  doc.setDrawColor(...rgb);
  if (filled) doc.rect(x, y, w, h, 'F');
  else doc.rect(x, y, w, h, 'D');
}

function drawLine(doc: jsPDF, x1: number, y1: number, x2: number, y2: number) {
  doc.setDrawColor(...BLACK);
  doc.setLineWidth(0.4);
  doc.line(x1, y1, x2, y2);
}

function drawText(doc: jsPDF, text: string, x: number, y: number, size: number, bold: boolean, align: 'left' | 'center' | 'right' = 'left', color = BLACK) {
  doc.setFont('helvetica', bold ? 'bold' : 'normal');
  doc.setFontSize(size);
  doc.setTextColor(...color);
  doc.text(text, x, y, { align });
}

export async function generateTechpackPDF(
  techpack: Techpack,
  canvasEl: HTMLElement | null,
  designerBrand?: string
): Promise<void> {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const PW = 297;
  const PH = 210;
  
  const info         = techpack.specs.productInfo;
  const materials    = techpack.specs.materials;
  const construction = techpack.specs.constructionDetails;

  const M = 10; // Outer margin
  const HEADER_H = 35; // Total height of the grid header

  // Outer boundary border
  doc.setDrawColor(...BLACK);
  doc.setLineWidth(0.6);
  doc.rect(M, M, PW - 2 * M, PH - 2 * M, 'D');

  // Bottom boundary of header
  drawLine(doc, M, M + HEADER_H, PW - M, M + HEADER_H);

  // Column widths
  const COL_1 = 45; // Brand Name
  const COL_2 = 45; // Style / Season
  const COL_3 = 50; // Body fabric / Wash
  const COL_4 = 45; // Trims
  const COL_5 = 45; // Stitches
  const COL_6 = PW - 2 * M - (COL_1 + COL_2 + COL_3 + COL_4 + COL_5); // Fastening / etc

  let cx = M;
  
  // ── COL 1: Brand Box ──
  drawRect(doc, cx, M, COL_1, HEADER_H, BLACK);
  const brandName = designerBrand || info.designerName || 'TECHPAC\nDESIGN';
  const brandLines = doc.splitTextToSize(brandName.toUpperCase(), COL_1 - 4);
  let by = M + (HEADER_H / 2) - ((brandLines.length - 1) * 3);
  brandLines.forEach((line: string) => {
    drawText(doc, line, cx + COL_1 / 2, by, 14, true, 'center', WHITE);
    by += 6;
  });
  cx += COL_1;
  drawLine(doc, cx, M, cx, M + HEADER_H);

  // ── COL 2: Style & Fit ──
  let ty = M + 4;
  drawText(doc, 'STYLE:', cx + 2, ty, 6, false);
  drawText(doc, (info.styleName || '').toUpperCase(), cx + 12, ty, 7, true);
  ty += 4;
  drawText(doc, 'SEASON:', cx + 2, ty, 6, false);
  drawText(doc, (info.season || '').toUpperCase(), cx + 15, ty, 7, true);
  ty += 4;
  drawText(doc, 'DESIGNER:', cx + 2, ty, 6, false);
  drawText(doc, (info.designerName || '').toUpperCase(), cx + 18, ty, 7, true);
  ty += 4;
  drawText(doc, 'CLIENT:', cx + 2, ty, 6, false);
  drawText(doc, (info.targetMarket || '').toUpperCase(), cx + 14, ty, 7, true);
  
  // Horizontal split in COL 2
  drawLine(doc, cx, M + 18, cx + COL_2, M + 18);
  ty = M + 22;
  drawText(doc, 'FIT BLOCK:', cx + 2, ty, 6, false);
  drawText(doc, (info.fitBlock || '').toUpperCase(), cx + 2, ty + 5, 7, true);

  cx += COL_2;
  drawLine(doc, cx, M, cx, M + HEADER_H);

  // ── COL 3: Fabrics & Wash ──
  ty = M + 4;
  drawText(doc, 'BODY FABRIC:', cx + 2, ty, 6, false);
  const mainFab = materials[0];
  if (mainFab) {
    const fabDesc = [mainFab.weight, mainFab.composition, mainFab.name].filter(Boolean).join(' ');
    const lines = doc.splitTextToSize(fabDesc.toUpperCase(), COL_3 - 4);
    drawText(doc, lines, cx + 2, ty + 4, 7, true);
  }
  drawLine(doc, cx, M + 18, cx + COL_3, M + 18);
  ty = M + 22;
  drawText(doc, 'WASH:', cx + 2, ty, 6, false);
  drawText(doc, (construction.washTreatment || '').toUpperCase(), cx + 2, ty + 5, 7, true);

  cx += COL_3;
  drawLine(doc, cx, M, cx, M + HEADER_H);

  // ── COL 4: Trims ──
  ty = M + 4;
  const trims = materials.slice(1, 4);
  trims.forEach((t, i) => {
    drawText(doc, `TRIM ${i + 1}:`, cx + 2, ty, 6, false);
    const tDesc = [t.name, t.composition].filter(Boolean).join(' ');
    drawText(doc, tDesc.toUpperCase(), cx + 14, ty, 6, true);
    ty += 5;
  });

  cx += COL_4;
  drawLine(doc, cx, M, cx, M + HEADER_H);

  // ── COL 5: Stitching ──
  ty = M + 4;
  drawText(doc, 'MAIN BODYSTITCH:', cx + 2, ty, 6, false);
  drawText(doc, (construction.mainStitch || '').toUpperCase(), cx + 2, ty + 4, 7, true);
  ty += 10;
  drawText(doc, 'SEAM ALLOWANCE:', cx + 2, ty, 6, false);
  drawText(doc, (construction.seamAllowance || '').toUpperCase(), cx + 2, ty + 4, 7, true);
  ty += 10;
  drawText(doc, 'HEM:', cx + 2, ty, 6, false);
  drawText(doc, (construction.hemType || '').toUpperCase(), cx + 10, ty, 7, true);

  cx += COL_5;
  drawLine(doc, cx, M, cx, M + HEADER_H);

  // ── COL 6: Fastening ──
  ty = M + 4;
  drawText(doc, 'CF FASTENING:', cx + 2, ty, 6, false);
  drawText(doc, (construction.closureType || '').toUpperCase(), cx + 2, ty + 5, 7, true);


  // ══════════════════════════════════════════════════════════
  // DRAWING CANVAS AREA (No background, centered)
  // ══════════════════════════════════════════════════════════
  const CANVAS_Y = M + HEADER_H;
  const CANVAS_H = PH - CANVAS_Y - M;
  const CANVAS_W = PW - 2 * M;

  if (canvasEl) {
    try {
      // Capture the canvas
      const rawCanvas = await html2canvas(canvasEl, {
        backgroundColor: '#ffffff', // Ensures white background
        scale: 3,
        useCORS: true,
        logging: false,
      });
      const imgData = rawCanvas.toDataURL('image/png');
      const aspect = rawCanvas.width / rawCanvas.height;
      
      // Calculate dimensions to fit exactly in the white space
      let drawW = CANVAS_W - 20;
      let drawH = drawW / aspect;
      
      if (drawH > CANVAS_H - 10) {
        drawH = CANVAS_H - 10;
        drawW = drawH * aspect;
      }
      
      const drawX = M + (CANVAS_W - drawW) / 2;
      const drawY = CANVAS_Y + (CANVAS_H - drawH) / 2;
      
      doc.addImage(imgData, 'PNG', drawX, drawY, drawW, drawH);
    } catch {
      // fallback
    }
  }

  // ── Save ──
  const filename = `${info.styleName.replace(/\s+/g, '_')}_techpack_${info.season ?? ''}.pdf`;
  doc.save(filename);
}
