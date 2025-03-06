import { useParams } from 'react-router-dom';
import { getSaleById } from '../services/sale.service';
import { useEffect, useState } from 'react';
import { Button } from '@mui/material';

const DetailSalePage = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [saleData, setSaleData] = useState({
        sale_date: '',
        patient: '',
        doctor: '',
        total_payment: 0,
        status: 1,
      });
    
      const [saleDetail, setSaleDetail] = useState([
        {
          medicine: '',
          price: '',
          quantity: '',
          subtotal: 0,
        },
      ]);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getSaleById(id); 
            const data = response.data;

            // Update saleData
            setSaleData({
                sale_date: data.sale_date,
                patient: data.patient.id,
                doctor: data.doctor.id,
                total_payment: data.total_payment,
                status: data.status,
            });

            // Update saleDetail
            const formattedDetails = data.sale_details.map((detail) => ({
                medicine: detail.medicine.id,
                price: detail.price,
                quantity: detail.quantity,
                subtotal: detail.subtotal,
            }));
            setSaleDetail(formattedDetails);
        } catch (err) {
            setError('Terjadi kesalahan dalam memuat data: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [])

    return (
        <div>
        <h1>Edit Sale {id}</h1>
        <h2>Sale Information:</h2>
        <p>Sale Date: {saleData.sale_date}</p>
        <p>Patient: {saleData.patient}</p>
        <p>Doctor: {saleData.doctor}</p>
        <p>Total Payment: {saleData.total_payment}</p>
        <p>Status: {saleData.status === 1 ? 'Active' : 'Inactive'}</p>

        <h3>Sale Details:</h3>
        <ul>
            {saleDetail.map((detail, index) => (
                <li key={index}>
                    Medicine: {detail.medicine}, Price: {detail.price}, Quantity: {detail.quantity}, Subtotal: {detail.subtotal}
                </li>
            ))}
        </ul>
    </div>
    );
}

export default DetailSalePage;