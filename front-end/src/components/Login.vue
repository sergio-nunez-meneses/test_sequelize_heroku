<template>
  <div class="row">
    <div class="col-md-12">
      <h3 class="p-3 text-center">Welcome</h3>
      <form name="form" class="w-50 m-auto" @submit.prevent="validateLogin">
        <div class="form-group">
          <input class="form-control"
            v-model="user.email"
            type="text"
            name="email"
            placeholder="email"
          />
        </div>
        <div class="form-group">
          <input class="form-control"
            v-model="user.password"
            type="password"
            name="password"
            placeholder="password"
          />
        </div>
        <div class="form-group">
          <button class="btn w-100 bg-primary text-white">
            Login
          </button>
        </div>
      </form>
      <div v-if="error" class="alert p-3 alert-danger text-center">
        <p> {{ error }} </p>
      </div>
    </div>
  </div>
</template>

<script>
import User from '../models/user';

export default {
  name: 'login',
  data() {
    return {
      user: new User(),
      error: ''
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    }
  },
  created() {
    if (this.loggedIn) {
      this.$router.push('/profile');
    }
  },
  methods: {
    validateLogin() {
      if (this.user.email && this.user.password) {
        this.$store.dispatch('auth/login', this.user)
          .then(() => {
              this.$router.push('/profile');
            })
          .catch(e => {
            this.loading = false;
            this.error = e.response.data.error;
          });
      }
    }
  },
  mounted() {
    console.log('route path:', this.$route.path);
  }
};
</script>

<style scoped>
.form-group {
  margin: 0.5rem 0;
}
</style>
