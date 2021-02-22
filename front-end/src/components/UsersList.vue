<template>
  <div>
    <div class="row">
      <div class="col-md-12">
        <h3 class="p-3 text-center">Current Users</h3>
      </div>
    </div>
    <div v-if="!error" class="row align-items-center">
      <div class="col-md-12">
        <div class="input-group my-auto p-3">
          <input type="text" class="form-control" placeholder="e.g. name=foo, name=foo&amp;email=foo@bar.fr"
            v-model="query"
            @change="textCounter($event)"
          />
          <div class="input-group-append">
            <button class="btn btn-outline-success" type="button"
              @click="findBy"
            >
              Search
            </button>
          </div>
        </div>
      </div>
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
          <button class="btn w-100 my-1 btn-danger"
            @click="deleteUsers"
          >
            Delete All
          </button>
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
            <li class="list-group-item"
              @click="showHideInput('show', $event)"
            >
              <strong>Role:</strong> {{ currentUser.role }}
            </li>
            <input form="updateUser" type="text" class="form-control d-none"
              v-model="currentUser.role"
              @focusout="showHideInput('hide', $event)"
            />
          </ul>
          <button type="submit" class="btn w-100 my-1 btn-warning text-white"
            @click="updateUser"
          >
            Update
          </button>
          <button class="btn w-100 my-1 btn-danger text-white"
            @click="deleteUser"
          >
            Delete
          </button>
          <div v-if="successMsg" class="alert p-3 alert-success text-center">
            <p> {{ successMsg }} </p>
          </div>
          <div v-if="errorMsg" class="alert p-3 alert-success text-center">
            <p> {{ errorMsg }} </p>
          </div>
        </div>
        <div v-else class="p-3">
          <p class="text-center">Click on an user to edit it...</p>
        </div>
      </div>
    </div>
    <div v-else-if="success">
      <div class="col-md-12">
        <div class="alert p-3 alert-success text-center">
          <p> {{ success }} </p>
        </div>
      </div>
    </div>
    <div v-else-if="error">
      <div class="col-md-12">
        <div class="alert p-3 alert-danger text-center">
          <p> {{ error }} </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MainService from '../services/MainService';

export default {
  name: 'users-list',
  data() {
    return {
      users: [],
      currentUser: null,
      currentIndex: -1,
      query: '',
      success: '',
      successMsg: '',
      error: '',
      errorMsg: ''
    };
  },
  methods: {
    showHideInput(action, event) {
      if (action === 'show') {
        var input = event.target.nextSibling;

        if (input.classList.contains('d-none')) {
          input.classList.remove('d-none');
          event.target.classList.add('d-none');
        }
      } else if (action === 'hide') {
        var listElement = event.target.previousSibling;

        if (listElement.classList.contains('d-none')) {
          listElement.classList.remove('d-none');
          event.target.classList.add('d-none');
        }
      }
    },

    setActiveUser(user, index) {
      this.currentUser = user;
      this.currentIndex = index;
    },

    getUsers() {
      MainService.getAll('users')
        .then(response => {
          console.log(response.data);

          var loggedUser = this.$store.state.auth.user;

          for (var [key, value] of Object.entries(response.data)) {
            if (value.name === loggedUser.name) {
              continue;
            }

            this.users.push(response.data[key]);
          }
        })
        .catch(e => {
          console.log(e.response);

          this.error = e.response.data.error;
        });
    },

    updateUser() {
      MainService.updateOne(`users/${this.currentUser.id}`, this.currentUser)
        .then(response => {
          console.log(response);

          this.successMsg = response.data.message;

          setTimeout(() => {
            this.successMsg = '';
            this.getUsers();
          }, 2000);
        })
        .catch(e => {
          console.log(e.response);

          this.errorMsg = e.response.data.error;
        });
    },

    deleteUsers() {
      MainService.deleteAll('users')
        .then(response => {
          console.log(response);

          this.success = response.data.message;

          setTimeout(() => {
            this.users = [];
            this.getUsers();
          }, 10);
        })
        .catch(e => {
          console.log(e.response);

          this.error = e.response.data.error;
        });
    },

    deleteUser() {
      MainService.deleteOne(`users/${this.currentUser.id}`)
        .then(response => {
          console.log(response);

          this.successMsg = response.data.message;

          setTimeout(() => {
            this.currentUser = null;
            this.successMsg = '';
            this.getUsers();
          }, 2000);
        })
        .catch(e => {
          console.log(e.response);

          this.errorMsg = e.response.data.error;
        });
    },

    findBy() {
      MainService.getBy('users', this.query)
        .then(response => {
          console.log(response.data);

          this.users = response.data;
        })
        .catch(e => {
          console.log(e.response);

          this.error = e.response.data.error;
        });
    },

    textCounter(event) {
      if (event.target.textLength == 0) {
        this.getUsers();
      }
    }
  },
  mounted() {
    this.getUsers();
    console.log('route path:', this.$route.path);
  }
}
</script>

<style scoped>
/*  */
</style>
