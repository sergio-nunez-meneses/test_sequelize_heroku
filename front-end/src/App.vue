<template>
  <div id="app" class="container-fluid">
    <div class="row border">
      <ul class="d-inline-flex justify-content-around w-100 pt-3 list-unstyled">
        <li>
          <router-link to="/users">
            Users List
          </router-link>
        </li>
        <li v-if="!currentUser">
          <router-link to="/">
            Login
          </router-link>
        </li>
        <li v-if="currentUser">
          <router-link to="/profile">
            {{ currentUser.name }}
          </router-link>
        </li>
        <li v-if="currentUser">
          <a href @click.prevent="logout">
            Logout
          </a>
        </li>
      </ul>
    </div>

    <div class="router-container container border my-3 p-5">
      <router-view/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('auth/logout');
      this.$router.push('/');
    }
  }
};
</script>

<style scoped>
.router-container {
  max-width: 768px;
}

a {
  text-decoration: none;
}
</style>
