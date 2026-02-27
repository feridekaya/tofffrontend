// src/services/authService.js
import axiosInstance from './axiosInstance';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

const authService = {
    /** POST /api/token/ → { access, refresh } */
    login: (email, password) =>
        axios.post(`${API_BASE_URL}/api/token/`, { username: email, password }),

    /** POST /api/register/ */
    register: (data) =>
        axios.post(`${API_BASE_URL}/api/register/`, data),

    /** POST /api/auth/logout/ → refresh token blacklist */
    logout: (refresh) =>
        axiosInstance.post('/auth/logout/', { refresh }),

    /** POST /api/auth/forgot-password/ */
    forgotPassword: (email) =>
        axiosInstance.post('/auth/forgot-password/', { email }),

    /** GET /api/user/ → profil bilgisi */
    getUserProfile: () =>
        axiosInstance.get('/user/'),

    /** PATCH /api/user/ → profil güncelle */
    updateUserProfile: (data) =>
        axiosInstance.patch('/user/', data),

    /** PUT /api/change-password/ */
    changePassword: (oldPassword, newPassword) =>
        axiosInstance.put('/change-password/', {
            old_password: oldPassword,
            new_password: newPassword,
        }),

    /** POST /api/auth/reset-password-confirm/{uid}/{token}/ */
    resetPasswordConfirm: (uid, token, newPassword, newPasswordConfirm) =>
        axios.post(`${API_BASE_URL}/api/auth/reset-password-confirm/${uid}/${token}/`, {
            new_password: newPassword,
            new_password_confirm: newPasswordConfirm
        }),
};

export default authService;
