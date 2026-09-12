import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Info, AlertTriangle } from 'lucide-react';

export default function Toast() {
  const { toast } = useApp();

  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 className="text-emerald-400" size={20} />;
      case 'warning':
        return <AlertTriangle className="text-amber-400" size={20} />;
      default:
        return <Info className="text-indigo-400" size={20} />;
    }
  };

  return (
    <div className="toast-container">
      <div className={`toast-item ${toast.type}`}>
        {getIcon()}
        <span>{toast.message}</span>
      </div>
    </div>
  );
}
