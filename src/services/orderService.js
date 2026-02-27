// src/services/orderService.js
import axiosInstance from './axiosInstance';

const orderService = {
    /**
     * POST /api/orders/create/ (public — kupon + iyzico destekli)
     * Body: {
     *   full_name, address, city, zip_code?, phone,
     *   cart_items: [{ product: { id }, quantity, selectedSize?, selectedColor? }],
     *   coupon_code?, customer_note?, card_info?
     * }
     */
    createOrder: (orderData) =>
        axiosInstance.post('/orders/create/', orderData),

    /** GET /api/orders/ → kullanıcı kendi siparişlerini, admin hepsini görür */
    getOrders: () =>
        axiosInstance.get('/orders/'),

    /** GET /api/orders/{id}/ */
    getOrderDetail: (id) =>
        axiosInstance.get(`/orders/${id}/`),

    /**
     * PATCH /api/orders/{id}/update_status/ (admin)
     * Body: { status, tracking_number? }
     */
    updateOrderStatus: (id, newStatus, trackingNumber = null) =>
        axiosInstance.patch(`/orders/${id}/update_status/`, {
            status: newStatus,
            ...(trackingNumber && { tracking_number: trackingNumber }),
        }),

    /** DELETE /api/orders/{id}/ (admin) */
    deleteOrder: (id) =>
        axiosInstance.delete(`/orders/${id}/`),
};

export default orderService;
