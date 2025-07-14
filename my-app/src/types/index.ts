export interface Negara {
    id_negara: string;
    kode_negara: string;
    nama_negara: string;
  }
  
  export interface Pelabuhan {
    id_pelabuhan: string;
    nama_pelabuhan: string;
    id_negara: string;
  }
  
  export interface Barang {
    id_barang: string;
    id_pelabuhan: string;
    nama_barang: string;
    description: string;
    harga: number;
    diskon: number;
  }