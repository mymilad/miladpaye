// services/api.ts
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'https://lunaview.ir/api',
  timeout: 10000,
});
