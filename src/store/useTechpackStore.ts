import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Techpack, CanvasAnnotation, CanvasView, GarmentType,
  TechpackSpecs, ProductInfo, Material, ColorSwatch, SizeChart, ConstructionDetails, TechpackStatus
} from '../types/techpack';

const DEFAULT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const DEFAULT_MEASUREMENTS = ['Chest', 'Waist', 'Hip', 'Length', 'Sleeve', 'Shoulder'];

function createDefaultSizeChart(): SizeChart {
  const measurements: Record<string, Record<string, number>> = {};
  DEFAULT_MEASUREMENTS.forEach((m) => {
    measurements[m] = {};
    DEFAULT_SIZES.forEach((s, si) => {
      // realistic base values
      const bases: Record<string, number> = { Chest: 84, Waist: 68, Hip: 90, Length: 60, Sleeve: 60, Shoulder: 38 };
      measurements[m][s] = (bases[m] || 40) + (si - 2) * 2;
    });
  });
  return { sizes: DEFAULT_SIZES, measurements, unit: 'cm' };
}

function createDefaultSpecs(garmentType: GarmentType): TechpackSpecs {
  return {
    productInfo: {
      styleName: 'New Style',
      designerName: '',
      season: `SS${new Date().getFullYear()}`,
      garmentType,
    },
    materials: [],
    colors: [],
    sizeChart: createDefaultSizeChart(),
    constructionDetails: {},
  };
}

function createNewTechpack(garmentType: GarmentType): Techpack {
  return {
    id: crypto.randomUUID(),
    status: 'draft',
    canvas: {
      annotations: [],
      garmentType,
      activeView: 'front',
      zoom: 1,
      history: [[]],
      historyIndex: 0,
    },
    specs: createDefaultSpecs(garmentType),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

interface TechpackStore {
  techpacks: Techpack[];
  activeTechpackId: string | null;

  // CRUD
  createTechpack: (garmentType: GarmentType) => string;
  deleteTechpack: (id: string) => void;
  setActiveTechpack: (id: string) => void;
  getActiveTechpack: () => Techpack | null;
  duplicateTechpack: (id: string) => string;

  // Canvas
  addAnnotation: (annotation: CanvasAnnotation) => void;
  updateAnnotation: (id: string, updates: Partial<CanvasAnnotation>) => void;
  removeAnnotation: (id: string) => void;
  setActiveView: (view: CanvasView) => void;
  setBaseImage: (url: string) => void;
  setGarmentType: (type: GarmentType) => void;
  setZoom: (zoom: number) => void;
  undo: () => void;
  redo: () => void;

  // Specs
  updateProductInfo: (info: Partial<ProductInfo>) => void;
  addMaterial: (material: Material) => void;
  updateMaterial: (id: string, updates: Partial<Material>) => void;
  removeMaterial: (id: string) => void;
  addColor: (color: ColorSwatch) => void;
  updateColor: (id: string, updates: Partial<ColorSwatch>) => void;
  removeColor: (id: string) => void;
  updateSizeChart: (chart: SizeChart) => void;
  updateConstructionDetails: (details: Partial<ConstructionDetails>) => void;
  updateStatus: (status: TechpackStatus) => void;
}

const touch = (tp: Techpack): Techpack => ({ ...tp, updatedAt: new Date().toISOString() });

export const useTechpackStore = create<TechpackStore>()(
  persist(
    (set, get) => ({
      techpacks: [],
      activeTechpackId: null,

      createTechpack: (garmentType) => {
        const tp = createNewTechpack(garmentType);
        set(s => ({ techpacks: [...s.techpacks, tp], activeTechpackId: tp.id }));
        return tp.id;
      },

      deleteTechpack: (id) => set(s => ({
        techpacks: s.techpacks.filter(t => t.id !== id),
        activeTechpackId: s.activeTechpackId === id ? null : s.activeTechpackId,
      })),

      setActiveTechpack: (id) => set({ activeTechpackId: id }),

      getActiveTechpack: () => {
        const { techpacks, activeTechpackId } = get();
        return techpacks.find(t => t.id === activeTechpackId) ?? null;
      },

      duplicateTechpack: (id) => {
        const source = get().techpacks.find(t => t.id === id);
        if (!source) return '';
        const copy: Techpack = {
          ...structuredClone(source),
          id: crypto.randomUUID(),
          specs: {
            ...structuredClone(source.specs),
            productInfo: { ...source.specs.productInfo, styleName: source.specs.productInfo.styleName + ' (Copy)' },
          },
          status: 'draft',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set(s => ({ techpacks: [...s.techpacks, copy] }));
        return copy.id;
      },

      addAnnotation: (annotation) => {
        const { techpacks, activeTechpackId } = get();
        if (!activeTechpackId) return;
        set({
          techpacks: techpacks.map(t => {
            if (t.id !== activeTechpackId) return t;
            const newAnnotations = [...t.canvas.annotations, annotation];
            const history = t.canvas.history.slice(0, t.canvas.historyIndex + 1);
            return touch({
              ...t,
              canvas: {
                ...t.canvas,
                annotations: newAnnotations,
                history: [...history, newAnnotations],
                historyIndex: history.length,
              },
            });
          }),
        });
      },

      updateAnnotation: (id, updates) => {
        const { techpacks, activeTechpackId } = get();
        if (!activeTechpackId) return;
        set({
          techpacks: techpacks.map(t => {
            if (t.id !== activeTechpackId) return t;
            return touch({
              ...t,
              canvas: {
                ...t.canvas,
                annotations: t.canvas.annotations.map(a => a.id === id ? { ...a, ...updates } : a),
              },
            });
          }),
        });
      },

      removeAnnotation: (id) => {
        const { techpacks, activeTechpackId } = get();
        if (!activeTechpackId) return;
        set({
          techpacks: techpacks.map(t => {
            if (t.id !== activeTechpackId) return t;
            const newAnnotations = t.canvas.annotations.filter(a => a.id !== id);
            const history = t.canvas.history.slice(0, t.canvas.historyIndex + 1);
            return touch({
              ...t,
              canvas: {
                ...t.canvas,
                annotations: newAnnotations,
                history: [...history, newAnnotations],
                historyIndex: history.length,
              },
            });
          }),
        });
      },

      setActiveView: (view) => {
        const { techpacks, activeTechpackId } = get();
        if (!activeTechpackId) return;
        set({ techpacks: techpacks.map(t => t.id !== activeTechpackId ? t : touch({ ...t, canvas: { ...t.canvas, activeView: view } })) });
      },

      setBaseImage: (url) => {
        const { techpacks, activeTechpackId } = get();
        if (!activeTechpackId) return;
        set({ techpacks: techpacks.map(t => t.id !== activeTechpackId ? t : touch({ ...t, canvas: { ...t.canvas, baseImageUrl: url } })) });
      },

      setGarmentType: (type) => {
        const { techpacks, activeTechpackId } = get();
        if (!activeTechpackId) return;
        set({ techpacks: techpacks.map(t => t.id !== activeTechpackId ? t : touch({ ...t, canvas: { ...t.canvas, garmentType: type } })) });
      },

      setZoom: (zoom) => {
        const { techpacks, activeTechpackId } = get();
        if (!activeTechpackId) return;
        set({ techpacks: techpacks.map(t => t.id !== activeTechpackId ? t : { ...t, canvas: { ...t.canvas, zoom } }) });
      },

      undo: () => {
        const { techpacks, activeTechpackId } = get();
        if (!activeTechpackId) return;
        set({
          techpacks: techpacks.map(t => {
            if (t.id !== activeTechpackId) return t;
            const newIndex = Math.max(0, t.canvas.historyIndex - 1);
            return { ...t, canvas: { ...t.canvas, annotations: t.canvas.history[newIndex] ?? [], historyIndex: newIndex } };
          }),
        });
      },

      redo: () => {
        const { techpacks, activeTechpackId } = get();
        if (!activeTechpackId) return;
        set({
          techpacks: techpacks.map(t => {
            if (t.id !== activeTechpackId) return t;
            const newIndex = Math.min(t.canvas.history.length - 1, t.canvas.historyIndex + 1);
            return { ...t, canvas: { ...t.canvas, annotations: t.canvas.history[newIndex] ?? [], historyIndex: newIndex } };
          }),
        });
      },

      // Specs
      updateProductInfo: (info) => {
        const { techpacks, activeTechpackId } = get();
        if (!activeTechpackId) return;
        set({ techpacks: techpacks.map(t => t.id !== activeTechpackId ? t : touch({ ...t, specs: { ...t.specs, productInfo: { ...t.specs.productInfo, ...info } } })) });
      },

      addMaterial: (material) => {
        const { techpacks, activeTechpackId } = get();
        if (!activeTechpackId) return;
        set({ techpacks: techpacks.map(t => t.id !== activeTechpackId ? t : touch({ ...t, specs: { ...t.specs, materials: [...t.specs.materials, material] } })) });
      },

      updateMaterial: (id, updates) => {
        const { techpacks, activeTechpackId } = get();
        if (!activeTechpackId) return;
        set({ techpacks: techpacks.map(t => t.id !== activeTechpackId ? t : touch({ ...t, specs: { ...t.specs, materials: t.specs.materials.map(m => m.id === id ? { ...m, ...updates } : m) } })) });
      },

      removeMaterial: (id) => {
        const { techpacks, activeTechpackId } = get();
        if (!activeTechpackId) return;
        set({ techpacks: techpacks.map(t => t.id !== activeTechpackId ? t : touch({ ...t, specs: { ...t.specs, materials: t.specs.materials.filter(m => m.id !== id) } })) });
      },

      addColor: (color) => {
        const { techpacks, activeTechpackId } = get();
        if (!activeTechpackId) return;
        set({ techpacks: techpacks.map(t => t.id !== activeTechpackId ? t : touch({ ...t, specs: { ...t.specs, colors: [...t.specs.colors, color] } })) });
      },

      updateColor: (id, updates) => {
        const { techpacks, activeTechpackId } = get();
        if (!activeTechpackId) return;
        set({ techpacks: techpacks.map(t => t.id !== activeTechpackId ? t : touch({ ...t, specs: { ...t.specs, colors: t.specs.colors.map(c => c.id === id ? { ...c, ...updates } : c) } })) });
      },

      removeColor: (id) => {
        const { techpacks, activeTechpackId } = get();
        if (!activeTechpackId) return;
        set({ techpacks: techpacks.map(t => t.id !== activeTechpackId ? t : touch({ ...t, specs: { ...t.specs, colors: t.specs.colors.filter(c => c.id !== id) } })) });
      },

      updateSizeChart: (chart) => {
        const { techpacks, activeTechpackId } = get();
        if (!activeTechpackId) return;
        set({ techpacks: techpacks.map(t => t.id !== activeTechpackId ? t : touch({ ...t, specs: { ...t.specs, sizeChart: chart } })) });
      },

      updateConstructionDetails: (details) => {
        const { techpacks, activeTechpackId } = get();
        if (!activeTechpackId) return;
        set({ techpacks: techpacks.map(t => t.id !== activeTechpackId ? t : touch({ ...t, specs: { ...t.specs, constructionDetails: { ...t.specs.constructionDetails, ...details } } })) });
      },

      updateStatus: (status) => {
        const { techpacks, activeTechpackId } = get();
        if (!activeTechpackId) return;
        set({ techpacks: techpacks.map(t => t.id !== activeTechpackId ? t : touch({ ...t, status })) });
      },
    }),
    { name: 'techpac_store' }
  )
);
