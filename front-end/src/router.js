import Vue from 'vue';
import Router from 'vue-router';
import Login from './components/Login';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      alias: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('./components/Profile')
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('./components/UsersList')
    },
    {
      path: '/farmers',
      name: 'farmers',
      component: () => import('./components/FarmersList')
    },
    {
      path: '/farms',
      name: 'farms',
      component: () => import('./components/FarmsList')
    },
    {
      path: '/create',
      name: 'create',
      component: () => import('./components/Create')
    }
  ]
});
