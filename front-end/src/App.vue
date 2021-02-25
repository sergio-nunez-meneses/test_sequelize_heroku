<template>
  <div id="app" class="container-fluid">
    <div class="row border">
      <ul v-if="currentUser" class="d-inline-flex justify-content-around w-100 pt-3 list-unstyled">
        <li>
          <router-link to="/create">
            Create
          </router-link>
        </li>
        <li>
          <router-link to="/farmers">
            Farmers List
          </router-link>
        </li>
        <li>
          <router-link to="/farms">
            Farms List
          </router-link>
        </li>
        <li>
          <router-link to="/users">
            Users List
          </router-link>
        </li>
        <li>
          <router-link to="/profile">
            {{ currentUser.name }}
          </router-link>
        </li>
        <li>
          <a href @click.prevent="logout">
            Logout
          </a>
        </li>
      </ul>
    </div>

    <div class="router-container border mx-auto my-3 py-2 px-5">
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

router-link, a {
  text-decoration: none;
}
</style>
