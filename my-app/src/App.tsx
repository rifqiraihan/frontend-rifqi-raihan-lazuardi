import { useEffect, useState } from 'react';
import axios from 'axios';

interface Negara {
  id_negara: string;
  kode_negara: string;
  nama_negara: string;
}

interface Pelabuhan {
  id_pelabuhan: string;
  nama_pelabuhan: string;
  id_negara: string;
}

interface Barang {
  id_barang: string;
  id_pelabuhan: string;
  nama_barang: string;
  description: string;
  harga: number;
  diskon: number;
}

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

  const [selectedNegaraId, setSelectedNegaraId] = useState<string>('');
  const [selectedPelabuhanId, setSelectedPelabuhanId] = useState<string>('');
  const [selectedBarangId, setSelectedBarangId] = useState<string>('');

  const [loadingNegara, setLoadingNegara] = useState(false);
  const [loadingPelabuhan, setLoadingPelabuhan] = useState(false);
  const [loadingBarang, setLoadingBarang] = useState(false);

  const [errorNegara, setErrorNegara] = useState('');
  const [errorPelabuhan, setErrorPelabuhan] = useState('');
  const [errorBarang, setErrorBarang] = useState('');

  const selectedBarang = barangs.find((b) => b.id_barang === selectedBarangId) || null;

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
    if (selectedNegaraId) {
      fetchPelabuhans(selectedNegaraId);
      setSelectedPelabuhanId('');
      setSelectedBarangId('');
    }
  }, [selectedNegaraId]);

  useEffect(() => {
    if (selectedPelabuhanId) {
      fetchBarangs(selectedPelabuhanId);
      setSelectedBarangId('');
    }
  }, [selectedPelabuhanId]);

  const total =
    selectedBarang?.harga && selectedBarang?.diskon
      ? selectedBarang.harga * (1 - selectedBarang.diskon / 100)
      : 0;

  return (
    <div style={{ padding: '2rem', maxWidth: '500px', margin: '0 auto' }}>
      <h2>Frontend Test - Rifqi Raihan Lazuardi</h2>

      <div style={{ marginBottom: '1rem' }}>
        <label>
          <strong>Negara</strong>
          <br />
          {loadingNegara ? (
            <p>Loading negara...</p>
          ) : errorNegara ? (
            <p style={{ color: 'red' }}>{errorNegara}</p>
          ) : (
            <select
              value={selectedNegaraId}
              onChange={(e) => setSelectedNegaraId(e.target.value)}
              style={{ width: '100%', padding: '0.5rem' }}
            >
              <option value="">-- Pilih Negara --</option>
              {negaras.map((n) => (
                <option key={n.id_negara} value={n.id_negara}>
                  {n.nama_negara}
                </option>
              ))}
            </select>
          )}
        </label>
      </div>

      {selectedNegaraId && (
        <div style={{ marginBottom: '1rem' }}>
          <label>
            <strong>Pelabuhan</strong>
            <br />
            {loadingPelabuhan ? (
              <p>Loading pelabuhan...</p>
            ) : errorPelabuhan ? (
              <p style={{ color: 'red' }}>{errorPelabuhan}</p>
            ) : (
              <select
                value={selectedPelabuhanId}
                onChange={(e) => setSelectedPelabuhanId(e.target.value)}
                style={{ width: '100%', padding: '0.5rem' }}
              >
                <option value="">-- Pilih Pelabuhan --</option>
                {pelabuhans.map((p) => (
                  <option key={p.id_pelabuhan} value={p.id_pelabuhan}>
                    {p.nama_pelabuhan}
                  </option>
                ))}
              </select>
            )}
          </label>
        </div>
      )}

      {/* Barang */}
      {selectedPelabuhanId && (
        <div style={{ marginBottom: '1rem' }}>
          <label>
            <strong>Barang</strong>
            <br />
            {loadingBarang ? (
              <p>Loading barang...</p>
            ) : errorBarang ? (
              <p style={{ color: 'red' }}>{errorBarang}</p>
            ) : (
              <select
                value={selectedBarangId}
                onChange={(e) => setSelectedBarangId(e.target.value)}
                style={{ width: '100%', padding: '0.5rem' }}
              >
                <option value="">-- Pilih Barang --</option>
                {barangs.map((b) => (
                  <option key={b.id_barang} value={b.id_barang}>
                    {b.nama_barang}
                  </option>
                ))}
              </select>
            )}
          </label>
        </div>
      )}

      {selectedBarang && (
        <div
          style={{
            marginTop: '2rem',
            background: '#f1f1f1',
            padding: '1rem',
            borderRadius: '8px',
          }}
        >
          <p>
            <strong>Deskripsi:</strong> {selectedBarang.description}
          </p>
          <p>
            <strong>Harga:</strong> {formatRupiah(selectedBarang.harga)}
          </p>
          <p>
            <strong>Diskon:</strong> {selectedBarang.diskon}%
          </p>
          <p>
            <strong>Total:</strong> {formatRupiah(total)}
          </p>
        </div>
      )}
    </div>
  );
};

export default App;
