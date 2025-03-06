import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/patient';

export const getPatient = async (currentPage = 0 , query = '') => {
    try {
        const rowsPerPage = 10;
        const response = await axios.get(`${API_URL}s/`, {
            params: { limit: rowsPerPage, offset: currentPage * rowsPerPage, name: query }
        });
        return response.data;
    } catch (err) {
        throw new Error('Error fetching patients: ' + err);
    }
};

export const addPatient = async (patient) => {
    try {
        console.log(...patient);
        await axios.post(API_URL, patient);
    } catch (err) {
        throw new Error('Error adding patient: ' + err);
    }
};

export const editPatient = async (patientId, patient) => {
    try {
        await axios.put(`${API_URL}/${patientId}`, patient);
    } catch (err) {
        throw new Error('Error editing patient: ' + err);
    }
};

export const deletePatient = async (patientId) => {
    try {
        await axios.delete(`${API_URL}/${patientId}`);
    } catch (err) {
        throw new Error('Error deleting patient: ' + err);
    }
};
