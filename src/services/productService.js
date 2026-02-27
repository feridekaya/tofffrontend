// src/services/productService.js
import axiosInstance from './axiosInstance';

const productService = {
    /**
     * GET /api/products/
     * params: { category_slug, collection_slug, slug, search, ordering, page }
     */
    getProducts: (params = {}) =>
        axiosInstance.get('/products/', { params }),

    /** GET /api/products/?slug={slug} → tek ürün */
    getProductBySlug: (slug) =>
        axiosInstance.get('/products/', { params: { slug } }),

    /** GET /api/categories/ */
    getCategories: () =>
        axiosInstance.get('/categories/'),

    /** GET /api/categories/{slug}/ */
    getCategoryBySlug: (slug) =>
        axiosInstance.get(`/categories/${slug}/`),

    /** GET /api/collections/ */
    getCollections: () =>
        axiosInstance.get('/collections/'),

    /** GET /api/collections/{slug}/ */
    getCollectionBySlug: (slug) =>
        axiosInstance.get(`/collections/${slug}/`),

    /** GET /api/collections/{slug}/products/?page={page} */
    getCollectionProducts: (slug, page = 1) =>
        axiosInstance.get(`/collections/${slug}/products/`, { params: { page } }),

    // ── Admin ──────────────────────────────────────────────────────────────────

    /** POST /api/products/ (admin) */
    createProduct: (data) =>
        axiosInstance.post('/products/', data),

    /** PATCH /api/products/{id}/ (admin) */
    updateProduct: (id, data) =>
        axiosInstance.patch(`/products/${id}/`, data),

    /** DELETE /api/products/{id}/ (admin) */
    deleteProduct: (id) =>
        axiosInstance.delete(`/products/${id}/`),
};

export default productService;
