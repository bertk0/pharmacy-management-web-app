import { useParams } from 'react-router-dom';
import { getSaleById } from '../services/sale.service';
import { useEffect, useState } from 'react';
import { TextField, Button, Grid, Box, Typography, IconButton, CircularProgress, Snackbar, Alert, Autocomplete } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { editSale } from '../services/sale.service';


const EditSalePage = () => {
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


    const [notification, setNotification] = useState({
        open: false,
        message: '',
        severity: 'success', // 'success' or 'error'
    });

    const showNotification = (message, severity = 'success') => {
        setNotification({ open: true, message, severity });
        setTimeout(() => {
            setNotification({ ...notification, open: false });
        }, 3000); // Tutup notifikasi setelah 3 detik
    };


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


            setPatientQuery(data.patient.name)
            setDoctorQuery(data.doctor.name)


            // Set queries for medicines
            const medicineQueries = data.sale_details.reduce((acc, detail, index) => {
                acc[index] = detail.medicine.name; // Menggunakan nama obat
                return acc;
            }, {});
            setQueries(medicineQueries); // Set state queries

        } catch (err) {
            setError('Terjadi kesalahan dalam memuat data: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [])

    // <==========Patient=============>
    const [patientData, setPatientData] = useState({
        patients: [], // Menyimpan daftar dokter
        isLoading: false, // Menandakan proses pemuatan
        offset: 0, // Offset data untuk pagination
        hasMore: true, // Menentukan apakah masih ada data yang dapat dimuat
    });
    const [patientQuery, setPatientQuery] = useState('');

    const fetchPatients = async (name = '', newOffset = 0) => {
        setPatientData((prev) => ({ ...prev, isLoading: true }));
        try {
            const response = await axios.get(
                `http://127.0.0.1:8000/api/patients/?limit=10&offset=${newOffset}&name=${name}`
            );
            if (response.data.results && response.data.results.length > 0) {
                setPatientData((prev) => ({
                    ...prev,
                    patients: newOffset === 0 ? response.data.results : [...prev.patients, ...response.data.results],
                    offset: newOffset,
                    hasMore: response.data.results.length === 10, // Apakah masih ada lebih banyak data
                    isLoading: false,
                }));
            } else {
                setPatientData((prev) => ({ ...prev, hasMore: false, isLoading: false }));
            }
        } catch (error) {
            console.error('Error fetching patient:', error);
            setPatientData((prev) => ({ ...prev, isLoading: false }));
        }
    };

    const handleScrollPatient = (event) => {
        const { scrollTop, scrollHeight, clientHeight } = event.target;
        if (scrollHeight - scrollTop === clientHeight && patientData.hasMore && !patientData.isLoading) {
            const newOffset = patientData.offset + 10;
            fetchPatients(patientQuery, newOffset);
        }
    };
    // <==========Patient=============>

    // <==========Doctor=============>
    const [doctorData, setDoctorData] = useState({
        doctors: [], // Menyimpan daftar dokter
        isLoading: false, // Menandakan proses pemuatan
        offset: 0, // Offset data untuk pagination
        hasMore: true, // Menentukan apakah masih ada data yang dapat dimuat
    });
    const [doctorQuery, setDoctorQuery] = useState('');

    const fetchDoctors = async (name = '', newOffset = 0) => {
        setDoctorData((prev) => ({ ...prev, isLoading: true }));
        try {
            const response = await axios.get(
                `http://127.0.0.1:8000/api/doctors/?limit=10&offset=${newOffset}&name=${name}`
            );
            if (response.data.results && response.data.results.length > 0) {
                setDoctorData((prev) => ({
                    ...prev,
                    doctors: newOffset === 0 ? response.data.results : [...prev.doctors, ...response.data.results],
                    offset: newOffset,
                    hasMore: response.data.results.length === 10, // Apakah masih ada lebih banyak data
                    isLoading: false,
                }));
            } else {
                setDoctorData((prev) => ({ ...prev, hasMore: false, isLoading: false }));
            }
        } catch (error) {
            console.error('Error fetching doctors:', error);
            setDoctorData((prev) => ({ ...prev, isLoading: false }));
        }
    };

    const handleScrollDoctor = (event) => {
        const { scrollTop, scrollHeight, clientHeight } = event.target;
        if (scrollHeight - scrollTop === clientHeight && doctorData.hasMore && !doctorData.isLoading) {
            const newOffset = doctorData.offset + 10;
            fetchDoctors(doctorQuery, newOffset);
        }
    };
    // <==========Doctor=============>

    // <==========Medicine=============>
    const [medicines, setMedicines] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [query, setQuery] = useState('');
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    // State to manage input text for each row (menampung nama medicine untuk value autocomplete)
    const [queries, setQueries] = useState({});

    const handleQueryChange = (index, value) => {
        setQueries((prev) => ({
            ...prev,
            [index]: value,
        }));
    };

    const normalizeQueries = (queries) => {
        const keys = Object.keys(queries); // Ambil semua key (indeks)
        return keys.reduce((newQueries, key, i) => {
            newQueries[i] = queries[key]; // Assign ulang secara berurutan
            return newQueries;
        }, {});
    };


    const fetchMedicines = async (name = '', newOffset = 0) => {
        setIsLoading(true);
        try {
            const response = await axios.get(`
            http://127.0.0.1:8000/api/medicines/?limit=10&offset=${newOffset}&name=${name}`
            );
            if (response.data.results && response.data.results.length > 0) {
                setMedicines((prev) => (newOffset === 0 ? response.data.results : [...prev, ...response.data.results]));
                setHasMore(response.data.results.length === 10); // Cek apakah ada lebih banyak data
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error('Error fetching medicines:', error);
        } finally {
            setIsLoading(false);
        }
    };


    // Fungsi untuk menangani scroll Medicine
    const handleScroll = (event) => {
        const { scrollTop, scrollHeight, clientHeight } = event.target;
        if (scrollHeight - scrollTop === clientHeight && hasMore && !isLoading) {
            const newOffset = offset + 10;
            setOffset(newOffset);
            fetchMedicines(query, newOffset);
        }
    };

    // Fungsi untuk menangani pemilihan obat
    const handleSelectMedicine = (medicine, index) => {
        setSaleDetail((prevDetail) => {
            const updatedDetail = [...prevDetail];
            updatedDetail[index].medicine = medicine.id; // Nama obat
            updatedDetail[index].price = medicine.sell_price; // Harga obat dari API
            updatedDetail[index].subtotal = medicine.sell_price * (updatedDetail[index].quantity || 0); // Hitung subtotal
            return updatedDetail;
        });
        console.log(saleDetail);
        // Update query for the selected option
        handleQueryChange(index, medicine.name);
    };
    // <==========Medicine=============>


    // Fungsi untuk menambah item penjualan
    const addSaleItem = () => {
        setSaleDetail([
            ...saleDetail,
            {
                medicine: '',
                price: '',
                quantity: '',
                subtotal: 0,
            },
        ]);
    };

    // menangani perubahan input sale
    const handleInputChange = (input) => {
        if (input.target) {
            // Untuk input berbasis event (seperti TextField)
            const { name, value } = input.target;
            setSaleData((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        } else {
            // Untuk input langsung (seperti DatePicker)
            const { name, value } = input;
            setSaleData((prevState) => ({
                ...prevState,
                [name]: value ? value.format('YYYY-MM-DD') : '', // Simpan dalam format string
            }));
        }
    };

    // menangani perubahan input sale detail 
    const handleInputDetailChange = (e, index) => {
        const { name, value } = e.target;

        setSaleDetail((prevDetail) => {
            const updatedDetail = [...prevDetail];

            updatedDetail[index] = {
                ...updatedDetail[index],
                [name]: name === 'quantity' ? parseInt(value) || 0 : value, // Konversi ke angka jika 'quantity'
            };

            // Jika 'price' atau 'quantity' berubah, hitung ulang subtotal
            if (name === 'price' || name === 'quantity') {
                const price = parseFloat(updatedDetail[index].price) || 0; // Konversi ke angka
                const quantity = updatedDetail[index].quantity; // Sudah berupa angka
                updatedDetail[index].subtotal = price * quantity; // Hitung subtotal
            }

            console.log(updatedDetail); // Debugging untuk memastikan perubahan
            return updatedDetail;
        });
    };

    // Fungsi untuk menghapus item
    const handleDeleteItem = (index) => {
        const updatedSaleDetail = saleDetail.filter((_, i) => i !== index);
        setSaleDetail(updatedSaleDetail);
    };

    // Fungsi untuk menangani form submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        // const totalPayment = saleDetail.reduce((total, item) => total + item.subtotal, 0);
        const totalPayment = saleDetail.reduce(
            (total, item) => total + parseFloat(item.subtotal),
            0
        );


        const postData = {
            sale: {
                sale_date: saleData.sale_date,
                patient: saleData.patient,
                doctor: saleData.doctor,
                total_payment: totalPayment,
                status: saleData.status
            },
            sale_detail: saleDetail,
        };

        console.log('Data yang akan dikirim:', postData);

        try {
            await editSale(id, postData);
            showNotification('Data Sale berhasil diperbarui!', 'success');

            //   setSaleData({
            //     sale_date: '',
            //     patient: '',
            //     doctor: '',
            //     total_payment: 0,
            //     status: 1,
            //   });

            //   setSaleDetail([
            //     {
            //       medicine: '',
            //       price: '',
            //       quantity: '',
            //       subtotal: 0,
            //     },
            //   ])

            //   useEffect(() => {
            //     setDoctorData({
            //       doctors: [],
            //       isLoading: false,
            //       offset: 0,
            //       hasMore: true,
            //     });

            //     setPatientData({
            //       patients: [],
            //       isLoading: false,
            //       offset: 0,
            //       hasMore: true,
            //     });

            //     setMedicines([]);
            //   }, []);

        } catch (err) {
            // If error response exists, show the error message from the server
            if (err.data && err.data.error) {
                showNotification(err.data.error, 'error');
            }

        }

    };

    return (
        <section className='card'>
            <Box sx={{ padding: 3 }}>
                <Typography variant="h4" gutterBottom>Edit Penjualan</Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="Tanggal Penjualan"
                                    value={saleData.sale_date ? dayjs(saleData.sale_date) : null}
                                    onChange={(newValue) => handleInputChange({ name: 'sale_date', value: newValue })}
                                    format="DD/MM/YYYY"
                                    sx={{ width: '100%' }}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Autocomplete
                                freeSolo
                                key={saleData.patient || 'default'}
                                options={patientData.patients}
                                getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)} // ditampilkan pada field
                                // value={
                                //     patientData.patients?.length > 0 && saleData.patient
                                //         ? patientData.patients.find((patient) => patient.id === saleData.patient) || null
                                //         : null
                                // }

                                value={patientQuery ? { name: patientQuery } : null} // Allows free input by setting a custom object
                                renderOption={(props, option) => (
                                    <li {...props} key={`${option.id}-${uuidv4()}`}>
                                        {option.name}
                                    </li>
                                )} // ditampilkan pada dropdown
                                loading={patientData.isLoading}
                                onInputChange={(e, value) => {
                                    setPatientQuery(value);
                                    setPatientData((prevPatientData) => ({
                                        ...prevPatientData, // Salin nilai sebelumnya
                                        offset: 0,
                                    }));
                                    fetchPatients(value, 0);
                                }} // Menangkap perubahan pada input textfield

                                onChange={(e, value) => {
                                    if (value) {
                                        // Jika item dipilih
                                        setSaleData((prevState) => ({
                                            ...prevState,
                                            patient: value.id,
                                        }));
                                    } else {
                                        // Jika tombol "X" diklik (value === null)
                                        setSaleData((prevState) => ({
                                            ...prevState,
                                            patient: '',
                                        }));
                                    }


                                }}
                                // Menangkap perubahan pada dropdown (Memilih item dari daftar opsi dropdown.)
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        required
                                        label="Nama Pasien"
                                        onFocus={() => { fetchPatients('', 0); }}
                                        onChange={(e) => {
                                            // Update the doctorQuery while typing
                                            setPatientQuery(e.target.value);
                                        }}
                                        InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                                <>
                                                    {isLoading ? <CircularProgress size={20} /> : null}
                                                    {params.InputProps.endAdornment}
                                                </>
                                            ),
                                        }}

                                    // onKeyDown={(event) => {
                                    //     if (event.key === 'Backspace') {
                                    //       // Jika Backspace ditekan, kosongkan nilai
                                    //         setSaleData((prevState) => ({
                                    //           ...prevState,
                                    //           patient: '', // Kosongkan ID pasien
                                    //         }));
                                    //       // Mencegah event Backspace agar tidak mempengaruhi input
                                    //       event.stopPropagation();
                                    //     }
                                    //   }}
                                    />
                                )}
                                ListboxProps={{
                                    onScroll: handleScrollPatient,
                                    style: { maxHeight: '200px', overflow: 'auto' },
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Autocomplete
                                freeSolo
                                key={saleData.doctor || 'default'}
                                options={doctorData.doctors}
                                getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)} // ditampilkan pada field
                                // value={
                                //     doctorData.doctors?.length > 0 && saleData.doctor
                                //         ? doctorData.doctors.find((doctor) => doctor.id === saleData.doctor) || null
                                //         : null
                                // }
                                value={doctorQuery ? { name: doctorQuery } : null}
                                renderOption={(props, option) => (
                                    <li {...props} key={`${option.id}-${uuidv4()}`}>
                                        {option.name}
                                    </li>
                                )} // ditampilkan pada dropdown
                                loading={doctorData.isLoading}
                                onInputChange={(e, value) => {
                                    setDoctorQuery(value);
                                    setDoctorData((prevDoctorData) => ({
                                        ...prevDoctorData, // Salin nilai sebelumnya
                                        offset: 0,
                                    }));
                                    fetchDoctors(value, 0);
                                }} // Menangkap perubahan pada input textfield

                                onChange={(e, value) => {
                                    if (value) {
                                        // Jika item dipilih
                                        setSaleData((prevState) => ({
                                            ...prevState,
                                            doctor: value.id,
                                        }));
                                    } else {
                                        // Jika tombol "X" diklik (value === null)
                                        setSaleData((prevState) => ({
                                            ...prevState,
                                            doctor: '',
                                        }));
                                    }
                                }}
                                // Menangkap perubahan pada dropdown (Memilih item dari daftar opsi dropdown.)
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        required
                                        label="Nama Dokter"
                                        onFocus={() => { fetchDoctors('', 0); }}
                                        onChange={(e) => {
                                            // Update the `doctorQuery` as the user types
                                            setDoctorQuery(e.target.value);
                                        }}
                                        InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                                <>
                                                    {isLoading ? <CircularProgress size={20} /> : null}
                                                    {params.InputProps.endAdornment}
                                                </>
                                            ),
                                        }}
                                    />
                                )}
                                ListboxProps={{
                                    onScroll: handleScrollDoctor,
                                    style: { maxHeight: '200px', overflow: 'auto' },
                                }}
                            />
                        </Grid>
                    </Grid>

                    <Typography variant="h6" sx={{ marginTop: 3 }}>
                        Sale Detail
                    </Typography>

                    {/* Menampilkan input dinamis untuk setiap item penjualan */}
                    {saleDetail.map((item, index) => (
                        <Grid container spacing={2} key={index} sx={{ marginBottom: 2 }}>
                            <Grid item xs={12} sm={4}>
                                <Autocomplete
                                    freeSolo
                                    key={saleDetail[index].medicine || 'default'}
                                    options={medicines}
                                    getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)} // ditampilkan pada field
                                    // value={medicines.find((med) => med.id === item.medicine) || null}
                                    value={queries[index] || ''}
                                    renderOption={(props, option) => (
                                        <li {...props} key={option.id}>
                                            {option.name}
                                        </li>
                                    )} // ditampilkan pada dropdown
                                    loading={isLoading}
                                    onInputChange={(e, value) => {
                                        handleQueryChange(index, value);
                                        setQuery(value);
                                        setOffset(0);
                                        fetchMedicines(value, 0);
                                    }} // Menangkap perubahan pada input textfield
                                    // onChange={(e, value) => value && handleSelectMedicine(value, index)} 
                                    onChange={(e, value) => {
                                        if (value) {
                                            // Jika item dipilih
                                            handleSelectMedicine(value, index);
                                        } else {
                                            // Jika tombol "X" diklik (value === null)
                                            setSaleDetail((prevDetail) => {
                                                const updatedDetail = [...prevDetail];
                                                updatedDetail[index] = {
                                                    medicine: '',
                                                    price: '',
                                                    quantity: '',
                                                    subtotal: 0,
                                                };
                                                return updatedDetail;
                                            });
                                            handleQueryChange(index, '');
                                        }
                                    }}
                                    // Menangkap perubahan pada dropdown (Memilih item dari daftar opsi dropdown.)
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Nama Obat"
                                            onFocus={() => { fetchMedicines('', 0); }}
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <>
                                                        {isLoading ? <CircularProgress size={20} /> : null}
                                                        {params.InputProps.endAdornment}
                                                    </>
                                                ),
                                            }}
                                        />
                                    )}
                                    ListboxProps={{
                                        onScroll: handleScroll,
                                        style: { maxHeight: '200px', overflow: 'auto' },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={2}>
                                <TextField
                                    label="Harga"
                                    name="price"
                                    type="number"
                                    fullWidth
                                    value={item.price}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={2}>
                                <TextField
                                    label="Qty"
                                    name="quantity"
                                    type="number"
                                    fullWidth
                                    value={item.quantity}
                                    onChange={(e) => handleInputDetailChange(e, index)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <TextField
                                    label="Subtotal"
                                    name="subtotal"
                                    type="number"
                                    fullWidth
                                    value={item.subtotal}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={1}>
                                <IconButton
                                    color="error"
                                    onClick={() => {
                                        setSaleDetail((prev) => prev.filter((_, i) => i !== index))
                                        setQueries((prevQueries) => {
                                            const updatedQueries = { ...prevQueries }; // Salin objek lama
                                            delete updatedQueries[index]; // Hapus elemen berdasarkan index

                                            // Kembalikan objek baru
                                            return normalizeQueries(updatedQueries); // Pastikan objek baru dihasilkan
                                        });
                                    }
                                    }
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                    ))}


                    <Box sx={{ marginTop: 2 }}>
                        <Button variant="contained" onClick={addSaleItem}>
                            Add Item
                        </Button>
                    </Box>

                    <Box sx={{ marginTop: 3 }}>
                        <Button variant="contained" type="submit">
                            Edit Sale
                        </Button>
                    </Box>
                </form>
            </Box>

            <Snackbar
                open={notification.open}
                autoHideDuration={3000}
                anchorOrigin={{
                    vertical: 'top',   // Posisi atas
                    horizontal: 'center',  // Posisi tengah
                }}
                style={{
                    position: 'absolute',
                    top: '-75px', // Menentukan posisi dari atas
                    left: '45%', // Menentukan posisi dari kiri
                }}
                onClose={() => setNotification({ ...notification, open: false })}
            >
                <Alert
                    onClose={() => setNotification({ ...notification, open: false })}
                    severity={notification.severity}
                    sx={{ width: '100%' }}
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </section>
    );
}

export default EditSalePage;