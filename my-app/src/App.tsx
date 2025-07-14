import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Autocomplete,
  CircularProgress,
  Container,
  TextField,
  Typography,
  Box,
  InputLabel,
  Snackbar,
  Alert,
} from '@mui/material';
import { Barang, Negara, Pelabuhan } from './types';
import { formatNumber, formatRupiah } from './utils/currency';
import { BASE_URL } from './services/api';


const App: React.FC = () => {
  const [negaras, setNegaras] = useState<Negara[]>([]);
  const [pelabuhans, setPelabuhans] = useState<Pelabuhan[]>([]);
  const [barangs, setBarangs] = useState<Barang[]>([]);

  const [selectedNegara, setSelectedNegara] = useState<Negara | null>(null);
  const [selectedPelabuhan, setSelectedPelabuhan] = useState<Pelabuhan | null>(null);
  const [selectedBarang, setSelectedBarang] = useState<Barang | null>(null);

  const [harga, setHarga] = useState<number>(0);
  const [diskon, setDiskon] = useState<number>(0);

  const [loadingNegara, setLoadingNegara] = useState(false);
  const [loadingPelabuhan, setLoadingPelabuhan] = useState(false);
  const [loadingBarang, setLoadingBarang] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const showError = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const fetchNegaras = async () => {
    try {
      setLoadingNegara(true);
      const res = await axios.get(`${BASE_URL}/negaras`);
      setNegaras(res.data);
    } catch (err) {
      showError('Gagal mengambil data negara.');
    } finally {
      setLoadingNegara(false);
    }
  };

  const fetchPelabuhans = async (id_negara: string) => {
    try {
      setLoadingPelabuhan(true);
      const res = await axios.get(
        `${BASE_URL}/pelabuhans?filter=${encodeURIComponent(
          JSON.stringify({ where: { id_negara } })
        )}`
      );
      setPelabuhans(res.data);
    } catch (err) {
      showError('Gagal mengambil data pelabuhan.');
    } finally {
      setLoadingPelabuhan(false);
    }
  };

  const fetchBarangs = async (id_pelabuhan: string) => {
    try {
      setLoadingBarang(true);
      const res = await axios.get(
        `${BASE_URL}/barangs?filter=${encodeURIComponent(
          JSON.stringify({ where: { id_pelabuhan } })
        )}`
      );
      setBarangs(res.data);
    } catch (err) {
      showError('Gagal mengambil data barang.');
    } finally {
      setLoadingBarang(false);
    }
  };

  useEffect(() => {
    fetchNegaras();
  }, []);

  useEffect(() => {
    if (selectedNegara) {
      fetchPelabuhans(selectedNegara.id_negara);
      setSelectedPelabuhan(null);
      setSelectedBarang(null);
    }
  }, [selectedNegara]);

  useEffect(() => {
    if (selectedPelabuhan) {
      fetchBarangs(selectedPelabuhan.id_pelabuhan);
      setSelectedBarang(null);
    }
  }, [selectedPelabuhan]);

  useEffect(() => {
    if (selectedBarang) {
      setHarga(selectedBarang.harga);
      setDiskon(selectedBarang.diskon);
    }
  }, [selectedBarang]);

  const total = harga * (1 - diskon / 100);

  return (
    <Container maxWidth="md" sx={{ mt: 4, padding: 5 }}>
      <Typography sx={{fontSize:30, fontWeight:'bold', color:'white', textAlign:'center'}}>
          FRONTEND TEST
        </Typography>
      <Box mt={4} mb={4} p={5} sx={{ color: 'black', backgroundColor:'white', borderRadius:8 }}>
          <Box mb={3}>
            <InputLabel sx={{ fontWeight: 'bold', color: 'black' }}>Negara</InputLabel>
            <Autocomplete
              options={negaras}
              getOptionLabel={(option) => option.nama_negara}
              loading={loadingNegara}
              value={selectedNegara}
              onChange={(_, value) => {
                setSelectedNegara(value);
                setSelectedPelabuhan(null);
                setSelectedBarang(null);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Silahkan pilih..."
                  sx={{ backgroundColor: 'white' }}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loadingNegara && <CircularProgress size={20} />}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </Box>

          <Box mb={3}>
            <InputLabel sx={{ fontWeight: 'bold', color: 'black' }}>Pelabuhan</InputLabel>
            <Autocomplete
              options={pelabuhans}
              getOptionLabel={(option) => option.nama_pelabuhan}
              loading={loadingPelabuhan}
              value={selectedPelabuhan}
              disabled={!selectedNegara}
              onChange={(_, value) => {
                setSelectedPelabuhan(value);
                setSelectedBarang(null);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder={!selectedBarang ? "Pilih negara terlebih dahulu" : 'Silahkan pilih...'}
                  sx={{ backgroundColor: 'white' }}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loadingPelabuhan && <CircularProgress size={20} />}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </Box>

          <Box mb={3}>
            <InputLabel sx={{ fontWeight: 'bold', color: 'black' }}>Barang</InputLabel>
            <Autocomplete
              options={barangs}
              getOptionLabel={(option) => option.nama_barang}
              loading={loadingBarang}
              value={selectedBarang}
              disabled={!selectedPelabuhan}
              onChange={(_, value) => setSelectedBarang(value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder={!selectedPelabuhan ? "Pilih pelabuhan terlebih dahulu" : 'Silahkan pilih...'}
                  sx={{ backgroundColor: 'white' }}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loadingBarang && <CircularProgress size={20} />}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </Box>
        </Box>

      {selectedBarang && (
        <Box mt={4} mb={4} p={5} sx={{ color: 'black', backgroundColor:'white', borderRadius:8 }}>
          <Box mb={2}>
            <InputLabel sx={{ fontWeight: 'bold', color: 'black' }}>Deskripsi</InputLabel>
            <TextField
              value={selectedBarang.description}
              multiline
              fullWidth
              minRows={2}
              disabled
              sx={{ backgroundColor: 'white' }}
            />
          </Box>

          <Box mb={2}>
            <InputLabel sx={{ fontWeight: 'bold', color: 'black' }}>Harga</InputLabel>
            <TextField
              type="text"
              fullWidth
              value={formatNumber(harga)}
              onChange={(e) => {
                const cleaned = e.target.value.replace(/[^0-9]/g, '');
                setHarga(Number(cleaned));
              }}
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1 }}>IDR</Typography>,
              }}
              sx={{ backgroundColor: 'white' }}
            />

          </Box>

          <Box mb={2}>
            <InputLabel sx={{ fontWeight: 'bold', color: 'black' }}>Diskon (%)</InputLabel>
            <TextField
              type="number"
              fullWidth
              value={diskon}
              onChange={(e) => setDiskon(Number(e.target.value))}
              inputProps={{ min: 0, max: 100 }}
              sx={{ backgroundColor: 'white' }}
            />
          </Box>

          <Box mt={4} sx={{textAlign:'right'}}>
            <InputLabel sx={{fontSize:25, fontWeight: 'bold', color: 'black' }}>Total</InputLabel>
            <Typography sx={{fontSize:40, fontWeight:'bold', color:'green'}}>
              {formatRupiah(total)}
           </Typography>
          </Box>

         
        </Box>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity="error"
          onClose={() => setSnackbarOpen(false)}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

    </Container>
  );
};

export default App;
