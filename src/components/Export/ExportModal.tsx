import React, { useState } from 'react';
import { Download, FileImage, File, Loader, CheckCircle } from 'lucide-react';
import { Modal } from '../Common/Modal';
import { useTechpackStore } from '../../store/useTechpackStore';
import { useUIStore } from '../../store/useUIStore';
import { generateTechpackPDF } from '../../services/pdfGenerator';
import { useAuthStore } from '../../store/useAuthStore';

interface Props {
  canvasContainerRef: React.RefObject<HTMLDivElement | null>;
}

export const ExportModal: React.FC<Props> = ({ canvasContainerRef }) => {
  const { getActiveTechpack } = useTechpackStore();
  const { closeModal } = useUIStore();
  const user = useAuthStore(s => s.user);
  const tp = getActiveTechpack();
  const [exporting, setExporting] = useState(false);
  const [done, setDone] = useState(false);

  const handlePDF = async () => {
    if (!tp) return;
    setExporting(true);
    setDone(false);
    try {
      await generateTechpackPDF(tp, canvasContainerRef.current, user?.companyName ?? user?.firstName);
      setDone(true);
      setTimeout(() => setDone(false), 3000);
    } finally {
      setExporting(false);
    }
  };

  const handlePNG = async () => {
    if (!canvasContainerRef.current) return;
    setExporting(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(canvasContainerRef.current, {
        backgroundColor: '#ffffff',
        scale: 3,
        useCORS: true,
        logging: false,
      });
      const link = document.createElement('a');
      link.download = `${tp?.specs.productInfo.styleName ?? 'techpack'}_drawing.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      setDone(true);
      setTimeout(() => setDone(false), 3000);
    } finally {
      setExporting(false);
    }
  };


  if (!tp) return null;

  return (
    <Modal
      title="Export Techpack"
      maxWidth="460px"
      footer={
        <button className="btn btn-ghost" onClick={closeModal}>Close</button>
      }
    >
      <p className="text-sm text-secondary" style={{ marginBottom: 'var(--sp-5)' }}>
        Export <strong style={{ color: 'var(--text-primary)' }}>{tp.specs.productInfo.styleName}</strong> as:
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
        {/* PDF */}
        <div
          className="card"
          style={{ padding: 'var(--sp-4)', display: 'flex', alignItems: 'center', gap: 'var(--sp-4)', cursor: 'pointer' }}
          onClick={!exporting ? handlePDF : undefined}
        >
          <div style={{ width: 48, height: 48, borderRadius: 'var(--r-md)', background: 'rgba(201,168,76,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <File size={24} color="var(--gold)" />
          </div>
          <div style={{ flex: 1 }}>
            <div className="text-h4">PDF (Recommended)</div>
            <div className="text-xs text-secondary">1-page landscape techpack · exactly matching reference layout</div>
          </div>
          {exporting ? (
            <Loader size={18} className="animate-spin" color="var(--gold)" />
          ) : done ? (
            <CheckCircle size={18} color="var(--teal)" />
          ) : (
            <Download size={18} color="var(--text-muted)" />
          )}
        </div>

        {/* PNG */}
        <div
          className="card"
          style={{ padding: 'var(--sp-4)', display: 'flex', alignItems: 'center', gap: 'var(--sp-4)', cursor: 'pointer' }}
          onClick={!exporting ? handlePNG : undefined}
        >
          <div style={{ width: 48, height: 48, borderRadius: 'var(--r-md)', background: 'rgba(0,196,167,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileImage size={24} color="var(--teal)" />
          </div>
          <div style={{ flex: 1 }}>
            <div className="text-h4">PNG — Drawing Only</div>
            <div className="text-xs text-secondary">High-resolution 3× PNG of the technical drawing canvas</div>
          </div>
          <Download size={18} color="var(--text-muted)" />
        </div>
      </div>

      {done && (
        <div style={{ marginTop: 'var(--sp-4)', padding: 'var(--sp-3)', background: 'rgba(0,196,167,0.1)', border: '1px solid rgba(0,196,167,0.25)', borderRadius: 'var(--r-md)', color: 'var(--teal)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
          <CheckCircle size={16} /> Export complete! File saved to your downloads.
        </div>
      )}
    </Modal>
  );
};
