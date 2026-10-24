import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className={`toast toast-${type}`}>
      {type === 'success' && <CheckCircle2 size={20} />}
      {type === 'error' && <AlertCircle size={20} />}
      {type === 'info' && <Info size={20} />}
      <span>{message}</span>
      <button 
        onClick={onClose}
        style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', marginLeft: '0.5rem', display: 'flex' }}
      >
        <X size={16} />
      </button>
    </div>
  );
}
