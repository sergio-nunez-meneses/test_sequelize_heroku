<template>
  <div>
    <div class="row">
      <div class="col-md-12">
        <h3 class="p-3 text-center">Current Users</h3>
      </div>
    </div>
    <div v-if="!error" class="row align-items-center">
      <div class="col-md-4">
        <div class="my-auto p-3">
          <ul class="list-group">
            <li class="list-group-item"
              :class="{ active: index == currentIndex }"
              v-for="(user, index) in users"
              :key="index"
              @click="setActiveUser(user, index)"
            >
              {{ user.name }}
            </li>
          </ul>
        </div>
      </div>
      <div class="col-md-8 m-auto">
        <div v-if="currentUser" class="p-3">
          <h3 class="text-center">{{ currentUser.name }}</h3>
          <ul class="list-group">
            <li class="list-group-item">
              <strong>Id:</strong> {{ currentUser.id }}
            </li>
            <li class="list-group-item">
              <strong>Email:</strong> {{ currentUser.email }}
            </li>
            <li class="list-group-item">
              <strong>Role:</strong> {{ currentUser.role }}
            </li>
          </ul>
          <a class="btn w-100 my-1 bg-warning"
            :href="'/users/' + currentUser.id"
          >
            Edit
          </a>
        </div>
        <div v-else class="p-3">
          <p class="text-center">Click on an user to edit it...</p>
        </div>
      </div>
    </div>
    <div v-else >
      <div class="col-md-12">
        <div class="alert p-3 alert-danger text-center">
          <p> {{ error }} </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UsersService from '../services/UsersService';

export default {
  name: 'users-list',
  data() {
    return {
      users: [],
      currentUser: null,
      currentIndex: -1,
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
    },
    setActiveUser(user, index) {
      this.currentUser = user;
      this.currentIndex = index;
    }
  },
  mounted() {
    this.getUsers();
  }
}
</script>

<style scoped>
/*  */
</style>
