import { useParams } from 'react-router-dom';
import { getPurchaseById , editPurchase} from '../services/purchase.service';
import { useEffect, useState } from 'react';
import { TextField, Button, Grid, Box, Typography, IconButton, CircularProgress, Snackbar, Alert, Autocomplete } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';



const EditPurchasePage = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [purchaseData, setPurchaseData] = useState({
        purchase_date: '',
        supplier: '',
        total_payment: 0,
        status: 1,
    });

    const [purchaseDetail, setPurchaseDetail] = useState([
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
            const response = await getPurchaseById(id);
            const data = response.data;

            // Update purchaseData
            setPurchaseData({
                purchase_date: data.purchase_date,
                supplier: data.supplier.id,
                total_payment: data.total_payment,
                status: data.status,
            });

            // Update purchaseDetail
            const formattedDetails = data.purchase_details.map((detail) => ({
                medicine: detail.medicine.id,
                price: detail.price,
                quantity: detail.quantity,
                subtotal: detail.subtotal,
            }));
            setPurchaseDetail(formattedDetails);


            setSupplierQuery(data.supplier.name)

            // Set queries for medicines
            const medicineQueries = data.purchase_details.reduce((acc, detail, index) => {
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

    // <==========Supplier=============>
    const [supplierData, setSupplierData] = useState({
        suppliers: [], 
        isLoading: false, 
        offset: 0, 
        hasMore: true, 
    });
    const [supplierQuery, setSupplierQuery] = useState('');

    const fetchSuppliers = async (name = '', newOffset = 0) => {
        setSupplierData((prev) => ({ ...prev, isLoading: true }));
        try {
            const response = await axios.get(
                `http://127.0.0.1:8000/api/suppliers/?limit=10&offset=${newOffset}&name=${name}`
            );
            if (response.data.results && response.data.results.length > 0) {
                setSupplierData((prev) => ({
                    ...prev,
                    suppliers: newOffset === 0 ? response.data.results : [...prev.suppliers, ...response.data.results],
                    offset: newOffset,
                    hasMore: response.data.results.length === 10, // Apakah masih ada lebih banyak data
                    isLoading: false,
                }));
            } else {
                setSupplierData((prev) => ({ ...prev, hasMore: false, isLoading: false }));
            }
        } catch (error) {
            console.error('Error fetching supplier:', error);
            setSupplierData((prev) => ({ ...prev, isLoading: false }));
        }
    };

    const handleScrollSupplier = (event) => {
        const { scrollTop, scrollHeight, clientHeight } = event.target;
        if (scrollHeight - scrollTop === clientHeight && supplierData.hasMore && !supplierData.isLoading) {
            const newOffset = supplierData.offset + 10;
            fetchSuppliers(supplierQuery, newOffset);
        }
    };
    // <==========Supplier=============>



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
        setPurchaseDetail((prevDetail) => {
            const updatedDetail = [...prevDetail];
            updatedDetail[index].medicine = medicine.id; // Nama obat
            updatedDetail[index].price = medicine.sell_price; // Harga obat dari API
            updatedDetail[index].subtotal = medicine.sell_price * (updatedDetail[index].quantity || 0); // Hitung subtotal
            return updatedDetail;
        });
        console.log(purchaseDetail);
        // Update query for the selected option
        handleQueryChange(index, medicine.name);
    };
    // <==========Medicine=============>


    // Fungsi untuk menambah item penjualan
    const addPurchaseItem = () => {
        setPurchaseDetail([
            ...purchaseDetail,
            {
                medicine: '',
                price: '',
                quantity: '',
                subtotal: 0,
            },
        ]);
    };

    // menangani perubahan input purchase
    const handleInputChange = (input) => {
        if (input.target) {
            // Untuk input berbasis event (seperti TextField)
            const { name, value } = input.target;
            setPurchaseData((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        } else {
            // Untuk input langsung (seperti DatePicker)
            const { name, value } = input;
            setPurchaseData((prevState) => ({
                ...prevState,
                [name]: value ? value.format('YYYY-MM-DD') : '', // Simpan dalam format string
            }));
        }
    };

    // menangani perubahan input purchase detail 
    const handleInputDetailChange = (e, index) => {
        const { name, value } = e.target;

        setPurchaseDetail((prevDetail) => {
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
        const updatedPurchaseDetail = purchaseDetail.filter((_, i) => i !== index);
        setPurchaseDetail(updatedPurchaseDetail);
    };

    // Fungsi untuk menangani form submit
    const handleSubmit = async (e) => {
        e.preventDefault();

       
        const totalPayment = purchaseDetail.reduce(
            (total, item) => total + parseFloat(item.subtotal),
            0
        );


        const postData = {
            purchase: {
                purchase_date: purchaseData.purchase_date,
                supplier: purchaseData.supplier,
                total_payment: totalPayment,
                status: purchaseData.status
            },
            purchase_detail: purchaseDetail,
        };

        console.log('Data yang akan dikirim:', postData);

        try {
            await editPurchase(id, postData);
            showNotification('Data Purchase berhasil diperbarui!', 'success');


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
                <Typography variant="h4" gutterBottom>Edit Pembelian</Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="Tanggal Pembelian"
                                    value={purchaseData.purchase_date ? dayjs(purchaseData.purchase_date) : null}
                                    onChange={(newValue) => handleInputChange({ name: 'purchase_date', value: newValue })}
                                    format="DD/MM/YYYY"
                                    sx={{ width: '100%' }}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Autocomplete
                                freeSolo
                                key={purchaseData.supplier || 'default'}
                                options={supplierData.suppliers}
                                getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)} // ditampilkan pada field
                                value={supplierQuery ? { name: supplierQuery } : null} // Allows free input by setting a custom object
                                renderOption={(props, option) => (
                                    <li {...props} key={`${option.id}-${uuidv4()}`}>
                                        {option.name}
                                    </li>
                                )} // ditampilkan pada dropdown
                                loading={supplierData.isLoading}
                                onInputChange={(e, value) => {
                                    setSupplierQuery(value);
                                    setSupplierData((prevSupplierData) => ({
                                        ...prevSupplierData, // Salin nilai sebelumnya
                                        offset: 0,
                                    }));
                                    fetchSuppliers(value, 0);
                                }} // Menangkap perubahan pada input textfield

                                onChange={(e, value) => {
                                    if (value) {
                                        // Jika item dipilih
                                        setPurchaseData((prevState) => ({
                                            ...prevState,
                                            supplier: value.id,
                                        }));
                                    } else {
                                        // Jika tombol "X" diklik (value === null)
                                        setPurchaseData((prevState) => ({
                                            ...prevState,
                                            supplier: '',
                                        }));
                                    }


                                }}
                                // Menangkap perubahan pada dropdown (Memilih item dari daftar opsi dropdown.)
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        required
                                        label="Nama Supplier"
                                        onFocus={() => { fetchSuppliers('', 0); }}
                                        onChange={(e) => {
                                            // Update the supplierQuery while typing
                                            setSupplierQuery(e.target.value);
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
                                    onScroll: handleScrollSupplier,
                                    style: { maxHeight: '200px', overflow: 'auto' },
                                }}
                            />
                        </Grid>
                    </Grid>

                    <Typography variant="h6" sx={{ marginTop: 3 }}>
                        Purchase Detail
                    </Typography>

                    {/* Menampilkan input dinamis untuk setiap item pembelian */}
                    {purchaseDetail.map((item, index) => (
                        <Grid container spacing={2} key={index} sx={{ marginBottom: 2 }}>
                            <Grid item xs={12} sm={4}>
                                <Autocomplete
                                    freeSolo
                                    key={purchaseDetail[index].medicine || 'default'}
                                    options={medicines}
                                    getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)} // ditampilkan pada field
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
                                    onChange={(e, value) => {
                                        if (value) {
                                            // Jika item dipilih
                                            handleSelectMedicine(value, index);
                                        } else {
                                            // Jika tombol "X" diklik (value === null)
                                            setPurchaseDetail((prevDetail) => {
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
                                        setPurchaseDetail((prev) => prev.filter((_, i) => i !== index))
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
                        <Button variant="contained" onClick={addPurchaseItem}>
                            Add Item
                        </Button>
                    </Box>

                    <Box sx={{ marginTop: 3 }}>
                        <Button variant="contained" type="submit">
                            Edit Purchase
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

export default EditPurchasePage;