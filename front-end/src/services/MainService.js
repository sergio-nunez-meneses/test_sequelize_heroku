import axios from 'axios';
import authHeader from './AuthHeader';

const api_url = 'http://localhost:3000/api/';
const headers = { headers: authHeader() };

class MainService {
  getAll(instance) {
    return axios.get(api_url + instance, headers);
  }

  updateOne(instance, data) {
    return axios.put(api_url + instance, data, headers);
  }

  deleteAll(instance) {
    return axios.delete(api_url + instance, headers);
  }

  deleteOne(instance) {
    return axios.delete(api_url + instance, headers);
  }

  getBy(instance, query) {
    return axios.get(api_url + instance + `?${query}`, headers);
  }
}

export default new MainService();
