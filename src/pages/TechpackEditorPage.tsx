import React, { useRef, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Download, Eye, PanelRightOpen, LayoutGrid
} from 'lucide-react';
import { useTechpackStore } from '../store/useTechpackStore';
import { useUIStore } from '../store/useUIStore';
import { DrawingCanvas } from '../components/Canvas/DrawingCanvas';
import { CanvasToolbar } from '../components/Canvas/CanvasToolbar';
import { SpecificationsPanel } from '../components/Specs/SpecificationsPanel';
import { GarmentTemplateSelector } from '../components/Canvas/GarmentTemplateSelector';
import { ExportModal } from '../components/Export/ExportModal';
import { StatusBadge } from '../components/Common/StatusBadge';
import { GARMENT_LABELS } from '../components/Canvas/GarmentSilhouettes';
import type { CanvasView, GarmentType, TechpackStatus } from '../types/techpack';

const VIEWS: CanvasView[] = ['front', 'back', 'detail'];
const STATUSES: TechpackStatus[] = ['draft', 'review', 'approved', 'production'];

export const TechpackEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  const {
    setActiveTechpack, getActiveTechpack, updateStatus, setActiveView, setGarmentType
  } = useTechpackStore();
  const {
    activeModal, openModal, closeModal, isSpecsPanelCollapsed, toggleSpecsPanel, activeTool
  } = useUIStore();
  const { undo, redo } = useTechpackStore();

  useEffect(() => {
    if (id) setActiveTechpack(id);
  }, [id]);

  const tp = getActiveTechpack();

  // Keyboard shortcuts
  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
    const { setActiveTool } = useUIStore.getState();
    if (e.ctrlKey && e.key === 'z') { e.preventDefault(); undo(); return; }
    if (e.ctrlKey && (e.key === 'y' || (e.shiftKey && e.key === 'Z'))) { e.preventDefault(); redo(); return; }
    const toolMap: Record<string, Parameters<typeof setActiveTool>[0]> = {
      v: 'select', d: 'dimension', t: 'text', a: 'arrow', c: 'callout', e: 'eraser',
    };
    if (toolMap[e.key]) setActiveTool(toolMap[e.key]);
  }, [undo, redo]);

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  if (!tp) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: 'var(--sp-4)' }}>
        <p className="text-secondary">Techpack not found.</p>
        <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className={`editor-layout ${isSpecsPanelCollapsed ? 'editor-layout--specs-collapsed' : ''}`}>
      {/* Left toolbar */}
      <CanvasToolbar />

      {/* Canvas area */}
      <div className="canvas-area">
        {/* Editor header */}
        <div className="canvas-view-tabs">
          <div className="flex items-center gap-3">
            <button className="btn btn-ghost btn-icon btn-sm" onClick={() => navigate('/dashboard')}>
              <ArrowLeft size={16} />
            </button>
            <div>
              <div className="text-h4" style={{ lineHeight: 1.2 }}>
                {tp.specs.productInfo.styleName}
              </div>
              <div className="text-xs text-muted">
                {GARMENT_LABELS[tp.canvas.garmentType]} · {tp.specs.productInfo.season}
              </div>
            </div>
            <StatusBadge status={tp.status} />
          </div>

          {/* View tabs */}
          <div className="flex gap-1">
            {VIEWS.map(v => (
              <button
                key={v}
                className={`view-tab ${tp.canvas.activeView === v ? 'view-tab--active' : ''}`}
                onClick={() => setActiveView(v)}
                style={{ textTransform: 'capitalize' }}
              >
                {v}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Status dropdown */}
            <div style={{ position: 'relative' }}>
              <select
                className="form-select"
                value={tp.status}
                onChange={e => updateStatus(e.target.value as TechpackStatus)}
                style={{ padding: '4px 24px 4px 8px', fontSize: '0.75rem', background: 'var(--bg-card)' }}
              >
                {STATUSES.map(s => (
                  <option key={s} value={s} style={{ textTransform: 'capitalize' }}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openModal('garmentSelector')} data-tooltip="Change garment template">
              <LayoutGrid size={16} />
            </button>

            <button className="btn btn-ghost btn-icon btn-sm" onClick={() => navigate(`/techpack/${id}/view`)} data-tooltip="Preview">
              <Eye size={16} />
            </button>

            {isSpecsPanelCollapsed && (
              <button className="btn btn-ghost btn-icon btn-sm" onClick={toggleSpecsPanel} data-tooltip="Show specs panel">
                <PanelRightOpen size={16} />
              </button>
            )}

            <button className="btn btn-primary btn-sm" onClick={() => openModal('export')}>
              <Download size={14} /> Export PDF
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div ref={canvasContainerRef} style={{ flex: 1, overflow: 'hidden', display: 'flex' }}>
          <DrawingCanvas />
        </div>

        {/* Canvas info bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 12px', background: 'var(--bg-elevated)', borderTop: '1px solid var(--border)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <span>
            Tool: <strong style={{ color: 'var(--gold)', textTransform: 'capitalize' }}>{activeTool}</strong>
            {' · '}
            Annotations: <strong style={{ color: 'var(--text-secondary)' }}>
              {tp.canvas.annotations.filter(a => a.view === tp.canvas.activeView).length}
            </strong>
          </span>
          <span>
            Zoom: <strong>{Math.round((tp.canvas.zoom ?? 1) * 100)}%</strong>
            {' · '}
            Press <kbd style={{ background: 'var(--bg-card)', padding: '1px 4px', borderRadius: 3, border: '1px solid var(--border)', fontSize: '0.7rem' }}>D</kbd> for dimension line
          </span>
        </div>
      </div>

      {/* Specs panel */}
      <SpecificationsPanel />

      {/* Modals */}
      {activeModal === 'garmentSelector' && (
        <GarmentTemplateSelector
          onSelect={(type: GarmentType) => { setGarmentType(type); closeModal(); }}
        />
      )}
      {activeModal === 'export' && (
        <ExportModal canvasContainerRef={canvasContainerRef} />
      )}
    </div>
  );
};
