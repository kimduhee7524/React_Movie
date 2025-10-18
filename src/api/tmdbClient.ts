import axios from 'axios';

const ACCESS_TOKEN = import.meta.env.VITE_API_TOKEN;
export const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TIMEOUT = 30000;

export const tmdbClient = axios.create({
  baseURL: TMDB_BASE_URL,
  headers: {
    Accept: 'application/json',
    Authorization: `Bearer ${ACCESS_TOKEN}`,
  },
  timeout: TIMEOUT,
});
