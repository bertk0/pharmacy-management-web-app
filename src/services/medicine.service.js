import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/medicine';

export const getMedicine = async (currentPage = 0 , query = '') => {
    try {
        const rowsPerPage = 10;
        const response = await axios.get('http://127.0.0.1:8000/api/medicines/', {
            params: { limit: rowsPerPage, offset: currentPage * rowsPerPage, name: query }
        });
        return response.data;
    } catch (err) {
        throw new Error('Error fetching medicines: ' + err);
    }
};

export const addMedicine = async (medicine) => {
    try {
        console.log(...medicine);
        await axios.post(API_URL, medicine);
    } catch (err) {
        throw new Error('Error adding medicine: ' + err);
    }
};

export const editMedicine = async (medicineId, medicine) => {
    try {
        await axios.put(`${API_URL}/${medicineId}`, medicine);
    } catch (err) {
        throw new Error('Error editing medicine: ' + err);
    }
};

export const deleteMedicine = async (medicineId) => {
    try {
        await axios.delete(`${API_URL}/${medicineId}`);
    } catch (err) {
        throw new Error('Error deleting medicine: ' + err);
    }
};
