// src/services/addressService.js
import axiosInstance from './axiosInstance';

const addressService = {
    /** GET /api/addresses/ */
    getAddresses: () =>
        axiosInstance.get('/addresses/'),

    /** POST /api/addresses/ */
    addAddress: (data) =>
        axiosInstance.post('/addresses/', data),

    /** PUT /api/addresses/{id}/ */
    updateAddress: (id, data) =>
        axiosInstance.put(`/addresses/${id}/`, data),

    /** DELETE /api/addresses/{id}/ */
    deleteAddress: (id) =>
        axiosInstance.delete(`/addresses/${id}/`),
};

export default addressService;
