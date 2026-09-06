import axios from 'axios';

// Membaca URL backend dari environment variable
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace(/\/+$/, '') + '/';

/**
 * Instance Axios terpusat untuk komunikasi frontend React dengan Backend Node.js/Express Maid.
 * Frontend TIDAK PERNAH memanggil API pihak ketiga (BahteraStore) secara langsung.
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // Timeout 15 detik
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ============================================================================
// REQUEST INTERCEPTOR: Sisipkan Token Pengguna jika tersedia
// ============================================================================
apiClient.interceptors.request.use(
  (config) => {
    try {
      const savedUser = localStorage.getItem('maid_auth_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed.token) {
          config.headers.Authorization = `Bearer ${parsed.token}`;
        }
      }
    } catch {
      // Ignore token parse error
    }

    if (import.meta.env.DEV) {
      console.log(`[Backend API Request] ${config.method?.toUpperCase()} -> ${config.baseURL || ''}${config.url}`);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ============================================================================
// RESPONSE INTERCEPTOR: Global Error Handling
// ============================================================================
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const errorResponse = {
      status: error.response?.status || 0,
      message: 'Terjadi kendala komunikasi dengan backend server.',
      data: error.response?.data,
      isNetworkError: !error.response,
      isTimeout: error.code === 'ECONNABORTED' || error.message?.includes('timeout'),
    };

    if (errorResponse.isTimeout) {
      errorResponse.message = 'Koneksi ke backend server timeout. Silakan coba lagi.';
    } else if (error.response) {
      const serverMsg = error.response.data?.message;
      switch (error.response.status) {
        case 400:
        case 422:
          errorResponse.message = serverMsg || 'Validasi input tidak valid.';
          break;
        case 401:
          errorResponse.message = serverMsg || 'Sesi login telah berakhir. Silakan login kembali.';
          break;
        case 403:
          errorResponse.message = serverMsg || 'Akses ditolak: Anda tidak memiliki wewenang untuk aksi ini.';
          break;
        case 404:
          errorResponse.message = serverMsg || 'Data atau endpoint yang diminta tidak ditemukan.';
          break;
        case 429:
          errorResponse.message = serverMsg || 'Terlalu banyak permintaan. Mohon tunggu beberapa saat.';
          break;
        case 500:
        case 502:
        case 503:
          errorResponse.message = serverMsg || 'Server backend sedang mengalami kendala. Mohon coba sesaat lagi.';
          break;
        default:
          errorResponse.message = serverMsg || 'Terjadi kesalahan respon dari server.';
          break;
      }
    } else if (error.request) {
      errorResponse.message = 'Tidak dapat terhubung ke Backend server (Pastikan backend di port 5000 aktif).';
    }

    return Promise.reject(errorResponse);
  }
);

export default apiClient;
