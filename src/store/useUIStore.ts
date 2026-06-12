import { create } from 'zustand';
import type { DrawingTool } from '../types/techpack';

type ActivePanel = 'product' | 'materials' | 'sizing' | 'colors' | 'construction';
type Modal = 'garmentSelector' | 'export' | 'deleteConfirm' | 'imageUpload' | null;

interface UIStore {
  activeTool: DrawingTool;
  activePanel: ActivePanel;
  activeModal: Modal;
  modalPayload: unknown;
  isSidebarCollapsed: boolean;
  isSpecsPanelCollapsed: boolean;
  pendingDeleteId: string | null;

  setActiveTool: (tool: DrawingTool) => void;
  setActivePanel: (panel: ActivePanel) => void;
  openModal: (modal: Modal, payload?: unknown) => void;
  closeModal: () => void;
  toggleSidebar: () => void;
  toggleSpecsPanel: () => void;
  setPendingDeleteId: (id: string | null) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  activeTool: 'select',
  activePanel: 'product',
  activeModal: null,
  modalPayload: null,
  isSidebarCollapsed: false,
  isSpecsPanelCollapsed: false,
  pendingDeleteId: null,

  setActiveTool: (tool) => set({ activeTool: tool }),
  setActivePanel: (panel) => set({ activePanel: panel }),
  openModal: (modal, payload = null) => set({ activeModal: modal, modalPayload: payload }),
  closeModal: () => set({ activeModal: null, modalPayload: null }),
  toggleSidebar: () => set(s => ({ isSidebarCollapsed: !s.isSidebarCollapsed })),
  toggleSpecsPanel: () => set(s => ({ isSpecsPanelCollapsed: !s.isSpecsPanelCollapsed })),
  setPendingDeleteId: (id) => set({ pendingDeleteId: id }),
}));
