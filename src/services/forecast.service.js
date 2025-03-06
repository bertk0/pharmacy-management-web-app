import axios from "axios";
export const forecastMedicine = async (data) => {
    try {
        const response = await axios.post('http://127.0.0.1:8000/api/forecast_medicine', data);
        return response.data;
    } catch (err) {
        throw new Error('Error forecast Medicine: ' + err);
    }
};