import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { Modal } from '../Common/Modal';
import { GARMENT_SVG_PATHS, GARMENT_LABELS } from './GarmentSilhouettes';
import type { GarmentType } from '../../types/techpack';

const GARMENTS: GarmentType[] = ['tshirt', 'dress', 'jacket', 'jeans', 'skirt', 'shirt', 'hoodie', 'coat'];

interface Props {
  onSelect: (type: GarmentType) => void;
}

export const GarmentTemplateSelector: React.FC<Props> = ({ onSelect }) => {
  const [selected, setSelected] = useState<GarmentType>('tshirt');

  return (
    <Modal
      title="Choose a Garment Template"
      maxWidth="640px"
      footer={
        <>
          <button className="btn btn-secondary" onClick={() => onSelect(selected)}>
            Start with template
          </button>
          <button className="btn btn-primary" onClick={() => onSelect(selected)}>
            Create Techpack
          </button>
        </>
      }
    >
      <p className="text-sm text-secondary" style={{ marginBottom: 'var(--sp-5)' }}>
        Select a pre-built garment silhouette to start your techpack. You can upload a custom sketch after.
      </p>

      <div className="garment-grid">
        {GARMENTS.map(type => {
          const svg = (GARMENT_SVG_PATHS as Record<string, string>)[type] ?? '';
          return (
            <div
              key={type}
              className={`garment-item ${selected === type ? 'garment-item--selected' : ''}`}
              onClick={() => setSelected(type)}
            >
              <div
                style={{ width: 80, height: 80 }}
                dangerouslySetInnerHTML={{ __html: svg }}
              />
              <span className="garment-item__label">{GARMENT_LABELS[type]}</span>
            </div>
          );
        })}

        {/* Custom upload */}
        <div
          className={`garment-item ${selected === 'custom' ? 'garment-item--selected' : ''}`}
          onClick={() => setSelected('custom')}
          style={{ borderStyle: 'dashed' }}
        >
          <Upload size={32} color="var(--text-muted)" />
          <span className="garment-item__label">Custom Upload</span>
        </div>
      </div>

      {selected && (
        <div className="glass-gold" style={{ marginTop: 'var(--sp-4)', padding: 'var(--sp-3)', borderRadius: 'var(--r-md)' }}>
          <p className="text-sm">
            <strong style={{ color: 'var(--gold)' }}>{GARMENT_LABELS[selected] ?? selected}</strong>
            {' '}— Pre-populated with standard measurements and specification sections.
          </p>
        </div>
      )}
    </Modal>
  );
};
