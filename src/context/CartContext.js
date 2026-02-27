// src/context/CartContext.js
import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import cartService from '../services/cartService';
import favoritesService from '../services/favoritesService';

// ─── Action Types ──────────────────────────────────────────────────────────────
export const CART_ACTIONS = {
    SET: 'CART_SET',
    ADD: 'CART_ADD',
    REMOVE: 'CART_REMOVE',
    UPDATE: 'CART_UPDATE',
    CLEAR: 'CART_CLEAR',
};

export const FAV_ACTIONS = {
    SET: 'FAV_SET',
    ADD: 'FAV_ADD',
    REMOVE: 'FAV_REMOVE',
    CLEAR: 'FAV_CLEAR',
};

// ─── Reducers ──────────────────────────────────────────────────────────────────
function cartReducer(state, action) {
    switch (action.type) {
        case CART_ACTIONS.SET:
            return action.payload;

        case CART_ACTIONS.ADD: {
            const { product } = action.payload;
            const existing = state.find(
                item =>
                    item.product.id === product.id &&
                    item.selectedSize?.id === product.selectedSize?.id &&
                    item.selectedColor?.id === product.selectedColor?.id
            );
            if (existing) {
                return state.map(item =>
                    item === existing ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...state, {
                cartId: Date.now(),
                product: { ...product },
                quantity: 1,
                selectedSize: product.selectedSize || null,
                selectedColor: product.selectedColor || null,
                price: product.price,
            }];
        }

        case CART_ACTIONS.REMOVE:
            return state.filter(item => item.cartId !== action.payload.cartId);

        case CART_ACTIONS.UPDATE:
            return state.map(item =>
                item.cartId === action.payload.cartId
                    ? { ...item, quantity: action.payload.quantity }
                    : item
            );

        case CART_ACTIONS.CLEAR:
            return [];

        default:
            return state;
    }
}

function favoritesReducer(state, action) {
    switch (action.type) {
        case FAV_ACTIONS.SET:
            return action.payload;
        case FAV_ACTIONS.ADD:
            return [...state, action.payload];
        case FAV_ACTIONS.REMOVE:
            return state.filter(f => f.id !== action.payload.id);
        case FAV_ACTIONS.CLEAR:
            return [];
        default:
            return state;
    }
}

// ─── Context ───────────────────────────────────────────────────────────────────
const CartContext = createContext(null);

export function CartProvider({ children, authTokens }) {
    const [cart, dispatchCart] = useReducer(cartReducer, []);
    const [favorites, dispatchFavorites] = useReducer(favoritesReducer, []);

    // ── Normalize backend cart response ──
    const normalizeCartItems = (data) => {
        const items = data.items || data;
        return (Array.isArray(items) ? items : []).map(item => ({
            cartId: item.id,
            product: item.product,
            quantity: item.quantity,
            selectedSize: item.selected_size ? { id: item.selected_size_id, name: item.selected_size } : null,
            selectedColor: item.selected_color ? { id: item.selected_color_id, name: item.selected_color } : null,
            price: item.price || item.product?.price,
        }));
    };

    // ── Fetch from backend ──
    const fetchCart = useCallback(async () => {
        try {
            const res = await cartService.getCart();
            dispatchCart({ type: CART_ACTIONS.SET, payload: normalizeCartItems(res.data) });
        } catch (err) {
            console.error('Sepet yüklenemedi:', err);
        }
    }, []);

    const fetchFavorites = useCallback(async () => {
        try {
            const res = await favoritesService.getFavorites();
            dispatchFavorites({ type: FAV_ACTIONS.SET, payload: res.data });
        } catch (err) {
            console.error('Favoriler yüklenemedi:', err);
        }
    }, []);

    // Auth değişince yenile
    useEffect(() => {
        if (authTokens?.access) {
            fetchCart();
            fetchFavorites();
        } else {
            dispatchCart({ type: CART_ACTIONS.CLEAR });
            dispatchFavorites({ type: FAV_ACTIONS.CLEAR });
        }
    }, [authTokens, fetchCart, fetchFavorites]);

    // ── Cart actions ──
    const addToCart = async (product) => {
        // Optimistic update (misafir + giriş yapmış)
        dispatchCart({ type: CART_ACTIONS.ADD, payload: { product } });

        if (authTokens) {
            try {
                await cartService.addItem(
                    product.id,
                    1,
                    product.selectedSize?.id || null,
                    product.selectedColor?.id || null,
                );
                // Senkronize et
                await fetchCart();
            } catch (err) {
                console.error('Sepete eklenemedi:', err);
                // Hata: optimistic güncellemeyi geri al
                dispatchCart({ type: CART_ACTIONS.REMOVE, payload: { cartId: product.id } });
            }
        }
    };

    const removeFromCart = async (cartId) => {
        dispatchCart({ type: CART_ACTIONS.REMOVE, payload: { cartId } });
        if (authTokens) {
            try { await cartService.removeItem(cartId); }
            catch (err) { console.error('Sepetten kaldırılamadı:', err); await fetchCart(); }
        }
    };

    const updateCartQuantity = async (cartId, quantity) => {
        dispatchCart({ type: CART_ACTIONS.UPDATE, payload: { cartId, quantity } });
        if (authTokens) {
            try { await cartService.updateQuantity(cartId, quantity); }
            catch (err) { console.error('Miktar güncellenemedi:', err); await fetchCart(); }
        }
    };

    const clearCart = () => dispatchCart({ type: CART_ACTIONS.CLEAR });

    // ── Favorites actions ──
    const toggleFavorite = async (productId, onNeedLogin) => {
        if (!authTokens) {
            if (onNeedLogin) onNeedLogin();
            return;
        }
        const existing = favorites.find(f => f.product?.id === productId || f.product === productId);
        if (existing) {
            dispatchFavorites({ type: FAV_ACTIONS.REMOVE, payload: { id: existing.id } });
            try { await favoritesService.removeFavorite(existing.id); }
            catch (err) { console.error('Favori silinemedi:', err); await fetchFavorites(); }
        } else {
            try {
                const res = await favoritesService.addFavorite(productId);
                dispatchFavorites({ type: FAV_ACTIONS.ADD, payload: res.data });
            } catch (err) { console.error('Favori eklenemedi:', err); }
        }
    };

    // ── Computed values ──
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartTotal = cart.reduce((sum, item) => sum + (parseFloat(item.price || item.product?.price || 0) * item.quantity), 0);

    const value = {
        cart, cartCount, cartTotal,
        favorites,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        toggleFavorite,
        fetchCart,
        fetchFavorites,
        // Backward compat aliases
        setCart: (items) => dispatchCart({ type: CART_ACTIONS.SET, payload: items }),
        handleAddToCart: addToCart,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used inside CartProvider');
    return ctx;
};
