export type GarmentType = 'tshirt' | 'dress' | 'jacket' | 'jeans' | 'skirt' | 'shirt' | 'hoodie' | 'coat' | 'custom';
export type TechpackStatus = 'draft' | 'review' | 'approved' | 'production';
export type AnnotationType = 'dimension' | 'text' | 'arrow' | 'callout' | 'stitch';
export type CanvasView = 'front' | 'back' | 'detail';

export interface Point {
  x: number;
  y: number;
}

export interface CanvasAnnotation {
  id: string;
  type: AnnotationType;
  view: CanvasView;
  x1: number;
  y1: number;
  x2?: number;
  y2?: number;
  text?: string;
  measurement?: string;
  unit?: 'cm' | 'in' | 'mm';
  color?: string;
  fontSize?: number;
  strokeWidth?: number;
}

export interface CanvasState {
  annotations: CanvasAnnotation[];
  baseImageUrl?: string;
  garmentType: GarmentType;
  activeView: CanvasView;
  zoom: number;
  history: CanvasAnnotation[][];
  historyIndex: number;
}

export interface Material {
  id: string;
  category: 'main' | 'trim' | 'lining' | 'hardware' | 'other';
  name: string;
  weight?: string;
  composition?: string;
  supplier?: string;
  careInstructions?: string;
  finishes?: string;
}

export interface ColorSwatch {
  id: string;
  name: string;
  hexCode: string;
  pantoneCode?: string;
  swatchImageUrl?: string;
  isMain?: boolean;
}

export interface SizeChart {
  sizes: string[];
  measurements: Record<string, Record<string, number | string>>;
  // measurements[measurementName][size] = value
  unit: 'cm' | 'in';
}

export interface ProductInfo {
  styleName: string;
  styleNumber?: string;
  designerName: string;
  season: string;
  garmentType: GarmentType;
  fitBlock?: string;
  designNotes?: string;
  targetMarket?: string;
}

export interface ConstructionDetails {
  mainStitch?: string;
  seamAllowance?: string;
  hemType?: string;
  collarDetails?: string;
  cuffDetails?: string;
  closureType?: string;
  printPlacement?: string;
  embroideryDetails?: string;
  specialFinishes?: string;
  washTreatment?: string;
  additionalNotes?: string;
}

export interface TechpackSpecs {
  productInfo: ProductInfo;
  materials: Material[];
  colors: ColorSwatch[];
  sizeChart: SizeChart;
  constructionDetails: ConstructionDetails;
}

export interface Techpack {
  id: string;
  status: TechpackStatus;
  canvas: CanvasState;
  specs: TechpackSpecs;
  createdAt: string;
  updatedAt: string;
  thumbnailUrl?: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  companyName?: string;
  avatarUrl?: string;
  createdAt: string;
}

export type DrawingTool = 'select' | 'dimension' | 'text' | 'arrow' | 'callout' | 'pan' | 'eraser';
