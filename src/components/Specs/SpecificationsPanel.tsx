import React from 'react';
import {
  Info, Scissors, Ruler, Palette, SlidersHorizontal, PanelRightClose
} from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';
import { ProductInfoForm } from './ProductInfoForm';
import { MaterialsForm } from './MaterialsForm';
import { SizeGradingTable } from './SizeGradingTable';
import { ColorsSection } from './ColorsSection';
import { ConstructionDetailsForm } from './ConstructionDetailsForm';

const TABS = [
  { key: 'product',      label: 'Product',      icon: Info },
  { key: 'materials',    label: 'Materials',     icon: Scissors },
  { key: 'sizing',       label: 'Sizing',        icon: Ruler },
  { key: 'colors',       label: 'Colors',        icon: Palette },
  { key: 'construction', label: 'Construction',  icon: SlidersHorizontal },
] as const;

type PanelKey = typeof TABS[number]['key'];

export const SpecificationsPanel: React.FC = () => {
  const { activePanel, setActivePanel, isSpecsPanelCollapsed, toggleSpecsPanel } = useUIStore();

  if (isSpecsPanelCollapsed) {
    return (
      <div style={{ width: 0, overflow: 'hidden' }} />
    );
  }

  return (
    <div className="specs-panel">
      {/* Panel header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderBottom: '1px solid var(--border)', background: 'var(--bg-card)' }}>
        <span className="text-xs text-muted" style={{ fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Specifications</span>
        <button className="tool-btn" onClick={toggleSpecsPanel} data-tooltip="Collapse panel">
          <PanelRightClose size={15} />
        </button>
      </div>

      {/* Tabs */}
      <div className="spec-tabs">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            className={`spec-tab ${activePanel === key ? 'spec-tab--active' : ''}`}
            onClick={() => setActivePanel(key as PanelKey)}
          >
            <Icon size={13} />
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="spec-content">
        {activePanel === 'product'      && <ProductInfoForm />}
        {activePanel === 'materials'    && <MaterialsForm />}
        {activePanel === 'sizing'       && <SizeGradingTable />}
        {activePanel === 'colors'       && <ColorsSection />}
        {activePanel === 'construction' && <ConstructionDetailsForm />}
      </div>
    </div>
  );
};
