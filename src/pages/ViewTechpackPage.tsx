import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Download, Edit3, FileText } from 'lucide-react';
import { useTechpackStore } from '../store/useTechpackStore';
import { useUIStore } from '../store/useUIStore';
import { StatusBadge } from '../components/Common/StatusBadge';
import { GARMENT_SVG_PATHS, GARMENT_LABELS } from '../components/Canvas/GarmentSilhouettes';

export const ViewTechpackPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { setActiveTechpack, getActiveTechpack } = useTechpackStore();
  const { openModal } = useUIStore();

  useEffect(() => {
    if (id) setActiveTechpack(id);
  }, [id]);

  const tp = getActiveTechpack();
  if (!tp) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: 'var(--sp-4)' }}>
      <p className="text-secondary">Techpack not found.</p>
      <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
        <ArrowLeft size={16} /> Back
      </button>
    </div>
  );

  const { productInfo, materials, colors, sizeChart } = tp.specs;
  const garmentType = tp.canvas.garmentType;
  const svgContent = garmentType !== 'custom' ? GARMENT_SVG_PATHS[garmentType] : null;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', padding: 'var(--sp-6)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--sp-6)' }}>
        <div className="flex items-center gap-3">
          <button className="btn btn-ghost btn-icon" onClick={() => navigate('/dashboard')}>
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-h2">{productInfo.styleName}</h1>
            <p className="text-sm text-secondary">{GARMENT_LABELS[garmentType]} · {productInfo.season}</p>
          </div>
          <StatusBadge status={tp.status} />
        </div>
        <div className="flex gap-3">
          <button className="btn btn-secondary" onClick={() => navigate(`/techpack/${id}`)}>
            <Edit3 size={15} /> Edit
          </button>
          <button className="btn btn-primary" onClick={() => { setActiveTechpack(id!); navigate(`/techpack/${id}`); setTimeout(() => openModal('export'), 100); }}>
            <Download size={15} /> Export PDF
          </button>
        </div>
      </div>

      {/* Main layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-6)', maxWidth: 1200, margin: '0 auto' }}>
        {/* Left: Drawing */}
        <div className="card" style={{ padding: 'var(--sp-6)' }}>
          <h2 className="text-h3" style={{ marginBottom: 'var(--sp-4)', color: 'var(--gold)' }}>Technical Drawing</h2>
          <div style={{ background: '#090b12', borderRadius: 'var(--r-md)', padding: 'var(--sp-6)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
            {tp.canvas.baseImageUrl ? (
              <img src={tp.canvas.baseImageUrl} alt="garment" style={{ maxHeight: 300, maxWidth: '100%', objectFit: 'contain' }} />
            ) : svgContent ? (
              <div style={{ width: 200, height: 250 }} dangerouslySetInnerHTML={{ __html: svgContent }} />
            ) : (
              <div className="flex flex-col items-center gap-3 text-muted">
                <FileText size={48} />
                <p className="text-sm">No drawing</p>
              </div>
            )}
          </div>
          {/* Annotations summary */}
          {tp.canvas.annotations.length > 0 && (
            <div style={{ marginTop: 'var(--sp-4)' }}>
              <p className="text-xs text-muted" style={{ marginBottom: 'var(--sp-2)' }}>ANNOTATIONS ({tp.canvas.annotations.length})</p>
              {tp.canvas.annotations.map(a => (
                <div key={a.id} className="flex items-center gap-2 text-xs text-secondary" style={{ marginBottom: 4 }}>
                  <span style={{ textTransform: 'capitalize', color: 'var(--gold)' }}>{a.type}</span>
                  {a.measurement && <span>{a.measurement}</span>}
                  {a.text && <span>"{a.text}"</span>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Specs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
          {/* Product Info */}
          <div className="card" style={{ padding: 'var(--sp-5)' }}>
            <h3 className="text-h4" style={{ color: 'var(--gold)', marginBottom: 'var(--sp-3)' }}>Product Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-2)' }}>
              {[
                ['Style Name', productInfo.styleName],
                ['Style No.', productInfo.styleNumber],
                ['Designer', productInfo.designerName],
                ['Season', productInfo.season],
                ['Fit Block', productInfo.fitBlock],
                ['Market', productInfo.targetMarket],
              ].filter(([, v]) => !!v).map(([label, value]) => (
                <div key={label as string}>
                  <p className="text-xs text-muted">{label as string}</p>
                  <p className="text-sm">{value as string}</p>
                </div>
              ))}
            </div>
            {productInfo.designNotes && (
              <div style={{ marginTop: 'var(--sp-3)', paddingTop: 'var(--sp-3)', borderTop: '1px solid var(--border)' }}>
                <p className="text-xs text-muted" style={{ marginBottom: 4 }}>Design Notes</p>
                <p className="text-sm text-secondary">{productInfo.designNotes}</p>
              </div>
            )}
          </div>

          {/* Materials */}
          {materials.length > 0 && (
            <div className="card" style={{ padding: 'var(--sp-5)' }}>
              <h3 className="text-h4" style={{ color: 'var(--gold)', marginBottom: 'var(--sp-3)' }}>Materials</h3>
              {materials.map(m => (
                <div key={m.id} style={{ marginBottom: 'var(--sp-2)', paddingBottom: 'var(--sp-2)', borderBottom: '1px solid var(--border)' }}>
                  <div className="flex justify-between">
                    <span className="text-sm" style={{ fontWeight: 500 }}>{m.name}</span>
                    <span className="text-xs text-muted" style={{ textTransform: 'capitalize' }}>{m.category}</span>
                  </div>
                  {(m.weight || m.composition) && (
                    <p className="text-xs text-secondary">{m.weight}{m.weight && m.composition ? ' · ' : ''}{m.composition}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Colors */}
          {colors.length > 0 && (
            <div className="card" style={{ padding: 'var(--sp-5)' }}>
              <h3 className="text-h4" style={{ color: 'var(--gold)', marginBottom: 'var(--sp-3)' }}>Colorways</h3>
              <div className="color-swatches">
                {colors.map(c => (
                  <div key={c.id} className="color-swatch">
                    <div className="color-swatch__circle" style={{ background: c.hexCode }} />
                    <span className="color-swatch__label">{c.name || c.hexCode}</span>
                    {c.pantoneCode && <span className="color-swatch__label" style={{ color: 'var(--teal)' }}>{c.pantoneCode}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Size Chart */}
      {Object.keys(sizeChart.measurements).length > 0 && (
        <div className="card" style={{ padding: 'var(--sp-5)', marginTop: 'var(--sp-6)', maxWidth: 1200, margin: 'var(--sp-6) auto 0' }}>
          <h3 className="text-h4" style={{ color: 'var(--gold)', marginBottom: 'var(--sp-3)' }}>
            Size Grading Table ({sizeChart.unit})
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table className="size-table">
              <thead>
                <tr>
                  <th style={{ textAlign: 'left' }}>Measurement</th>
                  {sizeChart.sizes.map(s => <th key={s}>{s}</th>)}
                </tr>
              </thead>
              <tbody>
                {Object.entries(sizeChart.measurements).map(([m, vals]) => (
                  <tr key={m}>
                    <td className="row-label">{m}</td>
                    {sizeChart.sizes.map(s => (
                      <td key={s} style={{ padding: '6px 8px', color: 'var(--text-primary)' }}>{vals[s] ?? '—'}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
