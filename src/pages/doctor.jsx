import { useState, useEffect } from 'react';
import { getDoctor, addDoctor, editDoctor, deleteDoctor } from '../services/doctor.service';
import {
    Box, Button, Modal, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, CircularProgress,
    IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, MenuItem, Stack, Pagination, Grid, RadioGroup, FormControlLabel,
    Radio, Snackbar, Alert, FormControl, InputLabel, Select
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';


const DoctorPage = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [postDataDoctor, setPostDataDoctor] = useState({
        name: '',
        specialist: '',
        gender: '',
        phone: '',
        email: '',
        status: 1,
    });

    const [openModal, setOpenModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const [SelectedIdDoctor, setSelectedIdDoctor] = useState(null);
    const [imagePreview, setImagePreview] = useState({});

    const [notification, setNotification] = useState({
        open: false,
        message: '',
        severity: 'success', // 'success' or 'error'
    });


    const totalPages = Math.ceil(totalItems / rowsPerPage);

    // Get Data Doctor
    const fetchDoctor = async (page = 0) => {
        setLoading(true);
        setError(null);
        try {
            const data = await getDoctor(page, searchQuery);
            setDoctors(data.results);
            setCurrentPage(page);
            setTotalItems(data.count);
        } catch (err) {
            setError('Terjadi kesalahan dalam memuat data.' + err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDoctor();
    }, []);

    const handleSearch = () => {
        fetchDoctor(0, searchQuery);
    };

    const handleChangePage = (event, page) => {
        fetchDoctor(page - 1, searchQuery);
        setCurrentPage(page - 1);
    };

    const handleSelectPage = (event) => {
        const page = parseInt(event.target.value, 10) - 1;
        fetchDoctor(page, searchQuery);
        setCurrentPage(page);
    };

    // <=== Handle Modal, Dialog & Notification ===>
    const handleOpenAddModal = () => {
        setEditMode(false);
        setPostDataDoctor({ name: '', specialist: '', gender: '', phone: '', email: '', status: 1 });
        setOpenModal(true);
    };

    const handleOpenEditModal = async (doctor) => {
        setEditMode(true);
        setSelectedIdDoctor(doctor.id);

        // Check if an image URL exists
        if (doctor.image_doctor) {

            setImagePreview((prev) => ({
                ...prev,
                [doctor.id]: `http://127.0.0.1:8000${doctor.image_doctor}`
            }));
        }

        setPostDataDoctor({
            ...doctor,
            image_doctor: doctor.image_doctor || null,
            imagePathPrev: doctor.image_doctor
        });
        setOpenModal(true);
    };


    const handleOpenDeleteDialog = (doctorId) => {
        setSelectedIdDoctor(doctorId);
        setOpenDeleteDialog(true);
    };

    const handleCloseModal = () => setOpenModal(false);
    const handleCloseDeleteDialog = () => setOpenDeleteDialog(false);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPostDataDoctor((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        console.log(file);
        if (file) {
            const previewUrl = URL.createObjectURL(file);

            // Update image preview specific to the doctor
            setImagePreview((prev) => ({
                ...prev,
                [SelectedIdDoctor]: previewUrl // Store preview URL for the current doctor
            }));


            setPostDataDoctor((prevState) => ({
                ...prevState,
                image_doctor: file  // Store FormData object for submission
            }));
        }
    };

    const handleDeleteImage = () => {
        setPostDataDoctor((prevState) => {
            const { imagePathPrev, ...updatedDoctor } = prevState; // Hapus field imagePathPrev
            return {
                ...updatedDoctor,
                image_doctor: null // Atur image_doctor menjadi null
            };
        });

        setImagePreview((prev) => ({
            ...prev,
            [SelectedIdDoctor]: null // Clear the preview for the specific doctor
        }));


        console.log("After delete:", postDataDoctor.image_doctor);
    }

    const showNotification = (message, severity = 'success') => {
        setNotification({ open: true, message, severity });
        setTimeout(() => {
            setNotification({ ...notification, open: false });
        }, 3000); // Tutup notifikasi setelah 3 detik
    };

    //<=== Handle Modal , dialog & notification ===>


    const postDoctor = async () => {
        const formData = new FormData();


        Object.keys(postDataDoctor).forEach((key) => {
            formData.append(key, postDataDoctor[key]);
        });

        if (imagePreview) {
            formData.append('image_doctor', postDataDoctor.image_doctor)
        }

        formData.append('imagePathPrev', postDataDoctor.imagePathPrev);

        try {
            if (editMode) {
                await editDoctor(SelectedIdDoctor, formData);
                fetchDoctor(currentPage);
                showNotification('Data Dokter berhasil diperbarui!', 'success');

            } else {
                await addDoctor(formData);

                // Update total items after adding
                const updatedTotalItems = totalItems + 1;
                setTotalItems(updatedTotalItems);

                // Update current page to the last page after post
                const lastPage = Math.ceil(updatedTotalItems / rowsPerPage) - 1;
                setCurrentPage(lastPage);

                fetchDoctor(lastPage);
                showNotification('Data dokter berhasil ditambahkan!', 'success');
            }

            setOpenModal(false);
            setPostDataDoctor({ name: '', specialist: '', gender: '', phone: '', email: '', status: 1 });
            setImagePreview({});
          
            setSelectedIdDoctor(null);
   
        } catch (err) {
            setError('Terjadi kesalahan dalam menambah atau mengedit data dokter.' + err);
            showNotification('Terjadi kesalahan dalam memproses data.', 'error');
        }
    };

    const onDeleteDoctor = async () => {
        try {
            await deleteDoctor(SelectedIdDoctor);
            fetchDoctor(currentPage);
            setOpenDeleteDialog(false);
            showNotification('Data dokter berhasil dihapus!', 'success');
        } catch (err) {
            setError('Terjadi kesalahan dalam menghapus data dokter.');
            showNotification('Terjadi kesalahan dalam menghapus data.', 'error');
        }
    };


    return (
        <section className="card">
            <Box p={3}>
                <Typography variant="h4" gutterBottom>Daftar Doctor</Typography>

                <Box display="flex" gap={2} mb={2}>
                    <TextField
                        label="Cari berdasarkan nama"
                        variant="outlined"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button variant="contained" color="primary" onClick={handleSearch}>Cari</Button>
                    <Button variant="contained" color="secondary" onClick={handleOpenAddModal} startIcon={<AddIcon />}>
                        Tambah Dokter
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
                                    <TableCell>Specialist</TableCell>
                                    <TableCell>Gender</TableCell>
                                    <TableCell>Phone</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Aksi</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {doctors.map((doctor, index) => (
                                    <TableRow key={doctor.id}>
                                        <TableCell>{index + 1 + currentPage * rowsPerPage}</TableCell>
                                        <TableCell>{doctor.name}</TableCell>
                                        <TableCell>{doctor.specialist}</TableCell>
                                        <TableCell>{doctor.gender}</TableCell>
                                        <TableCell>{doctor.phone}</TableCell>
                                        <TableCell>{doctor.email}</TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => handleOpenEditModal(doctor)}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton onClick={() => handleOpenDeleteDialog(doctor.id)}>
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
                        <Typography variant="h6" mb={2}>{editMode ? 'Edit' : 'Tambah'} Dokter</Typography>

                        <Grid container spacing={2} marginY={2}>
                            <Grid item xs={8}>
                                <TextField
                                    label="Name"
                                    name="name"
                                    value={postDataDoctor.name}
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
                                        value={postDataDoctor.gender}
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
                            <Grid item xs={12}>
                            <TextField
                                    label="Specialist"
                                    name="specialist"
                                    value={postDataDoctor.specialist}
                                    onChange={handleInputChange}
                                    fullWidth
                                    variant="outlined"
                                />
                            </Grid>
                        </Grid>

                        <Grid container spacing={2} marginY={2}>
                        <Grid item xs={8}>
                                <TextField
                                    label="Phone"
                                    name="phone"
                                    value={postDataDoctor.phone}
                                    onChange={handleInputChange}
                                    fullWidth
                                    margin="normal"
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    label="Email"
                                    name="email"
                                    value={postDataDoctor.email}
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
                                    value={postDataDoctor.status}
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
                                    {postDataDoctor.image_doctor ? (
                                        <Box>

                                            <img
                                                src={imagePreview[SelectedIdDoctor] || 'default-image-url.jpg'}

                                                alt="Doctor Preview"

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
                                            {/* {editMode && postDataDoctor.image_doctor ? 'Ganti Gambar' : 'Upload Gambar'} */}
                                            {postDataDoctor.image_doctor ? 'Ganti Gambar' : 'Upload Gambar'}
                                            <input
                                                key={postDataDoctor.image_doctor ? postDataDoctor.image_doctor : Date.now()}
                                                id="upload-input"
                                                type="file"
                                                name="image_doctor"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                hidden
                                            />
                                        </Button>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2} marginX={2} marginY={2}>
                                    <Grid item xs={12}>
                                        {postDataDoctor.image_doctor ? (
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

                        <Button variant="contained" color="primary" fullWidth onClick={postDoctor}>
                            {editMode ? 'Simpan Perubahan' : 'Simpan'}
                        </Button>
                    </Box>
                </Modal>


                <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
                    <DialogTitle>Konfirmasi Penghapusan</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Apakah Anda yakin ingin menghapus dokter ini?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDeleteDialog} color="primary">
                            Batal
                        </Button>
                        <Button onClick={onDeleteDoctor} color="secondary">
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

export default DoctorPage;