<template>
  <div class="row">
    <div class="col-md-12">
      <div class="d-flex justify-content-center align-items-center my-3 p-3">
        <h3 class="px-5 text-center"> {{ currentUser.name }} </h3>
        <img class="img-fluid h-auto rounded-circle header-img" src="@/assets/profile-icons/profile-man.png">
      </div>
      <div class="w-75 m-auto pt-3 pb-5">
        <div class="input-group">
          <div class="input-group-prepend">
            <span class="input-group-text d-flex fas fa-key"></span>
          </div>
          <input ref="token" type="text" class="form-control" name="token" readonly
            v-model="token"
          />
        </div>
        <div class="input-group">
          <div class="input-group-prepend">
            <span class="input-group-text d-flex fas fa-id-card"></span>
          </div>
          <input type="text" class="form-control" name="id" readonly
            v-model="currentUser.id"
          />
        </div>
        <div class="input-group">
          <div class="input-group-prepend">
            <span class="input-group-text d-flex fas fa-envelope"></span>
          </div>
          <input type="text" class="form-control" name="email" readonly
            v-model="currentUser.email"
            @click="showHideInput('show', $event)"
            @focusout="showHideInput('hide', $event)"
          />
        </div>
        <div class="input-group">
          <div class="input-group-prepend">
            <span class="input-group-text d-flex fas fa-user-tag"></span>
          </div>
          <input type="text" class="form-control" name="role" readonly
            v-model="currentUser.role"
            @click="showHideInput('show', $event)"
            @focusout="showHideInput('hide', $event)"
          />
        </div>
        <button type="submit" class="btn btn-lg w-100 my-1 btn-warning text-white releaseBtn"
          @click="updateUser($event)"
        >
          Update
        </button>
        <div v-if="success" class="alert p-3 alert-success text-center">
          <p> {{ success }} </p>
        </div>
        <div v-if="error" class="alert p-3 alert-danger text-center">
          <p> {{ error }} </p>
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

    updateUser(event) {
      this.pressReleaseEffect(event.target);

      MainService.updateOne(`users/${this.currentUser.id}`, this.currentUser)
        .then(response => {
          console.log(response);

          this.pressReleaseEffect(event.target);
          this.success = response.data.message;

          setTimeout(() => {
            this.success = '';
          }, 2000);
        })
        .catch(e => {
          console.log(e.response);

          this.pressReleaseEffect(event.target);
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
.header-img {
  width: 100px;
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
