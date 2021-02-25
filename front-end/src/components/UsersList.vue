<template>
  <div class="row">
    <div class="col-md-12">
      <div class="d-flex justify-content-center align-items-center my-1 p-1">
        <h3 class="px-5 text-center">Current Users</h3>
        <img class="img-fluid h-auto rounded-circle header-img" src="@/assets/header-icons/farmer-man-dog.png">
      </div>
    </div>
    <div v-if="!error" class="row align-items-center">
      <div class="col-md-12">
        <div class="input-group p-3">
          <input type="text" class="form-control" placeholder="e.g. name=foo, name=foo&amp;email=foo"
            v-model="query"
            @change="textCounter($event)"
          />
          <div class="input-group-append">
            <button class="btn w-100 bg-success text-white releaseBtn" type="button"
              @click="searchBy($event)"
            >
              Search
            </button>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="my-auto p-3">
          <ul class="list-group">
            <li class="list-group-item d-flex justify-content-between align-items-center"
              :class="{ active: index == currentIndex }"
              v-for="(user, index) in users"
              :key="index"
              @click="setActiveUser(user, index)"
            >
              <img class="img-fluid h-auto rounded-circle icon-img"
                :src="profileIcon"
              >
              {{ user.name }}
            </li>
          </ul>
          <button class="btn w-100 my-1 btn-danger releaseBtn"
            @click="deleteUsers($event)"
          >
            Delete All
          </button>
        </div>
      </div>
      <div class="col-md-8 m-auto">
        <div v-if="currentUser" class="p-3">
          <div class="input-group">
            <input type="text" class="form-control" name="id" readonly
              v-model="currentUser.id"
            />
            <div class="input-group-append">
              <span class="input-group-text d-flex fas fa-id-card"></span>
            </div>
          </div>
          <div class="input-group">
            <input type="text" class="form-control" name="name" readonly
              v-model="currentUser.name"
              @click="showHideInput('show', $event)"
              @focusout="showHideInput('hide', $event)"
            />
            <div class="input-group-append">
              <span class="input-group-text d-flex fas fa-user"></span>
            </div>
          </div>
          <div class="input-group">
            <input type="text" class="form-control" name="email" readonly
              v-model="currentUser.email"
              @click="showHideInput('show', $event)"
              @focusout="showHideInput('hide', $event)"
            />
            <div class="input-group-append">
              <span class="input-group-text d-flex fas fa-envelope"></span>
            </div>
          </div>
          <div class="input-group">
            <input type="text" class="form-control" name="role" readonly
              v-model="currentUser.role"
              @click="showHideInput('show', $event)"
              @focusout="showHideInput('hide', $event)"
            />
            <div class="input-group-append">
              <span class="input-group-text d-flex fas fa-user-check"></span>
            </div>
          </div>
          <button type="submit" class="btn w-100 my-1 btn-warning text-white releaseBtn"
            @click="updateUser($event)"
          >
            Update
          </button>
          <button class="btn w-100 my-1 btn-danger text-white releaseBtn"
            @click="deleteUser($event)"
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
    <div v-else-if="success" class="col-md-12 mt-5">
      <div class="alert p-3 alert-success text-center">
        <p> {{ success }} </p>
      </div>
    </div>
    <div v-else-if="error" class="col-md-12 mt-5">
      <div class="alert p-3 alert-danger text-center">
        <p> {{ error }} </p>
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
      profileIcon: '',
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
    randomProfileIcons() {
      var profileIcons = ['unknown1', 'unknown2', 'girl', 'boy', 'woman', 'man'];

      this.profileIcon = require('@/assets/profile-icons/profile-' + profileIcons[Math.floor(Math.random() * profileIcons.length)] + '.png');
    },

    textCounter(event) {
      if (event.target.textLength == 0) {
        this.getUsers();
      }
    },

    showHideInput(action, event) {
      if (action === 'show' && event.target.readOnly) {
        event.target.readOnly = false;
      } else if (action === 'hide' && !event.target.readOnly) {
        event.target.readOnly = true;
      }
    },

    pressReleaseEffect(btn) {
      if (btn.classList.contains('releaseBtn')) {
        btn.classList.remove('releaseBtn');
        btn.classList.add('pressBtn');
      } else {
        btn.classList.remove('pressBtn');
        btn.classList.add('releaseBtn');
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
          this.users = [];

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

    updateUser(event) {
      this.pressReleaseEffect(event.target);

      MainService.updateOne(`users/${this.currentUser.id}`, this.currentUser)
        .then(response => {
          console.log(response);

          this.pressReleaseEffect(event.target);
          this.successMsg = response.data.message;

          setTimeout(() => {
            this.successMsg = '';
            this.getUsers();
          }, 2000);
        })
        .catch(e => {
          console.log(e.response);

          this.pressReleaseEffect(event.target);
          this.errorMsg = e.response.data.error;
        });
    },

    deleteUsers(event) {
      this.pressReleaseEffect(event.target);

      MainService.deleteAll('users')
        .then(response => {
          console.log(response);

          this.pressReleaseEffect(event.target);
          this.success = response.data.message;

          setTimeout(() => {
            this.users = [];
            this.getUsers();
          }, 10);
        })
        .catch(e => {
          console.log(e.response);

          this.pressReleaseEffect(event.target);
          this.error = e.response.data.error;
        });
    },

    deleteUser(event) {
      this.pressReleaseEffect(event.target);

      MainService.deleteOne(`users/${this.currentUser.id}`)
        .then(response => {
          console.log(response);

          this.pressReleaseEffect(event.target);
          this.successMsg = response.data.message;

          setTimeout(() => {
            this.currentUser = null;
            this.successMsg = '';
            this.getUsers();
          }, 2000);
        })
        .catch(e => {
          console.log(e.response);

          this.pressReleaseEffect(event.target);
          this.errorMsg = e.response.data.error;
        });
    },

    searchBy(event) {
      this.pressReleaseEffect(event.target);

      MainService.getBy('users', this.query)
        .then(response => {
          console.log(response.data);

          this.pressReleaseEffect(event.target);
          this.users = response.data;
        })
        .catch(e => {
          console.log(e.response);

          this.pressReleaseEffect(event.target);
          this.error = e.response.data.error;
        });
    }
  },
  mounted() {
    console.log('route path:', this.$route.path);
    
    this.getUsers();
    this.randomProfileIcons();
  }
}
</script>

<style scoped>
.header-img {
  width: 125px;
}

.icon-img {
  width: 50px;
}

.input-group {
  margin: 0.5rem 0;
}

input {
  padding: 1.5rem 0.75rem ;
}

span {
  width: 45px;
}

button {
  border-top-width: 0.0625rem !important;
}

.releaseBtn {
  border-bottom-width: calc(0.2rem + 0.0625rem) !important;
  border-color: rgba(0, 0, 0, 0.2) !important;
}

.pressBtn {
  border-top-width: calc(0.2rem + 0.0625rem) !important;
  border-bottom-width: 0.0625rem !important;
}
</style>
