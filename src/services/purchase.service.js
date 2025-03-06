import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/purchase';


export const getPurchase = async (currentPage = 0 , query = '') => {
    try {
        const rowsPerPage = 10;
        const response = await axios.get(`${API_URL}s/`, {
            params: { limit: rowsPerPage, offset: currentPage * rowsPerPage, purchase_invoice: query }
        });
        return response.data;
    } catch (err) {
        throw new Error('Error fetching purchases: ' + err);
    }
};

export const addPurchase = async (data) => {
    try {
        const response = await axios.post(API_URL, data);
      } catch (err) {
        if (err.response) {
          throw err.response;  
        }
        throw new Error('Error adding purchase : ' + err);
      }
};

export const getPurchaseById = async (purchaseId) => {
    try {
        const response = await axios.get(`${API_URL}/${purchaseId}`)
        return response.data;
    } catch (err) {
        throw new Error('Error fetching sales: ' + err);
    }
}

export const editPurchase = async (purchaseId, data) => {
    try {
        const response = await axios.put(`${API_URL}/${purchaseId}`, data);
        
      } catch (err) {
        if (err.response) {
          throw err.response;  
        }
        throw new Error('Error edit purchase : ' + err);
      }
};


export const deletePurchase = async (purchaseId) => {
    try {
        await axios.delete(`${API_URL}/${purchaseId}`);
    } catch (err) {
        throw new Error('Error deleting purchase: ' + err);
    }
};




