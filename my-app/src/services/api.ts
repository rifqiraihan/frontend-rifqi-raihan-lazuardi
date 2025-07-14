import axios from 'axios';
import { Barang, Negara, Pelabuhan } from '../types';


const BASE_URL = 'http://202.157.176.100:3001';

export const fetchNegaras = async (): Promise<Negara[]> => {
  const res = await axios.get(`${BASE_URL}/negaras`);
  return res.data;
};

export const fetchPelabuhans = async (id_negara: string): Promise<Pelabuhan[]> => {
  const res = await axios.get(
    `${BASE_URL}/pelabuhans?filter=${encodeURIComponent(JSON.stringify({
      where: { id_negara },
    }))}`
  );
  return res.data;
};

export const fetchBarangs = async (id_pelabuhan: string): Promise<Barang[]> => {
  const res = await axios.get(
    `${BASE_URL}/barangs?filter=${encodeURIComponent(JSON.stringify({
      where: { id_pelabuhan },
    }))}`
  );
  return res.data;
};
