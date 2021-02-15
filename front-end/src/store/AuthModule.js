import AuthService from '../services/AuthService';

const user = JSON.parse(localStorage.getItem('user'));
const initialState = user
  ? { user, status: { loggedIn: true }  }
  : { user: null, status: { loggedIn: false } };

export const auth = {
  namespaced: true,
  state: initialState,
  // default state
  // state: {
  //   user: null,
  //   status: {
  //     loggedIn: false
  //   }
  // }
  actions: {
    login({ commit }, user) {
      return AuthService.login(user)
        .then(
          user => {
            commit('loginSuccess', user);
            return Promise.resolve(user);
          },
          error => {
            commit('loginFailure');
            return Promise.reject(error);
          }
        );
    }
  },
  mutations: {
    loginSuccess(state, user) {
      state.status.loggedIn = true;
      state.user = user;
    },
    loginFailure(state) {
      state.status.loggedIn = false;
      state.user = null;
    }
  }
};
