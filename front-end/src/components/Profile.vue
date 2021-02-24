<template>
  <!-- <div> -->
    <!-- <div class="row">
      <div class="col-md-12">
        <div class="d-flex justify-content-center align-items-center my-3 p-3">
          <h3 class="px-5 text-center"> {{ currentUser.name }} </h3>
          <img class="img-fluid rounded-circle" src="@/assets/profile_male_01.png">
        </div>
      </div>
    </div> -->
    <div class="row">
      <div class="col-md-12">
        <div class="d-flex justify-content-center align-items-center my-3 p-3">
          <h3 class="px-5 text-center"> {{ currentUser.name }} </h3>
          <img class="img-fluid rounded-circle" src="@/assets/profile_male_01.png">
        </div>
      <!-- </div>
      <div class="col-md-12"> -->
        <div class="w-75 m-auto pt-3 pb-5">
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text fas fa-id-card"></span>
            </div>
            <input type="text" class="form-control" name="id" readonly
              v-model="currentUser.id"
            />
          </div>
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text fas fa-key"></span>
            </div>
            <input ref="token" type="text" class="form-control" name="token" readonly
              v-model="token"
            />
          </div>
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text fas fa-envelope"></span>
            </div>
            <input type="text" class="form-control" name="email" readonly
              v-model="currentUser.email"
              @click="showHideInput('show', $event)"
              @focusout="showHideInput('hide', $event)"
            />
          </div>
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text fas fa-user-tag"></span>
            </div>
            <input type="text" class="form-control" name="role" readonly
              v-model="currentUser.role"
              @click="showHideInput('show', $event)"
              @focusout="showHideInput('hide', $event)"
            />
          </div>
          <!-- <div class="my-auto p-3 text-center"> -->
            <!-- <form name="updateUser"></form> -->
            <!-- <ul class="list-group">
              <li class="list-group-item">
                <strong>Token:</strong> {{ currentUser.accessToken.substring(0, 20) }}...{{ currentUser.accessToken.substr(currentUser.accessToken.length - 20) }}
              </li>
              <li class="list-group-item">
                <strong>Id:</strong> {{ currentUser.id }}
              </li>
              <li class="list-group-item"
                @click="showHideInput('show', $event)"
              >
                <strong>Email:</strong> {{ currentUser.email }}
              </li>
              <input type="text" class="form-control d-none"
                v-model="currentUser.email"
                @focusout="showHideInput('hide', $event)"
              />
              <li class="list-group-item"
                @click="showHideInput('show', $event)"
              >
                <strong>Role:</strong> {{ currentUser.role }}
              </li>
              <input type="text" class="form-control d-none"
                v-model="currentUser.role"
                @focusout="showHideInput('hide', $event)"
              />
            </ul> -->
            <button ref="updateBtn" type="submit" class="btn btn-lg w-100 my-1 btn-warning text-white"
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
          <!-- </div> -->
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
  <!-- </div> -->
</template>

<script>
import MainService from '../services/MainService';

export default {
  name: 'user-profile',
  data() {
    return {
      success: '',
      error: ''
    }
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },

    token() {
      return this.currentUser.accessToken.substring(0, 20) + '...' + this.currentUser.accessToken.substr(this.currentUser.accessToken.length - 20);
    }
  },
  methods: {
    showHideInput(action, event) {
      if (action === 'show' && event.target.readOnly) {
        event.target.readOnly = false;
      } else if (action === 'hide' && !event.target.readOnly) {
        event.target.readOnly = true;
      }

      // if (action === 'show') {
      //   var input = event.target.nextSibling;
      //
      //   if (input.classList.contains('d-none')) {
      //     input.classList.remove('d-none');
      //     event.target.classList.add('d-none');
      //   }
      // } else if (action === 'hide') {
      //   var listElement = event.target.previousSibling;
      //
      //   if (listElement.classList.contains('d-none')) {
      //     listElement.classList.remove('d-none');
      //     event.target.classList.add('d-none');
      //   }
      // }
    },

    updateUser() {
      var btn = this.$refs.updateBtn;

      if (!btn.classList.contains('pressedBtn')) {
        btn.classList.add('pressedBtn');
      }

      MainService.updateOne(`users/${this.currentUser.id}`, this.currentUser)
        .then(response => {
          console.log(response);

          btn.classList.remove('pressedBtn');
          this.success = response.data.message;

          setTimeout(() => {
            this.success = '';
          }, 2000);
        })
        .catch(e => {
          console.log(e.response);

          btn.classList.remove('pressedBtn');
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
img {
  width: 100px;
  height: auto;
}

.input-group {
  margin: 0.5rem 0;
}

input {
  padding: 1.5rem 0.75rem ;
}

span {
  display: flex;
  width: 45px;
}

button {
  border-top-width: 0.0625rem !important;
  border-bottom-width: calc(0.2rem + 0.0625rem) !important;
  border-color: rgba(0, 0, 0, 0.2) !important;
}

.pressedBtn {
  border-top-width: calc(0.2rem + 0.0625rem) !important;
  border-bottom-width: 0.0625rem !important;
}
</style>
