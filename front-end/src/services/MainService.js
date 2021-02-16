import axios from 'axios';
import authHeader from './AuthHeader';

const api_url = 'http://localhost:3000/api/';
const headers = { headers: authHeader() };

class MainService {
  getAll(instance) {
    return axios.get(api_url + instance, headers);
  }

  deleteAll(instance) {
    return axios.delete(api_url + instance, headers);
  }
}

export default new MainService();
