// src/services/cartService.js
import axiosInstance from './axiosInstance';

const cartService = {
    /** GET /api/cart/ → { id, user, items: [...], total_price } */
    getCart: () =>
        axiosInstance.get('/cart/'),

    /**
     * POST /api/cart/add_item/
     * Body: { product_id, quantity, selected_size_id?, selected_color_id? }
     */
    addItem: (productId, quantity = 1, sizeId = null, colorId = null) =>
        axiosInstance.post('/cart/add_item/', {
            product_id: productId,
            quantity,
            ...(sizeId && { selected_size_id: sizeId }),
            ...(colorId && { selected_color_id: colorId }),
        }),

    /**
     * POST /api/cart/remove_item/
     * Body: { item_id }
     */
    removeItem: (itemId) =>
        axiosInstance.post('/cart/remove_item/', { item_id: itemId }),

    /**
     * POST /api/cart/update_quantity/
     * Body: { item_id, quantity }
     */
    updateQuantity: (itemId, quantity) =>
        axiosInstance.post('/cart/update_quantity/', { item_id: itemId, quantity }),
};

export default cartService;
