import React, { useRef } from 'react';
import {
  MousePointer2, Ruler, Type, MoveRight, MessageCircle,
  Eraser, Undo2, Redo2, ZoomIn, ZoomOut, RotateCcw, Upload
} from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';
import { useTechpackStore } from '../../store/useTechpackStore';
import type { DrawingTool } from '../../types/techpack';

const TOOLS: { tool: DrawingTool; icon: React.FC<{ size?: number }>; label: string }[] = [
  { tool: 'select',    icon: MousePointer2, label: 'Select (V)' },
  { tool: 'dimension', icon: Ruler,         label: 'Dimension Line (D)' },
  { tool: 'text',      icon: Type,          label: 'Text Label (T)' },
  { tool: 'arrow',     icon: MoveRight,     label: 'Arrow (A)' },
  { tool: 'callout',   icon: MessageCircle, label: 'Callout (C)' },
  { tool: 'eraser',    icon: Eraser,        label: 'Eraser (E)' },
];

export const CanvasToolbar: React.FC = () => {
  const { activeTool, setActiveTool } = useUIStore();
  const { undo, redo, setZoom, setBaseImage, getActiveTechpack } = useTechpackStore();
  const tp = getActiveTechpack();
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      if (ev.target?.result) {
        setBaseImage(ev.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="canvas-toolbar">
      {/* Drawing tools */}
      {TOOLS.map(({ tool, icon: Icon, label }) => (
        <button
          key={tool}
          className={`tool-btn ${activeTool === tool ? 'tool-btn--active' : ''}`}
          onClick={() => setActiveTool(tool)}
          data-tooltip={label}
        >
          <Icon size={16} />
        </button>
      ))}

      <div className="tool-btn--divider" />

      {/* Undo/redo */}
      <button className="tool-btn" onClick={undo} data-tooltip="Undo (Ctrl+Z)">
        <Undo2 size={16} />
      </button>
      <button className="tool-btn" onClick={redo} data-tooltip="Redo (Ctrl+Y)">
        <Redo2 size={16} />
      </button>

      <div className="tool-btn--divider" />

      {/* Zoom */}
      <button className="tool-btn" onClick={() => setZoom(Math.min((tp?.canvas.zoom ?? 1) + 0.1, 3))} data-tooltip="Zoom In">
        <ZoomIn size={16} />
      </button>
      <button className="tool-btn" onClick={() => setZoom(Math.max((tp?.canvas.zoom ?? 1) - 0.1, 0.3))} data-tooltip="Zoom Out">
        <ZoomOut size={16} />
      </button>
      <button className="tool-btn" onClick={() => setZoom(1)} data-tooltip="Reset Zoom">
        <RotateCcw size={14} />
      </button>

      <div className="tool-btn--divider" />

      {/* Upload image */}
      <button className="tool-btn" onClick={() => fileRef.current?.click()} data-tooltip="Upload Garment Image">
        <Upload size={16} />
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/png,image/svg+xml,image/jpeg"
        style={{ display: 'none' }}
        onChange={handleImageUpload}
      />
    </div>
  );
};
