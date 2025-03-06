import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/doctor';

export const getDoctor = async (currentPage = 0 , query = '') => {
    try {
        const rowsPerPage = 10;
        const response = await axios.get(`${API_URL}s/`, {
            params: { limit: rowsPerPage, offset: currentPage * rowsPerPage, name: query }
        });
        return response.data;
    } catch (err) {
        throw new Error('Error fetching doctors: ' + err);
    }
};

export const addDoctor = async (doctor) => {
    try {
        console.log(...doctor);
        await axios.post(API_URL, doctor);
    } catch (err) {
        throw new Error('Error adding doctor: ' + err);
    }
};

export const editDoctor = async (doctorId, doctor) => {
    try {
        await axios.put(`${API_URL}/${doctorId}`, doctor);
    } catch (err) {
        throw new Error('Error editing doctor: ' + err);
    }
};

export const deleteDoctor = async (doctorId) => {
    try {
        await axios.delete(`${API_URL}/${doctorId}`);
    } catch (err) {
        throw new Error('Error deleting doctor: ' + err);
    }
};
