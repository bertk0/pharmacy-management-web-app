import { useState, useEffect } from 'react';
import { getPurchase, deletePurchase } from '../services/purchase.service';
import {
    Box, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, CircularProgress,
    IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, MenuItem, Stack, Pagination, Snackbar, Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import dayjs from "dayjs";
import { Link, useNavigate } from "react-router-dom"

const PurchasePage = () => {
    const navigate = useNavigate();

    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');


    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const [selectedIdPurchase, setSelectedIdPurchase] = useState(null);

    const [notification, setNotification] = useState({
        open: false,
        message: '',
        severity: 'success', // 'success' or 'error'
    });

    const totalPages = Math.ceil(totalItems / rowsPerPage);

    // Get Data Purchase
    const fetchPurchase = async (page = 0) => {
        setLoading(true);
        setError(null);
        try {
            const data = await getPurchase(page, searchQuery);
            setPurchases(data.results);
            setCurrentPage(page);
            setTotalItems(data.count);
        } catch (err) {
            setError('Terjadi kesalahan dalam memuat data.' + err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPurchase();
    }, []);

    const handleSearch = () => {
        fetchPurchase(0, searchQuery);
    };

    const handleChangePage = (event, page) => {
        fetchPurchase(page - 1, searchQuery);
        setCurrentPage(page - 1);
    };

    const handleSelectPage = (event) => {
        const page = parseInt(event.target.value, 10) - 1;
        fetchPurchase(page, searchQuery);
        setCurrentPage(page);
    };


    const handleEditButton = (purchaseId) => {
        navigate(`/purchase/edit/${purchaseId}`);
    }

    // <=== Handle Dialog & Notification ===>
    const handleOpenDeleteDialog = (purchaseId) => {
        setSelectedIdPurchase(purchaseId);
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


    const onDeletePurchase = async () => {
        try {
            await deletePurchase(selectedIdPurchase);
            fetchPurchase(currentPage);
            setOpenDeleteDialog(false);
            showNotification('Data Purchase berhasil dihapus!', 'success');
        } catch (err) {
            setError('Terjadi kesalahan dalam menghapus data purchase.');
            showNotification('Terjadi kesalahan dalam menghapus data.', 'error');
        }
    };


    return (
        <section className="card">
            <Box p={3}>
                <Typography variant="h4" gutterBottom>Daftar Purchase / Pembelian</Typography>

                <Box display="flex" gap={2} mb={2}>
                    <TextField
                        label="Cari berdasarkan purchase invoice"
                        variant="outlined"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button variant="contained" color="primary" onClick={handleSearch}>Cari</Button>
                    <Link to="/purchase/create" activeclassname="active" style={{ color: "white", display: 'inline-flex' }}>
                        <Button variant="contained" color="secondary" startIcon={<AddIcon />} >
                            Create Purchase
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
                                    <TableCell>Purchase Invoice</TableCell>
                                    <TableCell>Tanggal Pembelian</TableCell>
                                    <TableCell>Supplier</TableCell>
                                    <TableCell>Total Payment</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {purchases.map((purchase, index) => (
                                    <TableRow key={purchase.id}>
                                        <TableCell>{index + 1 + currentPage * rowsPerPage}</TableCell>
                                        <TableCell>{purchase.purchase_invoice}</TableCell>
                                        <TableCell>{dayjs(purchase.purchase_date).format('DD-MM-YYYY')}</TableCell>
                                        <TableCell>{purchase.supplier.name}</TableCell>
                                        <TableCell>{Number(purchase.total_payment).toLocaleString("id-ID", {
                                            style: "currency",
                                            currency: "IDR"
                                        })}</TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => handleEditButton(purchase.id)} >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton onClick={() => handleOpenDeleteDialog(purchase.id)}>
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
                            Apakah Anda yakin ingin menghapus data purchase ini?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDeleteDialog} color="primary">
                            Batal
                        </Button>
                        <Button onClick={onDeletePurchase} color="secondary">
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

export default PurchasePage;