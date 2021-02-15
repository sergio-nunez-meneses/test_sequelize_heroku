<template>
  <div class="form">
    <form name="form" @submit.prevent="validateLogin">
      <input
        v-model="user.email"
        type="text"
        name="email"
        placeholder="email"
      />
      <input
      v-model="user.password"
        type="password"
        name="password"
        placeholder="password"
      />
      <button class="btn btn-primary btn-block" :disabled="loading">
        Login
      </button>
      <p class="error" v-if="message"> {{ message }} </p>
    </form>
  </div>
</template>

<script>
import User from '../models/user';

export default {
  name: 'login',
  data() {
    return {
      user: new User(),
      loading: false,
      message: ''
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
          .then(
            () => {
              this.$router.push('/profile');
            },
            error => {
              this.loading = false;
              this.message =
                (error.response && error.response.data) ||
                error.message ||
                error.toString();
            }
          );
      }
    }
  }
};
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  width: 75%;
  margin: auto;
}

input, button {
  margin: 0.125rem 0;
}

.error {
  text-align: center;
}
</style>
