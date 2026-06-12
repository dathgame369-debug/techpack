import React, { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useTechpackStore } from '../../store/useTechpackStore';
import type { Material } from '../../types/techpack';

const MATERIAL_CATEGORIES = ['main', 'trim', 'lining', 'hardware', 'other'] as const;

const CATEGORY_COLORS: Record<string, string> = {
  main: '#c9a84c',
  trim: '#00c4a7',
  lining: '#7b61ff',
  hardware: '#ff6b7a',
  other: '#5a6380',
};

const MaterialRow: React.FC<{
  material: Material;
  onUpdate: (updates: Partial<Material>) => void;
  onDelete: () => void;
}> = ({ material, onUpdate, onDelete }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="material-row" style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {/* Header row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr 1fr auto auto', gap: 'var(--sp-2)', alignItems: 'center' }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: CATEGORY_COLORS[material.category] ?? '#5a6380', flexShrink: 0 }} />
        <select
          className="form-select"
          value={material.category}
          onChange={e => onUpdate({ category: e.target.value as Material['category'] })}
          style={{ padding: '5px 8px', fontSize: '0.75rem' }}
        >
          {MATERIAL_CATEGORIES.map(c => (
            <option key={c} value={c} style={{ textTransform: 'capitalize' }}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
          ))}
        </select>
        <input
          className="form-input"
          value={material.name}
          onChange={e => onUpdate({ name: e.target.value })}
          placeholder="Material name"
          style={{ padding: '5px 8px', fontSize: '0.8125rem' }}
        />
        <button className="tool-btn" onClick={() => setExpanded(!expanded)} data-tooltip="Expand details">
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        <button className="tool-btn" onClick={onDelete} style={{ color: '#ff6b7a' }} data-tooltip="Remove">
          <Trash2 size={14} />
        </button>
      </div>

      {/* Expanded detail fields */}
      {expanded && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-2)', marginTop: 'var(--sp-2)', paddingTop: 'var(--sp-2)', borderTop: '1px solid var(--border)' }}>
          <div className="form-group">
            <label className="form-label">Weight / GSM</label>
            <input className="form-input" value={material.weight ?? ''} onChange={e => onUpdate({ weight: e.target.value })} placeholder="180 GSM" style={{ padding: '5px 8px', fontSize: '0.8125rem' }} />
          </div>
          <div className="form-group">
            <label className="form-label">Composition</label>
            <input className="form-input" value={material.composition ?? ''} onChange={e => onUpdate({ composition: e.target.value })} placeholder="100% Cotton" style={{ padding: '5px 8px', fontSize: '0.8125rem' }} />
          </div>
          <div className="form-group">
            <label className="form-label">Supplier</label>
            <input className="form-input" value={material.supplier ?? ''} onChange={e => onUpdate({ supplier: e.target.value })} placeholder="Supplier name" style={{ padding: '5px 8px', fontSize: '0.8125rem' }} />
          </div>
          <div className="form-group">
            <label className="form-label">Finishes</label>
            <input className="form-input" value={material.finishes ?? ''} onChange={e => onUpdate({ finishes: e.target.value })} placeholder="Enzyme wash" style={{ padding: '5px 8px', fontSize: '0.8125rem' }} />
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Care Instructions</label>
            <input className="form-input" value={material.careInstructions ?? ''} onChange={e => onUpdate({ careInstructions: e.target.value })} placeholder="Machine wash cold, tumble dry low" style={{ padding: '5px 8px', fontSize: '0.8125rem' }} />
          </div>
        </div>
      )}
    </div>
  );
};

export const MaterialsForm: React.FC = () => {
  const { getActiveTechpack, addMaterial, updateMaterial, removeMaterial } = useTechpackStore();
  const tp = getActiveTechpack();
  const materials = tp?.specs.materials ?? [];

  const handleAdd = () => {
    addMaterial({
      id: crypto.randomUUID(),
      category: 'main',
      name: '',
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-secondary">Define fabrics, trims, and hardware used in this style.</p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={handleAdd}>
          <Plus size={14} /> Add Material
        </button>
      </div>

      {materials.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 'var(--sp-8)', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          <p>No materials added yet.</p>
          <button className="btn btn-teal btn-sm" onClick={handleAdd} style={{ marginTop: 'var(--sp-3)' }}>
            <Plus size={14} /> Add First Material
          </button>
        </div>
      ) : (
        <div>
          {materials.map(m => (
            <MaterialRow
              key={m.id}
              material={m}
              onUpdate={updates => updateMaterial(m.id, updates)}
              onDelete={() => removeMaterial(m.id)}
            />
          ))}
        </div>
      )}

      {/* Summary */}
      {materials.length > 0 && (
        <div className="glass-gold" style={{ padding: 'var(--sp-3)', borderRadius: 'var(--r-md)', fontSize: '0.8125rem' }}>
          <div className="flex justify-between text-secondary">
            <span>{materials.filter(m => m.category === 'main').length} main fabric{materials.filter(m => m.category === 'main').length !== 1 ? 's' : ''}</span>
            <span>{materials.filter(m => m.category === 'trim').length} trim{materials.filter(m => m.category === 'trim').length !== 1 ? 's' : ''}</span>
            <span>{materials.filter(m => m.category === 'hardware').length} hardware</span>
          </div>
        </div>
      )}
    </div>
  );
};
