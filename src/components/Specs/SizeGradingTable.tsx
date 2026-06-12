import React, { useState } from 'react';
import { Plus, Trash2, ToggleLeft } from 'lucide-react';
import { useTechpackStore } from '../../store/useTechpackStore';
import type { SizeChart } from '../../types/techpack';

export const SizeGradingTable: React.FC = () => {
  const { getActiveTechpack, updateSizeChart } = useTechpackStore();
  const tp = getActiveTechpack();
  const chart: SizeChart = tp?.specs.sizeChart ?? { sizes: ['XS', 'S', 'M', 'L', 'XL'], measurements: {}, unit: 'cm' };

  const [newMeasure, setNewMeasure] = useState('');

  const handleCellChange = (measurement: string, size: string, value: string) => {
    const updated: SizeChart = {
      ...chart,
      measurements: {
        ...chart.measurements,
        [measurement]: { ...chart.measurements[measurement], [size]: value },
      },
    };
    updateSizeChart(updated);
  };

  const addMeasurement = () => {
    if (!newMeasure.trim()) return;
    const updated: SizeChart = {
      ...chart,
      measurements: { ...chart.measurements, [newMeasure.trim()]: {} },
    };
    updateSizeChart(updated);
    setNewMeasure('');
  };

  const removeMeasurement = (m: string) => {
    const { [m]: _, ...rest } = chart.measurements;
    updateSizeChart({ ...chart, measurements: rest });
  };

  const toggleUnit = () => {
    updateSizeChart({ ...chart, unit: chart.unit === 'cm' ? 'in' : 'cm' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
      <div className="flex justify-between items-center">
        <p className="text-sm text-secondary">Enter measurements for each size grade.</p>
        <div className="flex gap-2 items-center">
          <button className="btn btn-secondary btn-sm" onClick={toggleUnit}>
            <ToggleLeft size={14} /> {chart.unit}
          </button>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="size-table">
          <thead>
            <tr>
              <th style={{ textAlign: 'left', minWidth: 120 }}>Measurement</th>
              {chart.sizes.map(s => <th key={s}>{s}</th>)}
              <th style={{ width: 32 }}></th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(chart.measurements).map(([measure, values]) => (
              <tr key={measure}>
                <td className="row-label">{measure}</td>
                {chart.sizes.map(size => (
                  <td key={size}>
                    <input
                      type="number"
                      step="0.5"
                      value={values[size] ?? ''}
                      onChange={e => handleCellChange(measure, size, e.target.value)}
                      placeholder="—"
                    />
                  </td>
                ))}
                <td>
                  <button
                    style={{ width: '100%', padding: '6px 4px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                    onClick={() => removeMeasurement(measure)}
                  >
                    <Trash2 size={12} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add measurement row */}
      <div className="flex gap-2">
        <input
          className="form-input"
          placeholder="+ Add measurement (e.g. Chest, Waist)"
          value={newMeasure}
          onChange={e => setNewMeasure(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addMeasurement()}
          style={{ flex: 1 }}
        />
        <button className="btn btn-secondary btn-sm" onClick={addMeasurement}>
          <Plus size={14} /> Add
        </button>
      </div>

      {/* Info footer */}
      <div className="glass-gold" style={{ padding: 'var(--sp-3)', borderRadius: 'var(--r-md)' }}>
        <p className="text-xs text-secondary">
          💡 <strong>Pro tip:</strong> Values auto-grade ±2{chart.unit} per size step. Click any cell to edit directly.
          All values in <strong>{chart.unit}</strong>.
        </p>
      </div>
    </div>
  );
};
