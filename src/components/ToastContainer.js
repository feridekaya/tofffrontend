// src/components/ToastContainer.js
import React from 'react';
import { useUI } from '../context/UIContext';
import './ToastContainer.css';

const ICONS = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠',
};

function Toast({ toast, onRemove }) {
    return (
        <div
            className={`toast ${toast.type}`}
            onClick={() => onRemove(toast.id)}
            role="alert"
        >
            <span className="toast-icon">{ICONS[toast.type] || 'ℹ'}</span>
            <span className="toast-message">{toast.message}</span>
            <span className="toast-close">✕</span>
        </div>
    );
}

/**
 * Global toast container — App.js içine bir kez eklenir.
 * UIContext'ten toast listesini okur.
 */
function ToastContainer() {
    const { toasts, removeToast } = useUI();

    if (toasts.length === 0) return null;

    return (
        <div className="toast-wrapper" aria-live="polite">
            {toasts.map(toast => (
                <Toast key={toast.id} toast={toast} onRemove={removeToast} />
            ))}
        </div>
    );
}

export default ToastContainer;
