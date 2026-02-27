// src/context/UIContext.js
import React, { createContext, useContext, useReducer, useCallback } from 'react';

const UIContext = createContext(null);

// ─── Toast Reducer ─────────────────────────────────────────────────────────────
function toastReducer(state, action) {
    switch (action.type) {
        case 'ADD':
            return [...state, { id: action.payload.id, message: action.payload.message, type: action.payload.type }];
        case 'REMOVE':
            return state.filter(t => t.id !== action.payload.id);
        default:
            return state;
    }
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function UIProvider({ children }) {
    const [toasts, dispatch] = useReducer(toastReducer, []);

    /**
     * Toast göster.
     * @param {string} message
     * @param {'success'|'error'|'info'|'warning'} type
     * @param {number} duration ms cinsinden, varsayılan 3000
     */
    const showToast = useCallback((message, type = 'info', duration = 3000) => {
        const id = Date.now() + Math.random();
        dispatch({ type: 'ADD', payload: { id, message, type } });
        setTimeout(() => dispatch({ type: 'REMOVE', payload: { id } }), duration);
    }, []);

    const removeToast = useCallback((id) => {
        dispatch({ type: 'REMOVE', payload: { id } });
    }, []);

    return (
        <UIContext.Provider value={{ toasts, showToast, removeToast }}>
            {children}
        </UIContext.Provider>
    );
}

export const useUI = () => {
    const ctx = useContext(UIContext);
    if (!ctx) throw new Error('useUI must be used inside UIProvider');
    return ctx;
};
