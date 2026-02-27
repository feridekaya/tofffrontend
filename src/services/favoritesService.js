// src/services/favoritesService.js
import axiosInstance from './axiosInstance';

const favoritesService = {
    /** GET /api/favorites/ → [{ id, product: {...} }] */
    getFavorites: () =>
        axiosInstance.get('/favorites/'),

    /** POST /api/favorites/ — Body: { product: productId } */
    addFavorite: (productId) =>
        axiosInstance.post('/favorites/', { product: productId }),

    /** DELETE /api/favorites/{id}/ */
    removeFavorite: (favoriteId) =>
        axiosInstance.delete(`/favorites/${favoriteId}/`),
};

export default favoritesService;
