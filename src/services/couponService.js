// src/services/couponService.js
import axiosInstance from './axiosInstance';

const couponService = {
    /**
     * POST /api/coupons/validate/ (public)
     * Body: { code }
     * Response: { code, discount_percent, valid_until }
     */
    validateCoupon: (code) =>
        axiosInstance.post('/coupons/validate/', { code }),

    // ── Admin ──────────────────────────────────────────────────────────────────

    /** GET /api/coupons/ (admin) */
    getCoupons: () =>
        axiosInstance.get('/coupons/'),

    /** POST /api/coupons/ (admin) */
    createCoupon: (data) =>
        axiosInstance.post('/coupons/', data),

    /** PATCH /api/coupons/{id}/ (admin) */
    updateCoupon: (id, data) =>
        axiosInstance.patch(`/coupons/${id}/`, data),

    /** DELETE /api/coupons/{id}/ (admin) */
    deleteCoupon: (id) =>
        axiosInstance.delete(`/coupons/${id}/`),
};

export default couponService;
