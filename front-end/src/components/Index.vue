<template>
  <div class="list">
    <h1>Users List</h1>
    <p v-if="error"> {{ error }} </p>
    <ul>
      <li
        v-for="(user, index) in users"
        :key="index"
      >
        {{ user.name }}
      </li>
    </ul>
  </div>
</template>

<script>
import UsersService from '../services/UsersService';

export default {
  name: 'users-list',
  data() {
    return {
      users: [],
      error: ''
    };
  },
  methods: {
    getUsers() {
      UsersService.getAll()
        .then(response => {
          console.log(response);

          this.users = response.data;
        })
        .catch(e => {
          console.log(e.response);

          this.error = e.response.data.error;
        });
    }
  },
  mounted() {
    this.getUsers();
  }
}
</script>

<style scoped>
.list {
  max-width: 750px;
  margin: auto;
  text-align: center;
}
</style>
