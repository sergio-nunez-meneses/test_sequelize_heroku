import Vue from 'vue';
import Router from 'vue-router';
import Index from './components/Index';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('./components/Login')
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('./components/Profile')
    }
  ]
});
