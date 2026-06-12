import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Trash2, Copy, FileText, Clock } from 'lucide-react';
import { useTechpackStore } from '../store/useTechpackStore';
import { useUIStore } from '../store/useUIStore';
import { useAuthStore } from '../store/useAuthStore';
import { StatusBadge } from '../components/Common/StatusBadge';
import { GarmentTemplateSelector } from '../components/Canvas/GarmentTemplateSelector';
import type { Techpack, GarmentType } from '../types/techpack';
import { GARMENT_SVG_PATHS, GARMENT_LABELS } from '../components/Canvas/GarmentSilhouettes';

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const TechpackCard: React.FC<{ tp: Techpack; onOpen: () => void; onDelete: () => void; onDuplicate: () => void }> = ({
  tp, onOpen, onDelete, onDuplicate
}) => {
  const garmentType = tp.canvas.garmentType;
  const svgContent = garmentType !== 'custom' ? GARMENT_SVG_PATHS[garmentType] : null;

  return (
    <div className="card techpack-card card-interactive" onClick={onOpen}>
      {/* Preview */}
      <div className="techpack-card__preview">
        {tp.canvas.baseImageUrl ? (
          <img src={tp.canvas.baseImageUrl} alt="garment" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', opacity: 0.9 }} />
        ) : svgContent ? (
          <div
            style={{ width: 100, height: 120, opacity: 0.75 }}
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        ) : (
          <FileText size={48} color="var(--text-muted)" />
        )}
        {/* Gradient overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 50%, rgba(7,8,15,0.6) 100%)' }} />
        {/* Action buttons */}
        <div className="techpack-card__actions">
          <button
            className="btn btn-secondary btn-icon"
            style={{ width: 32, height: 32, fontSize: '0.75rem' }}
            onClick={e => { e.stopPropagation(); onDuplicate(); }}
            title="Duplicate"
          >
            <Copy size={13} />
          </button>
          <button
            className="btn btn-danger btn-icon"
            style={{ width: 32, height: 32 }}
            onClick={e => { e.stopPropagation(); onDelete(); }}
            title="Delete"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="techpack-card__info">
        <div className="text-h4" style={{ marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {tp.specs.productInfo.styleName}
        </div>
        <div className="text-sm text-secondary" style={{ marginBottom: 'var(--sp-3)' }}>
          {GARMENT_LABELS[tp.canvas.garmentType]} · {tp.specs.productInfo.season}
        </div>
        <div className="techpack-card__meta">
          <StatusBadge status={tp.status} />
          <div className="flex items-center gap-1 text-xs text-muted">
            <Clock size={11} />
            {formatDate(tp.updatedAt)}
          </div>
        </div>
      </div>
    </div>
  );
};

export const DashboardPage: React.FC = () => {
  const { techpacks, createTechpack, deleteTechpack, duplicateTechpack, setActiveTechpack } = useTechpackStore();
  const { openModal, activeModal, closeModal } = useUIStore();
  const user = useAuthStore(s => s.user);
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('all');

  const filtered = techpacks.filter(tp => {
    const matchSearch = tp.specs.productInfo.styleName.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || tp.status === filter || tp.canvas.garmentType === filter;
    return matchSearch && matchFilter;
  });

  const handleCreate = (garmentType: GarmentType) => {
    const id = createTechpack(garmentType);
    closeModal();
    navigate(`/techpack/${id}`);
  };

  const handleOpen = (id: string) => {
    setActiveTechpack(id);
    navigate(`/techpack/${id}`);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this techpack? This cannot be undone.')) {
      deleteTechpack(id);
    }
  };

  const handleDuplicate = (id: string) => {
    const newId = duplicateTechpack(id);
    if (newId) setActiveTechpack(newId);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="text-h2">
            Welcome back, <span className="gradient-text">{user?.firstName}</span> 👋
          </h1>
          <p className="text-sm text-secondary" style={{ marginTop: 4 }}>
            {techpacks.length} techpack{techpacks.length !== 1 ? 's' : ''} in your workspace
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => openModal('garmentSelector')}>
          <Plus size={16} /> New Techpack
        </button>
      </div>

      {/* Filters */}
      <div style={{ padding: 'var(--sp-5) var(--sp-8)', display: 'flex', gap: 'var(--sp-3)', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 240 }}>
          <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            className="form-input"
            placeholder="Search techpacks..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: 32 }}
          />
        </div>
        <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
          {['all', 'draft', 'review', 'approved', 'production'].map(f => (
            <button
              key={f}
              className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter(f)}
              style={{ textTransform: 'capitalize' }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'var(--sp-16)', gap: 'var(--sp-4)', textAlign: 'center' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--bg-card)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={36} color="var(--text-muted)" />
          </div>
          <div>
            <h3 className="text-h3" style={{ marginBottom: 'var(--sp-2)' }}>
              {search || filter !== 'all' ? 'No matching techpacks' : 'No techpacks yet'}
            </h3>
            <p className="text-secondary text-sm">
              {search || filter !== 'all' ? 'Try a different search or filter' : 'Create your first techpack to get started'}
            </p>
          </div>
          {!search && filter === 'all' && (
            <button className="btn btn-primary" onClick={() => openModal('garmentSelector')}>
              <Plus size={16} /> Create First Techpack
            </button>
          )}
        </div>
      ) : (
        <div className="techpack-grid">
          {/* New card */}
          <div
            className="card"
            style={{ cursor: 'pointer', border: '1.5px dashed var(--border-hover)', background: 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 260, gap: 'var(--sp-3)', transition: 'all var(--t-med)' }}
            onClick={() => openModal('garmentSelector')}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--gold-dim)'; (e.currentTarget as HTMLDivElement).style.background = 'rgba(201,168,76,0.04)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-hover)'; (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
          >
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--bg-card)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Plus size={22} color="var(--gold)" />
            </div>
            <span className="text-sm text-secondary">New Techpack</span>
          </div>
          {filtered.map(tp => (
            <TechpackCard
              key={tp.id}
              tp={tp}
              onOpen={() => handleOpen(tp.id)}
              onDelete={() => handleDelete(tp.id)}
              onDuplicate={() => handleDuplicate(tp.id)}
            />
          ))}
        </div>
      )}

      {/* Garment Selector Modal */}
      {activeModal === 'garmentSelector' && (
        <GarmentTemplateSelector onSelect={handleCreate} />
      )}
    </div>
  );
};
