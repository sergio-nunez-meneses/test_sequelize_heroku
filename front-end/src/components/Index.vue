<template>
  <div class="list">
    <h1>Users List</h1>
    <p> {{ error ? error.message : '' }} </p>
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
import UsersDataService from '../services/UsersDataService';

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
      UsersDataService.getAll()
        .then(response => {
          console.log(response.data);

          this.users = response.data;
        })
        .catch(e => {
          console.log(e);

          this.error = e;
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
  text-align: center;
  max-width: 750px;
  margin: auto;
}
</style>
