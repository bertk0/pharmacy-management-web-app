import axios from 'axios';

export const getTotalSales = async () => {
    try {
        const response = await axios.get('http://127.0.0.1:8000/api/total-sales')
        return response.data;
    } catch (err) {
        throw new Error('Error fetching total sales: ' + err);
    }
};


export const getTotalPurchases = async () => {
    try {
        const response = await axios.get('http://127.0.0.1:8000/api/total-purchases')
        return response.data;
    } catch (err) {
        throw new Error('Error fetching total purchases: ' + err);
    }
};



