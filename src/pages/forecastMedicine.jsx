import { useState, useEffect } from 'react';
import { TextField, Button, Grid, Box, Typography, IconButton, CircularProgress, Snackbar, Alert, Autocomplete, TableContainer, Table, TableHead, TableCell, Paper, TableRow, TableBody } from '@mui/material';
import axios from 'axios';
import { forecastMedicine } from '../services/forecast.service';
import Chart from "react-apexcharts";

const ForecastMedicinePage = () => {
    const [postData, setPostData] = useState({
        medicine_id: '',
        steps: 7,
    })

    useEffect(() => {
        console.log(postData)
    }, [postData])


    //<===========MEDICINE===================>
    const [medicines, setMedicines] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [query, setQuery] = useState('');
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);

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
    //<===========MEDICINE===================>


    //<===========FORECAST===================>
    const [forecastData, setForecastData] = useState([]);
    const [loadingForecast, setLoadingForecast] = useState(false);
    const [chartOptions, setChartOptions] = useState({
        chart: {
            type: "line",
            height: 350,
        },
        xaxis: {
            categories: [],
        },
        title: {
            text: "Forecast Demand Chart",
        },
    });

    useEffect(() => {
        console.log('data' + forecastData)
    }, [forecastData])

    const fetchForecast = async () => {
        if (postData.medicine_id === '') {
            alert("Please select a medicine first!");
            return;
        }
        setLoadingForecast(true);
        try {
            const data = await forecastMedicine(postData)

            const forecast  = data.forecast;

            const categories = forecast.map((item) => item.date.split(" ")[0]);
            const dataSeries = forecast.map((item) => item.forecast);

            setForecastData(forecast);
            setChartOptions((prev) => ({
                ...prev,
                xaxis: { categories },
            }));
        } catch (error) {
            console.error("Error fetching forecast:", error);
        } finally {
            setLoadingForecast(false);
        }
    };
    //<===========FORECAST===================>


    return (
        <section className='card'>
            <Box sx={{ padding: 3 }}>
                <Typography variant="h4" gutterBottom>Prediksi Obat (Forecat Medicine)</Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                        <Autocomplete
                            freeSolo
                            // key={saleDetail[index].medicine || 'default'}
                            options={medicines}
                            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)} // ditampilkan pada field
                            // value={medicines.find((med) => med.id === item.medicine) || null}
                            renderOption={(props, option) => (
                                <li {...props} key={option.id}>
                                    {option.name}
                                </li>
                            )} // ditampilkan pada dropdown
                            loading={isLoading}
                            onInputChange={(e, value) => {
                                setQuery(value);
                                setOffset(0);
                                fetchMedicines(value, 0);
                            }} // Menangkap perubahan pada input textfield
                            // onChange={(e, value) => value && handleSelectMedicine(value, index)} 
                            onChange={(e, value) => {
                                if (value) {
                                    // Jika item dipilih
                                    setPostData((prevState) => ({
                                        ...prevState,
                                        medicine_id: value.id,
                                    }));

                                } else {
                                    // Jika tombol "X" diklik (value === null)
                                    setPostData((prevState) => ({
                                        ...prevState,
                                        medicine_id: '',
                                    }));

                                }
                            }}
                            // Menangkap perubahan pada dropdown (Memilih item dari daftar opsi dropdown.)
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Nama Obat"
                                    required
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
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="Berapa Hari ke Depan"
                            type="number"
                            value={postData.step}
                            fullWidth
                            required
                            onChange={(e) => {
                                setPostData((prevState) => ({
                                    ...prevState,
                                    steps: Number(e.target.value),
                                }));
                            }}
                            InputProps={{ inputProps: { min: 1 } }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={fetchForecast}
                            disabled={loadingForecast}
                            endIcon={
                                loadingForecast ? <CircularProgress size={20} /> : <span>➡️</span>
                            }
                        >
                            Predict
                        </Button>
                    </Grid>
                </Grid>


                {/* Tabel Forecast */}
                {forecastData.length > 0 && (
                    <Box mb={4}>
                        <TableContainer component={Paper} sx={{maxHeight: 400, overflowY:'auto'}}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center" sx={{ fontWeight: "bold" }}>
                                            Date
                                        </TableCell>
                                        <TableCell align="center" sx={{ fontWeight: "bold" }}>
                                            Forecast
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {forecastData.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell align="center">{item.date}</TableCell>
                                            <TableCell align="center">
                                                {item.forecast.toFixed(2)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                )}
                {/* Grafik Forecast */}
                {forecastData.length > 0 && (
                    <Chart
                        options={chartOptions}
                        series={[
                            {
                                name: "Forecast",
                                data: forecastData.map((item) => item.forecast),
                            },
                        ]}
                        type="line"
                        height={350}
                    />
                )}

            </Box>
        </section>
    );
}

export default ForecastMedicinePage;