import axios from 'axios';

const api_url = 'http://localhost:3000/api/auth/';
axios.defaults.withCredentials = true;

class AuthService {
  login(user) {
    return axios
      .post(api_url + 'login', {
        email: user.email,
        password: user.password
      })
      .then(response => {
        if (response.data.accessToken) {
          localStorage.setItem('user', JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  logout() {
    axios
      .get(api_url + 'logout')
        .then(response => {
          console.log(response);

          localStorage.removeItem('user');
        })
        .catch(e => {
          console.log(e.response);
        })
  }
}

export default new AuthService();
