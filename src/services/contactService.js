// src/services/contactService.js
import axiosInstance from './axiosInstance';

const contactService = {
    /**
     * POST /api/contact/
     * Body: { name, email, subject, message }
     */
    sendContact: (data) =>
        axiosInstance.post('/contact/', data),
};

export default contactService;
