import React from 'react';
import { X } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';

interface ModalProps {
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: string;
  onClose?: () => void;
}

export const Modal: React.FC<ModalProps> = ({ title, children, footer, maxWidth = '540px', onClose }) => {
  const closeModal = useUIStore(s => s.closeModal);
  const handleClose = onClose ?? closeModal;

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && handleClose()}>
      <div className="modal-box" style={{ maxWidth }}>
        <div className="modal-header">
          <h2 className="text-h3">{title}</h2>
          <button className="btn btn-ghost btn-icon" onClick={handleClose}>
            <X size={18} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
};
