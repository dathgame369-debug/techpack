import React from 'react';
import type { TechpackStatus } from '../../types/techpack';

interface BadgeProps {
  status: TechpackStatus;
}

const LABELS: Record<TechpackStatus, string> = {
  draft: 'Draft',
  review: 'In Review',
  approved: 'Approved',
  production: 'Production',
};

export const StatusBadge: React.FC<BadgeProps> = ({ status }) => (
  <span className={`badge badge-${status}`}>
    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
    {LABELS[status]}
  </span>
);
