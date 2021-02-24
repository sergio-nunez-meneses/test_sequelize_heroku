<template>
  <div class="row">
    <div class="col-md-12">
      <div class="d-flex justify-content-center align-items-center my-3 p-3">
        <h3 class="px-5 text-center">Local Farmers Editor</h3>
        <img class="img-fluid rounded-circle" src="@/assets/profile_female_01.png">
      </div>
      <div class="w-75 m-auto pt-3 pb-5">
        <div class="input-group">
          <input type="text" class="form-control" name="email" placeholder="email" required
            v-model="user.email"
          />
          <div class="input-group-append">
            <span class="input-group-text fas fa-envelope"></span>
          </div>
        </div>
        <div class="input-group">
          <input type="password" class="form-control" name="password" placeholder="password" required
            v-model="user.password"
          />
          <div class="input-group-append">
            <span class="input-group-text fas fa-eye"
              @click="displayPassword($event)"
            >
          </span>
          </div>
        </div>
        <div class="form-group">
          <button ref="loginBtn" class="w-100 btn btn-lg bg-primary text-white"
            @click="validateLogin"
          >
            Login
          </button>
        </div>
      </div>
      <div v-if="success" class="alert p-3 alert-success text-center">
        <p ref="success"> {{ success }} </p>
      </div>
      <div v-else-if="error" class="alert p-3 alert-danger text-center">
        <p ref="error"> {{ error }} </p>
      </div>
    </div>
  </div>
</template>

<script>
import User from '../models/user';

export default {
  name: 'login',
  data() {
    return {
      user: new User(),
      success: '',
      error: ''
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    }
  },
  created() {
    if (this.loggedIn) {
      this.$router.push('/profile');
    }
  },
  methods: {
    displayPassword(event) {
      var input = event.target.parentNode.previousSibling;

      if (input.type === 'password') {
        input.type = 'text';
      } else if (input.type === 'text') {
        input.type = 'password';
      }
    },

    validateLogin() {
      var btn = this.$refs.loginBtn;

      if (!btn.classList.contains('pressedBtn')) {
        btn.classList.add('pressedBtn');
      }

      if (this.user.email && this.user.password) {
        this.$store.dispatch('auth/login', this.user)
          .then((response) => {
            console.log(response);

            btn.classList.remove('pressedBtn');
            this.$router.push('/profile');
          })
          .catch(e => {
            console.log(e.response);

            btn.classList.remove('pressedBtn');
            this.error = e.response.data.error;
          });
      }
    }
  },
  mounted() {
    console.log('route path:', this.$route.path);
  }
};
</script>

<style scoped>
img {
  width: 100px;
  height: auto;
}

.form-group {
  margin: 1rem 0;
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
