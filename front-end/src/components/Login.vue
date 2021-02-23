<template>
  <div class="row">
    <div class="col-md-12">
      <h3 class="p-3 text-center">Welcome</h3>
      <form name="form" class="w-50 m-auto" @submit.prevent="validateLogin">
        <div class="input-group">
          <input type="text" class="form-control" name="email" placeholder="email" required
            v-model="user.email"
          />
          <div class="input-group-append">
            <i class="input-group-text fas fa-envelope"></i>
          </div>
        </div>

        <!-- <div class="form-group">
          <input class="form-control"
            v-model="user.email"
            type="text"
            name="email"
            placeholder="email"
          />
        </div> -->
        <div class="input-group">
          <input type="password" class="form-control" name="password" placeholder="password" required
            v-model="user.password"
          />
          <div class="input-group-append">
            <i class="input-group-text fas fa-eye"
              @click="displayPassword($event)"
            >
          </i>
          </div>
        </div>
        <!-- <div class="form-group">
          <input class="form-control"
            v-model="user.password"
            type="password"
            name="password"
            placeholder="password"
          />
        </div> -->
        <div class="form-group">
          <button ref="loginBtn" class="btn w-100 bg-primary text-white">
            Login
          </button>
        </div>
      </form>
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
      } else {
        btn.classList.remove('pressedBtn');
      }

      setTimeout(() => {
        if (this.user.email && this.user.password) {
          this.$store.dispatch('auth/login', this.user)
            .then((response) => {
              console.log(response);

              this.$router.push('/profile');
            })
            .catch(e => {
              console.log(e.response);

              this.error = e.response.data.error;
            });
        }
      }, 250);
    }
  },
  mounted() {
    console.log('route path:', this.$route.path);
  }
};
</script>

<style scoped>
.form-group {
  margin: 1rem 0;
}

.input-group {
  margin: 0.5rem 0;
}

i {
  width: 45px;
  height: auto;
}

button {
  border-top-width: .0625rem !important;
  border-bottom-width: calc(.2rem + .0625rem) !important;
  border-color: rgba(0,0,0,0.2) !important;
}

.pressedBtn {
  border-top-width: calc(.2rem + .0625rem) !important;
  border-bottom-width: .0625rem !important;
}
</style>
