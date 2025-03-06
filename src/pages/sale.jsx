import { useState, useEffect } from 'react';
import { getSale, deleteSale } from '../services/sale.service';
import {
    Box, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, CircularProgress,
    IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, MenuItem, Stack, Pagination, Snackbar, Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import dayjs from "dayjs";
import { Link, useNavigate } from "react-router-dom"

const SalePage = () => {
    const navigate = useNavigate();

    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');


    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const [selectedIdSale, setSelectedIdSale] = useState(null);

    const [notification, setNotification] = useState({
        open: false,
        message: '',
        severity: 'success', // 'success' or 'error'
    });

    const totalPages = Math.ceil(totalItems / rowsPerPage);

    // Get Data Sale
    const fetchSale = async (page = 0) => {
        setLoading(true);
        setError(null);
        try {
            const data = await getSale(page, searchQuery);
            setSales(data.results);
            setCurrentPage(page);
            setTotalItems(data.count);
        } catch (err) {
            setError('Terjadi kesalahan dalam memuat data.' + err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSale();
    }, []);

    const handleSearch = () => {
        fetchSale(0, searchQuery);
    };

    const handleChangePage = (event, page) => {
        fetchSale(page - 1, searchQuery);
        setCurrentPage(page - 1);
    };

    const handleSelectPage = (event) => {
        const page = parseInt(event.target.value, 10) - 1;
        fetchSale(page, searchQuery);
        setCurrentPage(page);
    };


    const handleEditButton = (saleId) => {
        navigate(`/sale/edit/${saleId}`);
    }

    // <=== Handle Dialog & Notification ===>
    const handleOpenDeleteDialog = (saleId) => {
        setSelectedIdSale(saleId);
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => setOpenDeleteDialog(false);


    const showNotification = (message, severity = 'success') => {
        setNotification({ open: true, message, severity });
        setTimeout(() => {
            setNotification({ ...notification, open: false });
        }, 3000); // Tutup notifikasi setelah 3 detik
    };

    //<=== Handle Dialog & notification ===>


    const onDeleteSale = async () => {
        try {
            await deleteSale(selectedIdSale);
            fetchSale(currentPage);
            setOpenDeleteDialog(false);
            showNotification('Data Sale berhasil dihapus!', 'success');
        } catch (err) {
            setError('Terjadi kesalahan dalam menghapus data sale.');
            showNotification('Terjadi kesalahan dalam menghapus data.', 'error');
        }
    };


    return (
        <section className="card">
            <Box p={3}>
                <Typography variant="h4" gutterBottom>Daftar Sale / Penjualan</Typography>

                <Box display="flex" gap={2} mb={2}>
                    <TextField
                        label="Cari berdasarkan sale invoice"
                        variant="outlined"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button variant="contained" color="primary" onClick={handleSearch}>Cari</Button>
                    {/* <Button variant="contained" color="secondary" startIcon={<AddIcon />}>
                        <Link to="/sale/create" activeclassname="active" style={{ color: "white" }}>Create Sale</Link>
                    </Button> */}
                    <Link to="/sale/create" activeclassname="active" style={{ color: "white", display: 'inline-flex' }}>
                        <Button variant="contained" color="secondary" startIcon={<AddIcon />} >
                            Create Sale
                        </Button>
                    </Link>
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
                                    <TableCell>Sale Invoice</TableCell>
                                    <TableCell>Tanggal Penjualan</TableCell>
                                    <TableCell>Pasien</TableCell>
                                    <TableCell>Dokter</TableCell>
                                    <TableCell>Total Payment</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sales.map((sale, index) => (
                                    <TableRow key={sale.id}>
                                        <TableCell>{index + 1 + currentPage * rowsPerPage}</TableCell>
                                        <TableCell>{sale.sale_invoice}</TableCell>
                                        <TableCell>{dayjs(sale.sale_date).format('DD-MM-YYYY')}</TableCell>
                                        <TableCell>{sale.patient.name}</TableCell>
                                        <TableCell>{sale.doctor.name}</TableCell>
                                        <TableCell>{Number(sale.total_payment).toLocaleString("id-ID", {
                                            style: "currency",
                                            currency: "IDR"
                                        })}</TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => handleEditButton(sale.id)} >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton onClick={() => handleOpenDeleteDialog(sale.id)}>
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


                <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
                    <DialogTitle>Konfirmasi Penghapusan</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Apakah Anda yakin ingin menghapus data sale ini?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDeleteDialog} color="primary">
                            Batal
                        </Button>
                        <Button onClick={onDeleteSale} color="secondary">
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

export default SalePage;