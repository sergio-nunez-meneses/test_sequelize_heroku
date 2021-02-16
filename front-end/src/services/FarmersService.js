// import http from '../http-common';
import axios from 'axios';
import authHeader from './AuthHeader';

const API_URL = 'http://localhost:3000/api';

class FarmersService {
  getAll() {
    // return http.get('/users');
    return axios.get(API_URL + '/farmers', {
      headers: authHeader()
    });
  }
}

export default new FarmersService();
