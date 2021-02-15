<template>
  <div class="user-profile">
    <header>
      <h3> {{ currentUser.name }} </h3>
    </header>
    <main>
      <p>
        {{ currentUser.accessToken.substring(0, 20) }}
        ...
        {{ currentUser.accessToken.substr(currentUser.accessToken.length - 20) }}
      </p>
      <p> {{ currentUser.id }} </p>
      <p> {{ currentUser.email }} </p>
      <p> {{ currentUser.role }} </p>
    </main>
  </div>
</template>

<script>
export default {
  name: 'user-profile',
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
  .user-profile {
    align-self: center;
  }
</style>
