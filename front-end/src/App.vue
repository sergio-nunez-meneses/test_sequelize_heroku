<template>
  <div id="app">
    <header>
      <ul>
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
    </header>

    <router-view/>
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
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
#app {
  display: flex;
  flex-direction: column;
  max-width: 750px;
  margin: auto;
}

ul {
  display: flex;
  justify-content: space-around;
}

li {
  list-style-type: none;
  text-decoration: none;
}
</style>
