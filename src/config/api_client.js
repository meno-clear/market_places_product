import axios from 'axios';
import {API_ENDPOINT} from './constants.js'

const api_client = axios.create({
  baseURL: API_ENDPOINT,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Accept': '*/*'
  }
})

export default api_client;
