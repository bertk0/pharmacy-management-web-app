import { useState, useEffect } from 'react';
import { getPatient, addPatient, editPatient, deletePatient } from '../services/patient.service';
import {
    Box, Button, Modal, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, CircularProgress,
    IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, MenuItem, Stack, Pagination, Grid, RadioGroup, FormControlLabel,
    Radio, Snackbar, Alert, FormControl, InputLabel, Select
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';


const PatientPage = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [postDataPatient, setPostDataPatient] = useState({
        name: '',
        date_of_birth: '',
        gender: '',
        address: '',
        phone: '',
        email: '',
        status: 1,
    });

    const [openModal, setOpenModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const [SelectedIdPatient, setSelectedIdPatient] = useState(null);

    const [notification, setNotification] = useState({
        open: false,
        message: '',
        severity: 'success', // 'success' or 'error'
    });

    const totalPages = Math.ceil(totalItems / rowsPerPage);

    // Get Data Patient
    const fetchPatient = async (page = 0) => {
        setLoading(true);
        setError(null);
        try {
            const data = await getPatient(page, searchQuery);
            setPatients(data.results);
            setCurrentPage(page);
            setTotalItems(data.count);
        } catch (err) {
            setError('Terjadi kesalahan dalam memuat data.' + err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatient();
    }, []);

    const handleSearch = () => {
        fetchPatient(0, searchQuery);
    };

    const handleChangePage = (event, page) => {
        fetchPatient(page - 1, searchQuery);
        setCurrentPage(page - 1);
    };

    const handleSelectPage = (event) => {
        const page = parseInt(event.target.value, 10) - 1;
        fetchPatient(page, searchQuery);
        setCurrentPage(page);
    };


    // <=== Handle Modal ,Dialog & Notification ===>
    const handleOpenAddModal = () => {
        setEditMode(false);
        setPostDataPatient({ name: '', date_of_birth: '', gender: '', address: '', phone: '', email: '', status: 1 });
        setOpenModal(true);
    };

    const handleOpenEditModal = async (patient) => {
        setEditMode(true);
        setSelectedIdPatient(patient.id);

        setPostDataPatient({
            ...patient,
        });
        setOpenModal(true);
    };


    const handleOpenDeleteDialog = (patientId) => {
        setSelectedIdPatient(patientId);
        setOpenDeleteDialog(true);
    };

    const handleCloseModal = () => setOpenModal(false);
    const handleCloseDeleteDialog = () => setOpenDeleteDialog(false);


    // const handleInputChange = (e) => {
    //     const { name, value } = e.target;
    //     setPostDataPatient((prevState) => ({
    //         ...prevState,
    //         [name]: value,
    //     }));
    // };

    const handleInputChange = (input) => {
        if (input.target) {
            // Untuk input berbasis event (seperti TextField)
            const { name, value } = input.target;
            setPostDataPatient((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        } else {
            // Untuk input langsung (seperti DatePicker)
            const { name, value } = input;
            setPostDataPatient((prevState) => ({
                ...prevState,
                [name]: value ? value.format('YYYY-MM-DD') : '', // Simpan dalam format string
            }));
        }
    };

    const showNotification = (message, severity = 'success') => {
        setNotification({ open: true, message, severity });
        setTimeout(() => {
            setNotification({ ...notification, open: false });
        }, 3000); // Tutup notifikasi setelah 3 detik
    };

    //<=== Handle Modal , dialog & notification ===>


    const postPatient = async () => {
        const formData = new FormData();

        Object.keys(postDataPatient).forEach((key) => {
            formData.append(key, postDataPatient[key]);
        });

        try {
            if (editMode) {
                await editPatient(SelectedIdPatient, formData);
                fetchPatient(currentPage);
                showNotification('Data Pasien berhasil diperbarui!', 'success');

            } else {
                await addPatient(formData);

                // Update total items after adding
                const updatedTotalItems = totalItems + 1;
                setTotalItems(updatedTotalItems);

                // Update current page to the last page after post
                const lastPage = Math.ceil(updatedTotalItems / rowsPerPage) - 1;
                setCurrentPage(lastPage);

                fetchPatient(lastPage);
                showNotification('Data Pasien berhasil ditambahkan!', 'success');
            }

            setOpenModal(false);
            setPostDataPatient({ name: '', date_of_birth: '', gender: '', address: '', phone: '', email: '', status: 1 });
            setSelectedIdPatient(null);

        } catch (err) {
            setError('Terjadi kesalahan dalam menambah atau mengedit data pasien.' + err);
            showNotification('Terjadi kesalahan dalam memproses data.', 'error');
        }
    };

    const onDeletePatient = async () => {
        try {
            await deletePatient(SelectedIdPatient);
            fetchPatient(currentPage);
            setOpenDeleteDialog(false);
            showNotification('Data pasien berhasil dihapus!', 'success');
        } catch (err) {
            setError('Terjadi kesalahan dalam menghapus data pasien.');
            showNotification('Terjadi kesalahan dalam menghapus data.', 'error');
        }
    };

    return (
        <section className="card">
            <Box p={3}>
                <Typography variant="h4" gutterBottom>Daftar Patient</Typography>

                <Box display="flex" gap={2} mb={2}>
                    <TextField
                        label="Cari berdasarkan nama"
                        variant="outlined"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button variant="contained" color="primary" onClick={handleSearch}>Cari</Button>
                    <Button variant="contained" color="secondary" onClick={handleOpenAddModal} startIcon={<AddIcon />}>
                        Tambah Pasien
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
                                    <TableCell>Tanggal Lahir</TableCell>
                                    <TableCell>Gender</TableCell>
                                    <TableCell>Address</TableCell>
                                    <TableCell>Phone</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Aksi</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {patients.map((patient, index) => (
                                    <TableRow key={patient.id}>
                                        <TableCell>{index + 1 + currentPage * rowsPerPage}</TableCell>
                                        <TableCell>{patient.name}</TableCell>
                                        <TableCell>{dayjs(patient.date_of_birth).format('DD-MM-YYYY')}</TableCell>
                                        <TableCell>{patient.gender}</TableCell>
                                        <TableCell>{patient.address}</TableCell>
                                        <TableCell>{patient.phone}</TableCell>
                                        <TableCell>{patient.email}</TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => handleOpenEditModal(patient)}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton onClick={() => handleOpenDeleteDialog(patient.id)}>
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
                        p: 4, bgcolor: 'background.paper', borderRadius: 2, mx: 'auto', mt: 4, overflowY: 'auto', maxHeight: '85vh', width: 1000,
                        position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)'
                    }}>
                        <Typography variant="h6" mb={2}>{editMode ? 'Edit' : 'Tambah'} Pasien</Typography>

                        <Grid container spacing={2} marginY={2}>
                            <Grid item xs={8}>
                                <TextField
                                    label="Name"
                                    name="name"
                                    value={postDataPatient.name}
                                    onChange={handleInputChange}
                                    fullWidth
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel id="gender-label">Gender</InputLabel>
                                    <Select
                                        labelId="gender-label"
                                        id="gender"
                                        name="gender"
                                        value={postDataPatient.gender}
                                        onChange={handleInputChange}
                                        label="Gender"
                                    >
                                        <MenuItem value="Male">Male</MenuItem>
                                        <MenuItem value="Female">Female</MenuItem>
                                    </Select>
                                </FormControl>

                            </Grid>
                        </Grid>

                        <Grid container spacing={2} marginY={2}>
                            <Grid item xs={6} >
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        label="Tanggal Lahir"
                                        value={postDataPatient.date_of_birth ? dayjs(postDataPatient.date_of_birth) : null}
                                        onChange={(newValue) => handleInputChange({ name: 'date_of_birth', value: newValue })}
                                        format="DD/MM/YYYY"
                                        sx={{ width: '100%' }} 
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Address"
                                    name="address"
                                    value={postDataPatient.address}
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
                                    value={postDataPatient.phone}
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
                                    value={postDataPatient.email}
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
                                    value={postDataPatient.status}
                                    onChange={handleInputChange}
                                    sx={{ marginBottom: '16px' }}
                                >
                                    <FormControlLabel value="1" control={<Radio />} label="Aktif" />
                                    <FormControlLabel value="2" control={<Radio />} label="Tidak Aktif" />
                                </RadioGroup>
                            </>
                        }

                        <Button variant="contained" color="primary" fullWidth onClick={postPatient}>
                            {editMode ? 'Simpan Perubahan' : 'Simpan'}
                        </Button>
                    </Box>
                </Modal>


                <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
                    <DialogTitle>Konfirmasi Penghapusan</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Apakah Anda yakin ingin menghapus data pasien ini?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDeleteDialog} color="primary">
                            Batal
                        </Button>
                        <Button onClick={onDeletePatient} color="secondary">
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

export default PatientPage;