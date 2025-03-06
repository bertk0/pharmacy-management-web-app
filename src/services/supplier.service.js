import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/supplier';

export const getSupplier = async (currentPage = 0 , query = '') => {
    try {
        const rowsPerPage = 10;
        const response = await axios.get(`${API_URL}s/`, {
            params: { limit: rowsPerPage, offset: currentPage * rowsPerPage, name: query }
        });
        return response.data;
    } catch (err) {
        throw new Error('Error fetching suppliers: ' + err);
    }
};

export const addSupplier = async (supplier) => {
    try {
        console.log(...supplier);
        await axios.post(API_URL, supplier);
    } catch (err) {
        throw new Error('Error adding supplier: ' + err);
    }
};

export const editSupplier = async (supplierId, supplier) => {
    try {
        await axios.put(`${API_URL}/${supplierId}`, supplier);
    } catch (err) {
        throw new Error('Error editing supplier: ' + err);
    }
};

export const deleteSupplier = async (supplierId) => {
    try {
        await axios.delete(`${API_URL}/${supplierId}`);
    } catch (err) {
        throw new Error('Error deleting supplier: ' + err);
    }
};
