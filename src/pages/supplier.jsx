import { useState, useEffect } from 'react';
import { getSupplier, addSupplier, editSupplier, deleteSupplier } from '../services/supplier.service';
import {
    Box, Button, Modal, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, CircularProgress,
    IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, MenuItem, Stack, Pagination, Grid, RadioGroup, FormControlLabel,
    Radio, Snackbar, Alert, FormControl, InputLabel, Select
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';


const SupplierPage = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [postDataSupplier, setPostDataSupplier] = useState({
        name: '',
        address: '',
        city: '',
        phone: '',
        email: '',
        status: 1,
    });

    const [openModal, setOpenModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const [selectedIdSupplier, setSelectedIdSupplier] = useState(null);

    const [notification, setNotification] = useState({
        open: false,
        message: '',
        severity: 'success', // 'success' or 'error'
    });

    const totalPages = Math.ceil(totalItems / rowsPerPage);

    // Get Data Supplier
    const fetchSupplier = async (page = 0) => {
        setLoading(true);
        setError(null);
        try {
            const data = await getSupplier(page, searchQuery);
            setSuppliers(data.results);
            setCurrentPage(page);
            setTotalItems(data.count);
        } catch (err) {
            setError('Terjadi kesalahan dalam memuat data.' + err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSupplier();
    }, []);

    const handleSearch = () => {
        fetchSupplier(0, searchQuery);
    };

    const handleChangePage = (event, page) => {
        fetchSupplier(page - 1, searchQuery);
        setCurrentPage(page - 1);
    };

    const handleSelectPage = (event) => {
        const page = parseInt(event.target.value, 10) - 1;
        fetchSupplier(page, searchQuery);
        setCurrentPage(page);
    };



    // <=== Handle Modal ,Dialog & Notification ===>
    const handleOpenAddModal = () => {
        setEditMode(false);
        setPostDataSupplier({ name: '', address: '', city: '', phone: '', email: '', status: 1 });
        setOpenModal(true);
    };

    const handleOpenEditModal = async (supplier) => {
        setEditMode(true);
        setSelectedIdSupplier(supplier.id);

        setPostDataSupplier({
            ...supplier,
        });
        setOpenModal(true);
    };


    const handleOpenDeleteDialog = (supplierId) => {
        setSelectedIdSupplier(supplierId);
        setOpenDeleteDialog(true);
    };

    const handleCloseModal = () => setOpenModal(false);
    const handleCloseDeleteDialog = () => setOpenDeleteDialog(false);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPostDataSupplier((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const showNotification = (message, severity = 'success') => {
        setNotification({ open: true, message, severity });
        setTimeout(() => {
            setNotification({ ...notification, open: false });
        }, 3000); // Tutup notifikasi setelah 3 detik
    };

    //<=== Handle Modal , dialog & notification ===>


    const postSupplier = async () => {
        const formData = new FormData();

        Object.keys(postDataSupplier).forEach((key) => {
            formData.append(key, postDataSupplier[key]);
        });

        try {
            if (editMode) {
                await editSupplier(selectedIdSupplier, formData);
                fetchSupplier(currentPage);
                showNotification('Data Supplier berhasil diperbarui!', 'success');

            } else {
                await addSupplier(formData);

                // Update total items after adding
                const updatedTotalItems = totalItems + 1;
                setTotalItems(updatedTotalItems);

                // Update current page to the last page after post
                const lastPage = Math.ceil(updatedTotalItems / rowsPerPage) - 1;
                setCurrentPage(lastPage);

                fetchSupplier(lastPage);
                showNotification('Data Supplier berhasil ditambahkan!', 'success');
            }

            setOpenModal(false);
            setPostDataSupplier({ name: '', address: '', city: '', phone: '', email: '', status: 1 });
            setSelectedIdSupplier(null);

        } catch (err) {
            setError('Terjadi kesalahan dalam menambah atau mengedit data supplier.' + err);
            showNotification('Terjadi kesalahan dalam memproses data.', 'error');
        }
    };

    const onDeleteSupplier = async () => {
        try {
            await deleteSupplier(selectedIdSupplier);
            fetchSupplier(currentPage);
            setOpenDeleteDialog(false);
            showNotification('Data supplier berhasil dihapus!', 'success');
        } catch (err) {
            setError('Terjadi kesalahan dalam menghapus data supplier.');
            showNotification('Terjadi kesalahan dalam menghapus data.', 'error');
        }
    };


    return (
        <section className="card">
            <Box p={3}>
                <Typography variant="h4" gutterBottom>Daftar Supplier</Typography>

                <Box display="flex" gap={2} mb={2}>
                    <TextField
                        label="Cari berdasarkan nama"
                        variant="outlined"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button variant="contained" color="primary" onClick={handleSearch}>Cari</Button>
                    <Button variant="contained" color="secondary" onClick={handleOpenAddModal} startIcon={<AddIcon />}>
                        Tambah Supplier
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
                                    <TableCell>Address</TableCell>
                                    <TableCell>City</TableCell>
                                    <TableCell>Phone</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Aksi</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {suppliers.map((supplier, index) => (
                                    <TableRow key={supplier.id}>
                                        <TableCell>{index + 1 + currentPage * rowsPerPage}</TableCell>
                                        <TableCell>{supplier.name}</TableCell>
                                        <TableCell>{supplier.address}</TableCell>
                                        <TableCell>{supplier.city}</TableCell>
                                        <TableCell>{supplier.phone}</TableCell>
                                        <TableCell>{supplier.email}</TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => handleOpenEditModal(supplier)}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton onClick={() => handleOpenDeleteDialog(supplier.id)}>
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
                    <Box sx={{
                        p: 4, bgcolor: 'background.paper', borderRadius: 2, mx: 'auto', mt: 4, overflowY: 'auto', maxHeight: '85vh', maxWidth: 1000,
                        // position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)'
                    }}>
                        <Typography variant="h6" mb={2}>{editMode ? 'Edit' : 'Tambah'} Supplier</Typography>

                        <Grid container spacing={2} marginY={2}>
                            <Grid item xs={8}>
                                <TextField
                                    label="Name"
                                    name="name"
                                    value={postDataSupplier.name}
                                    onChange={handleInputChange}
                                    fullWidth
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={4}>
                            <TextField
                                    label="City"
                                    name="city"
                                    value={postDataSupplier.city}
                                    onChange={handleInputChange}
                                    fullWidth
                                    variant="outlined"
                                />
                            </Grid>
                        </Grid>

                        <Grid container spacing={2} marginY={2}>
                            <Grid item xs={12}>
                                <TextField
                                    label="Address"
                                    name="address"
                                    value={postDataSupplier.address}
                                    onChange={handleInputChange}
                                    fullWidth
                                    variant="outlined"
                                />
                            </Grid>
                        </Grid>

                        <Grid container spacing={2} marginY={2}>
                            <Grid item xs={6}>
                                <TextField
                                    label="Phone"
                                    name="phone"
                                    value={postDataSupplier.phone}
                                    onChange={handleInputChange}
                                    fullWidth
                                    margin="normal"
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Email"
                                    name="email"
                                    value={postDataSupplier.email}
                                    onChange={handleInputChange}
                                    fullWidth
                                    margin="normal"
                                    variant="outlined"
                                />
                            </Grid>
                        </Grid>


                        {/* Radio button for status Jika Adalah Update*/}
                        {editMode &&
                            <>
                                <Typography variant="body1" mt={2}>Status</Typography>
                                <RadioGroup
                                    row
                                    name="status"
                                    value={postDataSupplier.status}
                                    onChange={handleInputChange}
                                    sx={{ marginBottom: '16px' }}
                                >
                                    <FormControlLabel value="1" control={<Radio />} label="Aktif" />
                                    <FormControlLabel value="2" control={<Radio />} label="Tidak Aktif" />
                                </RadioGroup>
                            </>
                        }

                        <Button variant="contained" color="primary" fullWidth onClick={postSupplier}>
                            {editMode ? 'Simpan Perubahan' : 'Simpan'}
                        </Button>
                    </Box>
                </Modal>


                <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
                    <DialogTitle>Konfirmasi Penghapusan</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Apakah Anda yakin ingin menghapus data supplier ini?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDeleteDialog} color="primary">
                            Batal
                        </Button>
                        <Button onClick={onDeleteSupplier} color="secondary">
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
}

export default SupplierPage;