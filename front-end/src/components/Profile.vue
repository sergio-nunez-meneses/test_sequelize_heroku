<template>
  <div class="container-fluid m-auto border">
    <div class="row">
      <div class="col-md-12">
        <div class="w-75 m-auto">
          <div class="col-md-12">
            <h3 class="p-3 text-center"> {{ currentUser.name }} </h3>
          </div>
          <div class="my-auto p-3 text-center">
            <ul class="list-group">
              <li class="list-group-item">
                {{ currentUser.accessToken.substring(0, 20) }}...{{ currentUser.accessToken.substr(currentUser.accessToken.length - 20) }}
              </li>
              <li class="list-group-item"> {{ currentUser.id }} </li>
              <li class="list-group-item"> {{ currentUser.email }} </li>
              <li class="list-group-item"> {{ currentUser.role }} </li>
            </ul>
          </div>
          <div v-if=" currentUser.role === 'Admin' ">
            <router-link
              v-for="(endpoint, index) in allowedEndpoints"
              :key="index"
              :to="endpoint"
              class="btn w-100 my-1 bg-primary text-white"
            >
              {{
                endpoint
                  .substring(1)
                  .charAt(0)
                  .toUpperCase()
                  .concat(endpoint.substring(2))
              }} List
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'user-profile',
  data() {
    return {
      allowedEndpoints: ['/farmers', '/farms', '/users']
    }
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    }
  },
  mounted() {
    if (!this.currentUser) {
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
/*  */
</style>
