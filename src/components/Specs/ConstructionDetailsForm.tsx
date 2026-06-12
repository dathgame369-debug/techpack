import React from 'react';
import { useForm } from 'react-hook-form';
import { useTechpackStore } from '../../store/useTechpackStore';
import type { ConstructionDetails } from '../../types/techpack';

export const ConstructionDetailsForm: React.FC = () => {
  const { getActiveTechpack, updateConstructionDetails } = useTechpackStore();
  const tp = getActiveTechpack();
  const details = tp?.specs.constructionDetails ?? {};

  const { register, handleSubmit, formState: { isDirty }, reset } = useForm<ConstructionDetails>({
    defaultValues: details,
  });

  const onSubmit = (data: ConstructionDetails) => {
    updateConstructionDetails(data);
    reset(data);
  };

  const field = (name: keyof ConstructionDetails, label: string, placeholder: string, isSelect?: string[]) => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      {isSelect ? (
        <select {...register(name)} className="form-select">
          <option value="">Select...</option>
          {isSelect.map(o => <option key={o}>{o}</option>)}
        </select>
      ) : (
        <input {...register(name)} className="form-input" placeholder={placeholder} />
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
      <p className="text-sm text-secondary">Specify stitching, seams, and assembly construction details.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-3)' }}>
        {field('mainStitch', 'Main Stitch Type', 'e.g. Single needle lockstitch', [
          'Single needle lockstitch',
          'Double needle lockstitch',
          'Flat-lock stitch',
          'Overlock (Serger)',
          'Chain stitch',
          'Cover stitch',
          'Blind stitch',
        ])}
        {field('seamAllowance', 'Seam Allowance', 'e.g. 1 cm', [
          '0.5 cm', '1 cm', '1.5 cm', '2 cm', 'Custom'
        ])}
        {field('hemType', 'Hem Type', 'e.g. Double-fold hem', [
          'Single-fold hem',
          'Double-fold hem',
          'Rolled hem',
          'Blind hem',
          'Lettuce hem',
          'French seam hem',
        ])}
        {field('closureType', 'Closure Type', 'e.g. Invisible zip, Button', [
          'Buttons',
          'Invisible zip',
          'Exposed zip',
          'Snap buttons',
          'Hook & eye',
          'Tie closure',
          'No closure',
        ])}
        {field('collarDetails', 'Collar Details', 'e.g. 2cm collar stand, interfaced')}
        {field('cuffDetails', 'Cuff Details', 'e.g. Ribbed cuff, 5cm width')}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-3)' }}>
        {field('printPlacement', 'Print / Embroidery Placement', 'e.g. Center chest, 5cm below neckline')}
        {field('washTreatment', 'Wash Treatment', 'e.g. Enzyme wash, stone wash', [
          'None',
          'Enzyme wash',
          'Stone wash',
          'Acid wash',
          'Garment dye',
          'Pre-washed',
        ])}
      </div>

      <div className="form-group">
        <label className="form-label">Special Finishes</label>
        <input {...register('specialFinishes')} className="form-input" placeholder="e.g. Silicone coating, Teflon finish, brushed interior" />
      </div>

      <div className="form-group">
        <label className="form-label">Additional Construction Notes</label>
        <textarea {...register('additionalNotes')} className="form-textarea" rows={3} placeholder="Any special construction requirements, quality standards, or factory notes..." />
      </div>

      {isDirty && (
        <button type="submit" className="btn btn-teal btn-sm" style={{ alignSelf: 'flex-end' }}>
          Save Changes
        </button>
      )}
    </form>
  );
};
