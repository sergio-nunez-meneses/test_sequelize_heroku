// import http from '../http-common';
import axios from 'axios';
import authHeader from './AuthHeader';

const API_URL = 'http://localhost:3000/api';

class UsersService {
  getAll() {
    // return http.get('/users');
    return axios.get(API_URL + '/users', {
      headers: authHeader()
    });
  }
}

export default new UsersService();
