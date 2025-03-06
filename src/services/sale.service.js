import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/sale';


export const getSale = async (currentPage = 0 , query = '') => {
    try {
        const rowsPerPage = 10;
        const response = await axios.get(`${API_URL}s/`, {
            params: { limit: rowsPerPage, offset: currentPage * rowsPerPage, sale_invoice: query }
        });
        return response.data;
    } catch (err) {
        throw new Error('Error fetching sales: ' + err);
    }
};

export const addSale = async (data) => {
    try {
        const response = await axios.post(API_URL, data);
        // return response.data;
      } catch (err) {
        // Here we throw the error with the response to propagate it to the component
        if (err.response) {
          throw err.response;  // Return the full error response
        }
        throw new Error('Error adding sale : ' + err);
      }
};


export const deleteSale = async (saleId) => {
    try {
        await axios.delete(`${API_URL}/${saleId}`);
    } catch (err) {
        throw new Error('Error deleting sale: ' + err);
    }
};


export const getSaleById = async (saleId) => {
    try {
        const response = await axios.get(`${API_URL}/${saleId}`)
        return response.data;
    } catch (err) {
        throw new Error('Error fetching sales: ' + err);
    }
}

export const editSale = async (saleId, data) => {
    try {
        const response = await axios.put(`${API_URL}/${saleId}`, data);
        
      } catch (err) {
        // Here we throw the error with the response to propagate it to the component
        if (err.response) {
          throw err.response;  // Return the full error response
        }
        throw new Error('Error edit sale : ' + err);
      }
};

