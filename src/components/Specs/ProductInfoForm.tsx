import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTechpackStore } from '../../store/useTechpackStore';
import type { ProductInfo } from '../../types/techpack';

const schema = z.object({
  styleName:    z.string().min(1, 'Style name is required'),
  styleNumber:  z.string().optional(),
  designerName: z.string().optional(),
  season:       z.string().optional(),
  fitBlock:     z.string().optional(),
  targetMarket: z.string().optional(),
  designNotes:  z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export const ProductInfoForm: React.FC = () => {
  const { getActiveTechpack, updateProductInfo } = useTechpackStore();
  const tp = getActiveTechpack();
  const info = tp?.specs.productInfo;

  const { register, handleSubmit, formState: { errors, isDirty }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: info ?? {},
  });

  const onSubmit = (data: FormData) => {
    updateProductInfo(data as Partial<ProductInfo>);
    reset(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-3)' }}>
        <div className="form-group">
          <label className="form-label">Style Name *</label>
          <input {...register('styleName')} className="form-input" placeholder="Classic Crew Neck" />
          {errors.styleName && <span className="form-error">{errors.styleName.message}</span>}
        </div>
        <div className="form-group">
          <label className="form-label">Style Number</label>
          <input {...register('styleNumber')} className="form-input" placeholder="SS24-001" />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-3)' }}>
        <div className="form-group">
          <label className="form-label">Designer</label>
          <input {...register('designerName')} className="form-input" placeholder="Jane Smith" />
        </div>
        <div className="form-group">
          <label className="form-label">Season</label>
          <input {...register('season')} className="form-input" placeholder="SS2024" />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-3)' }}>
        <div className="form-group">
          <label className="form-label">Fit Block</label>
          <select {...register('fitBlock')} className="form-select">
            <option value="">Select fit</option>
            <option>Relaxed</option>
            <option>Regular</option>
            <option>Slim</option>
            <option>Oversized</option>
            <option>Fitted</option>
            <option>Boxy</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Target Market</label>
          <select {...register('targetMarket')} className="form-select">
            <option value="">Select</option>
            <option>Men's</option>
            <option>Women's</option>
            <option>Unisex</option>
            <option>Kids</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Design Notes</label>
        <textarea {...register('designNotes')} className="form-textarea" placeholder="Key design details, inspiration, references..." rows={3} />
      </div>

      {isDirty && (
        <button type="submit" className="btn btn-teal btn-sm" style={{ alignSelf: 'flex-end' }}>
          Save Changes
        </button>
      )}
    </form>
  );
};
