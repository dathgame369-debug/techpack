import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Stage, Layer, Line, Text, Arrow, Group, Image as KonvaImage } from 'react-konva';
import type Konva from 'konva';
import { useTechpackStore } from '../../store/useTechpackStore';
import { useUIStore } from '../../store/useUIStore';
import { GARMENT_SVG_PATHS } from './GarmentSilhouettes';

const CANVAS_W = 600;
const CANVAS_H = 700;

function svgToImage(svgString: string): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const img = new window.Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.src = url;
  });
}

const ANNOTATION_COLORS: Record<string, string> = {
  dimension: '#ef4444',
  text:      '#000000',
  arrow:     '#ef4444',
  callout:   '#000000',
  stitch:    '#000000',
};

interface DrawPoint { x: number; y: number }

export const DrawingCanvas: React.FC = () => {
  const stageRef = useRef<Konva.Stage>(null);
  const { getActiveTechpack, addAnnotation, removeAnnotation } = useTechpackStore();
  const { activeTool } = useUIStore();
  const tp = getActiveTechpack();

  const [garmentImg, setGarmentImg] = useState<HTMLImageElement | null>(null);
  const [uploadedImg, setUploadedImg] = useState<HTMLImageElement | null>(null);
  const [drawing, setDrawing] = useState(false);
  const [startPt, setStartPt] = useState<DrawPoint | null>(null);
  const [currentPt, setCurrentPt] = useState<DrawPoint | null>(null);
  // editingText reserved for inline editing in a future update
  const [containerSize, setContainerSize] = useState({ w: CANVAS_W, h: CANVAS_H });
  const containerRef = useRef<HTMLDivElement>(null);

  // Load garment SVG
  useEffect(() => {
    if (!tp) return;
    const type = tp.canvas.garmentType;
    if (type === 'custom') return;
    const svgStr = GARMENT_SVG_PATHS[type];
    svgToImage(svgStr).then(setGarmentImg);
  }, [tp?.canvas.garmentType]);

  // Load uploaded base image
  useEffect(() => {
    if (!tp?.canvas.baseImageUrl) { setUploadedImg(null); return; }
    const img = new window.Image();
    img.onload = () => setUploadedImg(img);
    img.src = tp.canvas.baseImageUrl;
  }, [tp?.canvas.baseImageUrl]);

  // Responsive canvas
  useEffect(() => {
    const ro = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setContainerSize({ w: Math.floor(width), h: Math.floor(height) });
      }
    });
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const getPos = (_e: Konva.KonvaEventObject<MouseEvent | TouchEvent>): DrawPoint => {
    const stage = stageRef.current!;
    const pos = stage.getPointerPosition()!;
    return { x: pos.x, y: pos.y };
  };

  const handleMouseDown = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    if (activeTool === 'select' || activeTool === 'pan') return;
    const pos = getPos(e as Konva.KonvaEventObject<MouseEvent>);
    setStartPt(pos);
    setCurrentPt(pos);
    setDrawing(true);
  }, [activeTool]);

  const handleMouseMove = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    if (!drawing || !startPt) return;
    setCurrentPt(getPos(e));
  }, [drawing, startPt]);

  const handleMouseUp = useCallback(() => {
    if (!drawing || !startPt || !currentPt) { setDrawing(false); return; }

    const dx = currentPt.x - startPt.x;
    const dy = currentPt.y - startPt.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 5) { setDrawing(false); return; }

    if (activeTool === 'dimension') {
      const px = Math.round(dist);
      const cm = (px / 3).toFixed(1); // scale: 1cm = 3px approx
      addAnnotation({
        id: crypto.randomUUID(),
        type: 'dimension',
        view: tp?.canvas.activeView ?? 'front',
        x1: startPt.x, y1: startPt.y,
        x2: currentPt.x, y2: currentPt.y,
        measurement: `${cm} cm`,
        color: ANNOTATION_COLORS.dimension,
        strokeWidth: 1.5,
      });
    } else if (activeTool === 'arrow') {
      addAnnotation({
        id: crypto.randomUUID(),
        type: 'arrow',
        view: tp?.canvas.activeView ?? 'front',
        x1: startPt.x, y1: startPt.y,
        x2: currentPt.x, y2: currentPt.y,
        color: ANNOTATION_COLORS.arrow,
        strokeWidth: 1.5,
      });
    } else if (activeTool === 'text') {
      const text = prompt('Enter annotation text:') ?? '';
      if (text) {
        addAnnotation({
          id: crypto.randomUUID(),
          type: 'text',
          view: tp?.canvas.activeView ?? 'front',
          x1: startPt.x, y1: startPt.y,
          text,
          color: ANNOTATION_COLORS.text,
          fontSize: 13,
        });
      }
    } else if (activeTool === 'callout') {
      const text = prompt('Callout label:') ?? '';
      if (text) {
        addAnnotation({
          id: crypto.randomUUID(),
          type: 'callout',
          view: tp?.canvas.activeView ?? 'front',
          x1: startPt.x, y1: startPt.y,
          x2: currentPt.x, y2: currentPt.y,
          text,
          color: ANNOTATION_COLORS.callout,
          strokeWidth: 1,
        });
      }
    }

    setDrawing(false);
    setStartPt(null);
    setCurrentPt(null);
  }, [drawing, startPt, currentPt, activeTool, addAnnotation, tp]);

  const scale = Math.min(containerSize.w / CANVAS_W, containerSize.h / CANVAS_H, 1);
  const scaledW = CANVAS_W * scale;
  const scaledH = CANVAS_H * scale;

  const annotations = (tp?.canvas.annotations ?? []).filter(a => a.view === (tp?.canvas.activeView ?? 'front'));

  return (
    <div ref={containerRef} className={`canvas-wrapper canvas-wrapper--${activeTool}`} style={{ background: '#ffffff' }}>
      <Stage
        ref={stageRef}
        width={scaledW}
        height={scaledH}
        scaleX={scale}
        scaleY={scale}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ borderRadius: 'var(--r-md)', overflow: 'hidden' }}
      >
        {/* Garment base layer */}
        <Layer>
          {uploadedImg && (
            <KonvaImage image={uploadedImg} x={50} y={50} width={CANVAS_W - 100} height={CANVAS_H - 100} opacity={0.95} />
          )}
          {!uploadedImg && garmentImg && (
            <KonvaImage image={garmentImg} x={50} y={50} width={CANVAS_W - 100} height={CANVAS_H - 100} opacity={0.9} />
          )}
        </Layer>

        {/* Annotation layer */}
        <Layer>
          {annotations.map(ann => {
            if (ann.type === 'dimension' && ann.x2 !== undefined && ann.y2 !== undefined) {
              const mx = (ann.x1 + ann.x2) / 2;
              const my = (ann.y1 + ann.y2) / 2;
              const angle = Math.atan2(ann.y2 - ann.y1, ann.x2 - ann.x1);
              const perpX = -Math.sin(angle) * 12;
              const perpY = Math.cos(angle) * 12;
              return (
                <Group key={ann.id} onClick={() => activeTool === 'eraser' && removeAnnotation(ann.id)}>
                  {/* Perpendicular tick marks */}
                  <Line points={[ann.x1 - perpX, ann.y1 - perpY, ann.x1 + perpX, ann.y1 + perpY]} stroke={ann.color ?? '#ef4444'} strokeWidth={1} />
                  <Line points={[ann.x2 - perpX, ann.y2 - perpY, ann.x2 + perpX, ann.y2 + perpY]} stroke={ann.color ?? '#ef4444'} strokeWidth={1} />
                  {/* Main line */}
                  <Line points={[ann.x1, ann.y1, ann.x2, ann.y2]} stroke={ann.color ?? '#ef4444'} strokeWidth={ann.strokeWidth ?? 1.5} />
                  {/* Label bg */}
                  <Text
                    x={mx - 20} y={my - perpY - 14}
                    text={ann.measurement ?? ''}
                    fontSize={11}
                    fill={ann.color ?? '#ef4444'}
                    fontFamily="JetBrains Mono, monospace"
                    fontStyle="bold"
                    shadowColor="rgba(255,255,255,1)"
                    shadowBlur={2}
                    shadowOffsetX={0}
                    shadowOffsetY={0}
                  />
                </Group>
              );
            }
            if (ann.type === 'arrow' && ann.x2 !== undefined && ann.y2 !== undefined) {
              return (
                <Arrow
                  key={ann.id}
                  points={[ann.x1, ann.y1, ann.x2, ann.y2]}
                  stroke={ann.color ?? '#ef4444'}
                  strokeWidth={ann.strokeWidth ?? 1.5}
                  fill={ann.color ?? '#ef4444'}
                  pointerLength={8}
                  pointerWidth={6}
                  onClick={() => activeTool === 'eraser' && removeAnnotation(ann.id)}
                />
              );
            }
            if (ann.type === 'text') {
              return (
                <Text
                  key={ann.id}
                  x={ann.x1} y={ann.y1}
                  text={ann.text ?? ''}
                  fontSize={ann.fontSize ?? 13}
                  fill={ann.color ?? '#000000'}
                  fontFamily="Inter, sans-serif"
                  onClick={() => activeTool === 'eraser' && removeAnnotation(ann.id)}
                />
              );
            }
            if (ann.type === 'callout' && ann.x2 !== undefined && ann.y2 !== undefined) {
              return (
                <Group key={ann.id} onClick={() => activeTool === 'eraser' && removeAnnotation(ann.id)}>
                  <Line points={[ann.x1, ann.y1, ann.x2, ann.y2]} stroke={ann.color ?? '#000000'} strokeWidth={1} strokeDashArray={[4, 3]} />
                  <Text x={ann.x2 + 4} y={ann.y2 - 8} text={ann.text ?? ''} fontSize={11} fill={ann.color ?? '#000000'} fontFamily="Inter, sans-serif" />
                </Group>
              );
            }
            return null;
          })}

          {/* Live preview while drawing */}
          {drawing && startPt && currentPt && activeTool !== 'select' && activeTool !== 'text' && (
            <Line
              points={[startPt.x, startPt.y, currentPt.x, currentPt.y]}
              stroke={ANNOTATION_COLORS[activeTool] ?? '#ef4444'}
              strokeWidth={1.5}
              dash={[6, 4]}
              opacity={0.7}
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
};
