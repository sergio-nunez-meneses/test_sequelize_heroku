<template>
  <div>
    <div class="row">
      <div class="col-md-12">
        <h3 class="p-3 text-center"> {{ currentUser.name }} </h3>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <div class="w-75 m-auto">
          <div class="my-auto p-3 text-center">
            <form name="updateUser"></form>
            <ul class="list-group">
              <li class="list-group-item">
                <strong>Token:</strong> {{ currentUser.accessToken.substring(0, 20) }}...{{ currentUser.accessToken.substr(currentUser.accessToken.length - 20) }}
              </li>
              <li class="list-group-item">
                <strong>Id:</strong> {{ currentUser.id }}
              </li>
              <li class="list-group-item"
                @click="showInput($event)"
              >
                <strong>Email:</strong> {{ currentUser.email }}
              </li>
              <input form="updateUser" type="text" class="form-control d-none"
                v-model="currentUser.email"
                @focusout="hideInput($event)"
              />
              <li class="list-group-item"
                @click="showInput($event)"
              >
                <strong>Role:</strong> {{ currentUser.role }}
              </li>
              <input form="updateUser" type="text" class="form-control d-none"
                v-model="currentUser.role"
                @focusout="hideInput($event)"
              />
            </ul>
            <button type="submit" class="btn w-100 my-1 btn-warning text-white"
              @click="updateUser"
            >
              Update
            </button>
            <div v-if="success"
              class="alert p-3 alert-success text-center">
              <p> {{ success }} </p>
            </div>
            <div v-if="error">
              <div class="alert p-3 alert-danger text-center">
                <p> {{ error }} </p>
              </div>
            </div>
          </div>
          <!-- <div v-if=" currentUser.role === 'Admin' " class="p-3">
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
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MainService from '../services/MainService';

export default {
  name: 'user-profile',
  data() {
    return {
      allowedEndpoints: ['/farmers', '/farms', '/users'],
      success: '',
      error: ''
    }
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    }
  },
  methods: {
    showInput(event) {
      var listElement = event.target;
      var input = event.target.nextSibling;

      if (input.classList.contains('d-none')) {
        input.classList.remove('d-none');
        listElement.classList.add('d-none');
      }
    },

    hideInput(event) {
      var input = event.target;
      var listElement = event.target.previousSibling;

      if (listElement.classList.contains('d-none')) {
        listElement.classList.remove('d-none');
        input.classList.add('d-none');
      }
    },

    updateUser() {
      MainService.updateOne('users/' + this.currentUser.id, this.currentUser)
        .then(response => {
          console.log(response);

          this.success = 'User updated successfully!';
        })
        .catch(e => {
          console.log(e.response);

          this.error = e.response.data.error;
        });
    },
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
