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
} from '@mui/material';
import { Barang, Negara, Pelabuhan } from './types';

const BASE_URL = 'http://202.157.176.100:3001';

const formatRupiah = (value: number): string =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value).replace(',00', '');

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

  const [errorNegara, setErrorNegara] = useState('');
  const [errorPelabuhan, setErrorPelabuhan] = useState('');
  const [errorBarang, setErrorBarang] = useState('');

  const fetchNegaras = async () => {
    try {
      setLoadingNegara(true);
      setErrorNegara('');
      const res = await axios.get(`${BASE_URL}/negaras`);
      setNegaras(res.data);
    } catch (err) {
      setErrorNegara('Gagal mengambil data negara.');
    } finally {
      setLoadingNegara(false);
    }
  };

  const fetchPelabuhans = async (id_negara: string) => {
    try {
      setLoadingPelabuhan(true);
      setErrorPelabuhan('');
      const res = await axios.get(
        `${BASE_URL}/pelabuhans?filter=${encodeURIComponent(
          JSON.stringify({ where: { id_negara } })
        )}`
      );
      setPelabuhans(res.data);
    } catch (err) {
      setErrorPelabuhan('Gagal mengambil data pelabuhan.');
    } finally {
      setLoadingPelabuhan(false);
    }
  };

  const fetchBarangs = async (id_pelabuhan: string) => {
    try {
      setLoadingBarang(true);
      setErrorBarang('');
      const res = await axios.get(
        `${BASE_URL}/barangs?filter=${encodeURIComponent(
          JSON.stringify({ where: { id_pelabuhan } })
        )}`
      );
      setBarangs(res.data);
    } catch (err) {
      setErrorBarang('Gagal mengambil data barang.');
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
    <Container maxWidth="md" sx={{ mt: 4, backgroundColor: 'white', padding: 5 }}>
      <Box mb={3}>
        <InputLabel sx={{ fontWeight: 'bold', color: 'black' }}>Negara</InputLabel>
        <Autocomplete
          options={negaras}
          getOptionLabel={(option) => option.nama_negara}
          loading={loadingNegara}
          value={selectedNegara}
          onChange={(_, value) => setSelectedNegara(value)}
          renderInput={(params) => (
            <TextField
              {...params}
              error={!!errorNegara}
              helperText={errorNegara || ''}
              placeholder="Please select..."
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
          onChange={(_, value) => setSelectedPelabuhan(value)}
          renderInput={(params) => (
            <TextField
              {...params}
              error={!!errorPelabuhan}
              helperText={errorPelabuhan || ''}
              placeholder="Please select..."
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
              error={!!errorBarang}
              helperText={errorBarang || ''}
              placeholder="Please select..."
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

      {selectedBarang && (
        <Box mt={4} mb={4} sx={{ color: 'black' }}>
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
              type="number"
              fullWidth
              value={harga}
              onChange={(e) => setHarga(Number(e.target.value))}
              inputProps={{ min: 0 }}
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

          <Box mb={2}>
            <InputLabel sx={{ fontWeight: 'bold', color: 'black' }}>Total</InputLabel>
            <Typography sx={{fontSize:30, fontWeight:'semi-bold'}}>
              {formatRupiah(total)}
           </Typography>
          </Box>

         
        </Box>
      )}
    </Container>
  );
};

export default App;
