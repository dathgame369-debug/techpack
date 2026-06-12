import React, { useState } from 'react';
import { Plus, Trash2, Star } from 'lucide-react';
import { HexColorPicker } from 'react-colorful';
import { useTechpackStore } from '../../store/useTechpackStore';
import type { ColorSwatch } from '../../types/techpack';

const ColorSwatchEditor: React.FC<{
  color: ColorSwatch;
  onUpdate: (updates: Partial<ColorSwatch>) => void;
  onDelete: () => void;
}> = ({ color, onUpdate, onDelete }) => {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div className="card" style={{ padding: 'var(--sp-4)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)', position: 'relative' }}>
      {/* Swatch circle + picker */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
        <div
          className="color-swatch__circle"
          style={{ background: color.hexCode, flexShrink: 0, width: 48, height: 48 }}
          onClick={() => setShowPicker(!showPicker)}
        />
        {showPicker && (
          <div style={{ position: 'absolute', left: 70, top: 16, zIndex: 100 }}>
            <div
              style={{ position: 'fixed', inset: 0 }}
              onClick={() => setShowPicker(false)}
            />
            <div style={{ position: 'relative', zIndex: 101 }}>
              <HexColorPicker color={color.hexCode} onChange={hex => onUpdate({ hexCode: hex })} />
            </div>
          </div>
        )}
        <div style={{ flex: 1 }}>
          <input
            className="form-input"
            value={color.name}
            onChange={e => onUpdate({ name: e.target.value })}
            placeholder="Color name"
            style={{ marginBottom: 'var(--sp-2)', fontSize: '0.875rem', padding: '5px 8px' }}
          />
          <input
            className="form-input"
            value={color.hexCode}
            onChange={e => onUpdate({ hexCode: e.target.value })}
            placeholder="#c9a84c"
            style={{ fontSize: '0.8125rem', padding: '5px 8px', fontFamily: 'var(--font-mono)' }}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 'var(--sp-2)', alignItems: 'center' }}>
        <input
          className="form-input"
          value={color.pantoneCode ?? ''}
          onChange={e => onUpdate({ pantoneCode: e.target.value })}
          placeholder="Pantone code (e.g. PMS 7401 C)"
          style={{ fontSize: '0.8125rem', padding: '5px 8px' }}
        />
        <div className="flex gap-1">
          <button
            className={`tool-btn ${color.isMain ? 'tool-btn--active' : ''}`}
            onClick={() => onUpdate({ isMain: !color.isMain })}
            data-tooltip={color.isMain ? 'Main colorway' : 'Set as main'}
          >
            <Star size={13} fill={color.isMain ? 'currentColor' : 'none'} />
          </button>
          <button
            className="tool-btn"
            onClick={onDelete}
            style={{ color: '#ff6b7a' }}
            data-tooltip="Remove color"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};

export const ColorsSection: React.FC = () => {
  const { getActiveTechpack, addColor, updateColor, removeColor } = useTechpackStore();
  const tp = getActiveTechpack();
  const colors = tp?.specs.colors ?? [];

  const DEFAULT_COLORS = ['#1a1a2e', '#c9a84c', '#00c4a7', '#f0f2f8', '#7b61ff', '#ff6b7a'];

  const handleAdd = (hex?: string) => {
    addColor({
      id: crypto.randomUUID(),
      name: '',
      hexCode: hex ?? '#c9a84c',
      isMain: colors.length === 0,
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
      <div className="flex justify-between items-center">
        <p className="text-sm text-secondary">Define colorways with hex and Pantone codes.</p>
        <button className="btn btn-secondary btn-sm" onClick={() => handleAdd()}>
          <Plus size={14} /> Add Color
        </button>
      </div>

      {/* Quick add palette */}
      <div>
        <p className="text-xs text-muted" style={{ marginBottom: 'var(--sp-2)' }}>Quick add:</p>
        <div className="flex gap-2">
          {DEFAULT_COLORS.map(hex => (
            <div
              key={hex}
              onClick={() => handleAdd(hex)}
              title={`Add ${hex}`}
              style={{
                width: 28, height: 28, borderRadius: '50%',
                background: hex,
                border: '2px solid var(--border-hover)',
                cursor: 'pointer',
                transition: 'transform var(--t-fast)',
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.2)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
            />
          ))}
        </div>
      </div>

      {/* Color list */}
      {colors.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 'var(--sp-6)', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          No colors added yet. Click a swatch above or "Add Color".
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
          {colors.map(c => (
            <ColorSwatchEditor
              key={c.id}
              color={c}
              onUpdate={updates => updateColor(c.id, updates)}
              onDelete={() => removeColor(c.id)}
            />
          ))}
        </div>
      )}

      {/* Color row preview */}
      {colors.length > 0 && (
        <div className="glass-gold" style={{ padding: 'var(--sp-3)', borderRadius: 'var(--r-md)' }}>
          <p className="text-xs text-muted" style={{ marginBottom: 'var(--sp-2)' }}>Colorway preview</p>
          <div className="color-swatches">
            {colors.map(c => (
              <div key={c.id} className="color-swatch">
                <div className="color-swatch__circle" style={{ background: c.hexCode }}>
                  {c.isMain && (
                    <Star size={10} fill="white" color="white" style={{ position: 'absolute', top: 2, right: 2 }} />
                  )}
                </div>
                <span className="color-swatch__label">{c.name || c.hexCode}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
