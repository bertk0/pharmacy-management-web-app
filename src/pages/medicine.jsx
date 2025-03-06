import { useState, useEffect } from 'react';
import { getMedicine, addMedicine, editMedicine, deleteMedicine } from '../services/medicine.service';
import {
    Box, Button, Modal, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, CircularProgress,
    IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, MenuItem, Stack, Pagination, Grid, InputAdornment, RadioGroup, FormControlLabel,
    Radio, Snackbar, Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';


const MedicinePage = () => {
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [postDataMedicine, setPostDataMedicine] = useState({
        name: '',
        category: '',
        buy_price: '',
        sell_price: '',
        total_stock: '',
        description: '',
        status: 1,
    });

    const [openModal, setOpenModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const [SelectedIdMedicine, setSelectedIdMedicine] = useState(null);
    const [imagePreview, setImagePreview] = useState({});  // State to store previews for each medicine

    const [notification, setNotification] = useState({
        open: false,
        message: '',
        severity: 'success', // 'success' or 'error'
    });

    const totalPages = Math.ceil(totalItems / rowsPerPage);
    const fetchMedicine = async (page = 0) => {
        setLoading(true);
        setError(null);
        try {
            const data = await getMedicine(page, searchQuery);
            setMedicines(data.results);
            setCurrentPage(page);
            setTotalItems(data.count);
        } catch (err) {
            setError('Terjadi kesalahan dalam memuat data.' + err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMedicine();
    }, []);

    const handleSearch = () => {
        fetchMedicine(0, searchQuery);
    };

    const handleChangePage = (event, page) => {
        fetchMedicine(page - 1, searchQuery);
        setCurrentPage(page - 1);
    };

    const handleSelectPage = (event) => {
        const page = parseInt(event.target.value, 10) - 1;
        fetchMedicine(page, searchQuery);
        setCurrentPage(page);
    };


    // <=== Handle Modal, Dialog & Notification ===>
    const handleOpenAddModal = () => {
        setEditMode(false);
        setPostDataMedicine({ name: '', category: '', buy_price: '', sell_price: '', total_stock: '', description: '', status: 1 });
        setOpenModal(true);
    };

    const handleOpenEditModal = async (medicine) => {
        setEditMode(true);
        setSelectedIdMedicine(medicine.id);

        // Check if an image URL exists
        if (medicine.image_medicine) {
            setImagePreview((prev) => ({
                ...prev,
                [medicine.id]: `http://127.0.0.1:8000${medicine.image_medicine}`
            }));
        }

        setPostDataMedicine({
            ...medicine,
            image_medicine: medicine.image_medicine || null, // Ensure image_medicine is either the existing image or null
            imagePathPrev: medicine.image_medicine
        });
        setOpenModal(true);
    };


    const handleOpenDeleteDialog = (medicineId) => {
        setSelectedIdMedicine(medicineId);
        setOpenDeleteDialog(true);
    };

    const handleCloseModal = () => setOpenModal(false);
    const handleCloseDeleteDialog = () => setOpenDeleteDialog(false);


    const handleInputChange = (e) => {
        const { name, value } = e.target; // Ambil name dan value dari event
        setPostDataMedicine((prevState) => ({
            ...prevState,
            [name]: value,  // Update hanya field yang sesuai dengan name
        }));
    };

    // handle image change (for editing existing medicine)
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        console.log(file);
        if (file) {
            const previewUrl = URL.createObjectURL(file);

            // Update image preview specific to the medicine
            setImagePreview((prev) => ({
                ...prev,
                [SelectedIdMedicine]: previewUrl // Store preview URL for the current medicine
            }));

            setPostDataMedicine((prevState) => ({
                ...prevState,
                image_medicine: file  // Store FormData object for submission
            }));
        }
    };

    const handleDeleteImage = () => {
        setPostDataMedicine((prevState) => {
            const { imagePathPrev, ...updatedMedicine } = prevState; // Hapus field imagePathPrev
            return {
                ...updatedMedicine,
                image_medicine: null // Atur image_medicine menjadi null
            };
        });


        // Reset preview data for the medicine being edited
        setImagePreview((prev) => ({
            ...prev,
            [SelectedIdMedicine]: null // Clear the preview for the specific medicine
        }));

        console.log("After delete:", postDataMedicine.image_medicine);
    }

    const showNotification = (message, severity = 'success') => {
        setNotification({ open: true, message, severity });
        setTimeout(() => {
            setNotification({ ...notification, open: false });
        }, 3000); // Tutup notifikasi setelah 3 detik
    };

    //<=== Handle Modal, Dialog & Notification===>


    const postMedicine = async () => {
        const formData = new FormData();
        formData.append("buy_price", Number(postDataMedicine.buy_price));
        formData.append("sell_price", Number(postDataMedicine.sell_price));
        formData.append("total_stock", Number(postDataMedicine.total_stock));

        // Append other fields as strings
        Object.keys(postDataMedicine).forEach((key) => {
            if (key !== 'buy_price' && key !== 'sell_price' && key !== 'total_stock') {
                formData.append(key, postDataMedicine[key]);
            }
        });

        if (imagePreview) {
            formData.append('image_medicine', postDataMedicine.image_medicine)
        }

        formData.append('imagePathPrev', postDataMedicine.imagePathPrev);

        try {
            if (editMode) {
                await editMedicine(SelectedIdMedicine, formData);
                fetchMedicine(currentPage);
                showNotification('Data obat berhasil diperbarui!', 'success');

            } else {
                await addMedicine(formData);

                // Update total items after adding
                const updatedTotalItems = totalItems + 1;
                setTotalItems(updatedTotalItems);

                // Update current page to the last page after post
                const lastPage = Math.ceil(updatedTotalItems / rowsPerPage) - 1;
                setCurrentPage(lastPage);

                fetchMedicine(lastPage);
                showNotification('Data obat berhasil ditambahkan!', 'success');
            }

            setOpenModal(false);
            setPostDataMedicine({ name: '', category: '', buy_price: '', sell_price: '', total_stock: '', description: '', status: 1 });
            setImagePreview({});

            setSelectedIdMedicine(null);
        } catch (err) {
            setError('Terjadi kesalahan dalam menambah atau mengedit obat.' + err);
            showNotification('Terjadi kesalahan dalam memproses data.', 'error');
        }
    };


    const onDeleteMedicine = async () => {
        try {
            await deleteMedicine(SelectedIdMedicine);
            fetchMedicine(currentPage);
            setOpenDeleteDialog(false);
            showNotification('Data obat berhasil dihapus!', 'success');
        } catch (err) {
            setError('Terjadi kesalahan dalam menghapus obat.');
            showNotification('Terjadi kesalahan dalam menghapus data.', 'error');
        }
    };

    
    return (
        <section className="card">
            <Box p={3}>
                <Typography variant="h4" gutterBottom>Daftar Medicine</Typography>

                <Box display="flex" gap={2} mb={2}>
                    <TextField
                        label="Cari berdasarkan nama"
                        variant="outlined"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button variant="contained" color="primary" onClick={handleSearch}>Cari</Button>
                    <Button variant="contained" color="secondary" onClick={handleOpenAddModal} startIcon={<AddIcon />}>
                        Tambah Obat
                    </Button>
                </Box>

                {loading ? (
                    <CircularProgress />
                ) : error ? (
                    <Typography color="error">{error}</Typography>
                ) : (
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>No</TableCell>
                                    <TableCell>Nama</TableCell>
                                    <TableCell>Kategori</TableCell>
                                    <TableCell>Harga Beli</TableCell>
                                    <TableCell>Harga Jual</TableCell>
                                    <TableCell>Stok</TableCell>
                                    <TableCell>Deskripsi</TableCell>
                                    <TableCell>Aksi</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {medicines.map((medicine, index) => (
                                    <TableRow key={medicine.id}>
                                        <TableCell>{index + 1 + currentPage * rowsPerPage}</TableCell>
                                        <TableCell>{medicine.name}</TableCell>
                                        <TableCell>{medicine.category}</TableCell>
                                        <TableCell>{medicine.buy_price}</TableCell>
                                        <TableCell>{medicine.sell_price}</TableCell>
                                        <TableCell>{medicine.total_stock}</TableCell>
                                        <TableCell>{medicine.description}</TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => handleOpenEditModal(medicine)}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton onClick={() => handleOpenDeleteDialog(medicine.id)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                <Stack spacing={2} direction="row" justifyContent="center" alignItems="center" sx={{ mt: 2 }}>
                    <Pagination
                        count={totalPages}
                        page={currentPage + 1}
                        onChange={handleChangePage}
                        color="primary"
                        showFirstButton
                        showLastButton
                    />

                    <TextField
                        select
                        label="Page"
                        value={currentPage + 1}
                        onChange={handleSelectPage}
                        variant="outlined"
                        size="small"
                        sx={{ width: 100 }}
                    >
                        {Array.from({ length: totalPages }, (_, i) => (
                            <MenuItem key={i + 1} value={i + 1}>
                                {i + 1}
                            </MenuItem>
                        ))}
                    </TextField>

                </Stack>


                <Modal open={openModal} onClose={handleCloseModal} >
                    <Box sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 2, mx: 'auto', mt: 4, overflowY: 'auto', maxHeight: '85vh', maxWidth: 1000 }}>
                        <Typography variant="h6" mb={2}>{editMode ? 'Edit' : 'Tambah'} Obat</Typography>

                        <Grid container spacing={2} marginY={2}>
                            <Grid item xs={8}>
                                <TextField
                                    label="Name"
                                    name="name"
                                    value={postDataMedicine.name}
                                    onChange={handleInputChange}
                                    fullWidth
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    label="Category"
                                    name="category"
                                    value={postDataMedicine.category}
                                    onChange={handleInputChange}
                                    fullWidth
                                    variant="outlined"
                                />
                            </Grid>
                        </Grid>

                        <Grid container spacing={2} marginY={2}>
                            <Grid item xs={4}>
                                <TextField
                                    label="Buy Price"
                                    name="buy_price"
                                    value={postDataMedicine.buy_price}
                                    onChange={handleInputChange}
                                    fullWidth
                                    margin="normal"
                                    type="number"
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
                                    }}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    label="Sell Price"
                                    name="sell_price"
                                    value={postDataMedicine.sell_price}
                                    onChange={handleInputChange}
                                    fullWidth
                                    margin="normal"
                                    type="number"
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
                                    }}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    label="Total Stock"
                                    name="total_stock"
                                    value={postDataMedicine.total_stock}
                                    onChange={handleInputChange}
                                    fullWidth
                                    margin="normal"
                                    type="number"
                                    variant="outlined"
                                />
                            </Grid>
                        </Grid>

                        <TextField
                            label="Description"
                            name="description"
                            value={postDataMedicine.description}
                            onChange={handleInputChange}
                            fullWidth
                            multiline
                            rows={4}
                            margin="normal"
                            variant="outlined"
                        />

                        {/* Radio button for status Jika Adalah Update*/}
                        {editMode &&
                            <>
                                <Typography variant="body1" mt={2}>Status</Typography>
                                <RadioGroup
                                    row
                                    name="status"
                                    value={postDataMedicine.status}
                                    onChange={handleInputChange}
                                >
                                    <FormControlLabel value="1" control={<Radio />} label="Aktif" />
                                    <FormControlLabel value="2" control={<Radio />} label="Tidak Aktif" />
                                </RadioGroup>
                            </>
                        }
                        <Typography variant="body1" mt={2} mb={0}>Preview Image : </Typography>

                        <Grid container spacing={2} marginY={2}>
                            <Grid item xs={8}>
                                <Box
                                    display="flex"
                                    flexDirection="column"
                                    alignItems="center"
                                    justifyContent="center"
                                    width="100%"
                                    height="200px"
                                    border="2px dashed #cccccc"
                                    borderRadius="8px"
                                    style={{ cursor: 'pointer', marginBottom: 20 }}
                                    component="label"
                                >
                                    {postDataMedicine.image_medicine ? (
                                        <Box>
                                            <img
                                                src={imagePreview[SelectedIdMedicine] || 'default-image-url.jpg'}
                                                alt="Medicine Preview"
                                                style={{ width: '100%', maxHeight: '200px', objectFit: 'contain' }}
                                            />
                                        </Box>


                                    ) : (
                                        <Box display="flex" flexDirection="column" alignItems="center">
                                            <Box
                                                component="span"
                                                style={{ fontSize: '2rem', color: '#4CAF50', marginBottom: '10px' }}
                                            >
                                                ⬆️
                                            </Box>
                                            <Box component="span" style={{ color: '#999' }}>
                                                Drag files to upload
                                            </Box>
                                        </Box>
                                    )}
                                </Box>
                            </Grid>

                            <Grid item xs={4}>
                                <Grid container spacing={2} marginX={2} marginY={2}>
                                    <Grid item xs={12}>
                                        <Button
                                            variant="contained"
                                            color="success"
                                            component="label"
                                            style={{ marginTop: '10px' }}
                                        >
                                            {/* {editMode && postDataMedicine.image_medicine ? 'Ganti Gambar' : 'Upload Gambar'} */}
                                            {postDataMedicine.image_medicine ? 'Ganti Gambar' : 'Upload Gambar'}
                                            <input
                                                key={postDataMedicine.image_medicine ? postDataMedicine.image_medicine : Date.now()}
                                                id="upload-input"
                                                type="file"
                                                name="image_medicine"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                hidden
                                            />
                                        </Button>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2} marginX={2} marginY={2}>
                                    <Grid item xs={12}>
                                        {postDataMedicine.image_medicine ? (
                                            <Button
                                                variant="contained"
                                                color="error"
                                                component="label"
                                                style={{ marginTop: '10px' }}
                                                onClick={handleDeleteImage}
                                            >
                                                Hapus Gambar
                                            </Button>
                                        ) : (<Box></Box>)}

                                    </Grid>
                                </Grid>

                            </Grid>
                        </Grid>



                        <Button variant="contained" color="primary" fullWidth onClick={postMedicine}>
                            {editMode ? 'Simpan Perubahan' : 'Simpan'}
                        </Button>
                    </Box>
                </Modal>


                <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
                    <DialogTitle>Konfirmasi Penghapusan</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Apakah Anda yakin ingin menghapus obat ini?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDeleteDialog} color="primary">
                            Batal
                        </Button>
                        <Button onClick={onDeleteMedicine} color="secondary">
                            Hapus
                        </Button>
                    </DialogActions>
                </Dialog>

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

            </Box>
        </section>
    );
};

export default MedicinePage;