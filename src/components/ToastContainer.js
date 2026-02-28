// src/components/ToastContainer.js
import React from 'react';
import { useUI } from '../context/UIContext';

const TYPE_STYLES = {
    success: 'bg-green-900/80 border-green-600/50 text-green-300',
    error: 'bg-red-900/80  border-red-600/50  text-red-300',
    warning: 'bg-yellow-900/80 border-yellow-600/50 text-yellow-300',
    info: 'bg-toff-bg-2 border-toff-border text-toff-muted',
};

const ICONS = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };

function Toast({ toast, onRemove }) {
    return (
        <div
            role="alert"
            onClick={() => onRemove(toast.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-sm shadow-lg cursor-pointer animate-fade-up text-sm font-medium max-w-sm ${TYPE_STYLES[toast.type] || TYPE_STYLES.info}`}
        >
            <span className="text-base font-bold shrink-0">{ICONS[toast.type] || 'ℹ'}</span>
            <span className="flex-1">{toast.message}</span>
            <span className="text-current opacity-50 hover:opacity-100 transition-opacity text-xs">✕</span>
        </div>
    );
}

function ToastContainer() {
    const { toasts, removeToast } = useUI();
    if (toasts.length === 0) return null;

    return (
        <div
            className="fixed bottom-6 right-4 sm:right-6 z-[9999] flex flex-col gap-2"
            aria-live="polite"
        >
            {toasts.map(toast => (
                <Toast key={toast.id} toast={toast} onRemove={removeToast} />
            ))}
        </div>
    );
}

export default ToastContainer;
