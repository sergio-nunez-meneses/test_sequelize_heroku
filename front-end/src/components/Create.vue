<template>
  <div class="row">
    <div class="col-md-12">
      <div class="d-flex justify-content-center align-items-center my-3 p-3">
        <h3 class="px-5 text-center">Create Element</h3>
        <img class="img-fluid h-auto rounded-circle header-img" src="@/assets/img/icons/composed/combine-front-soil.png">
      </div>
    </div>
    <div v-if="!submitted" class="col-md-12">
      <div class="w-75 mt-5 mb-3 mx-auto">
        <div class="form-group">
          <select class="form-control my-3"
            @click="displayForm($event)"
          >
            <option>Select an element to create</option>
            <option value="farmer">Farmer</option>
            <option value="farm">Farm</option>
            <option value="user">User</option>
          </select>
        </div>
        <div ref="farmerForm" class="d-none my-4">
          <div class="d-flex justify-content-center my-3 p-1">
            <img class="img-fluid h-auto rounded-circle form-img" src="@/assets/img/icons/profiles/profile-unknown1.png">
          </div>
            <div class="input-group">
            <input type="text" class="form-control" name="name" placeholder="name" required
              v-model="farmer.name"
            />
            <div class="input-group-append">
              <span class="input-group-text d-flex fas fa-user"></span>
            </div>
          </div>
          <div class="input-group">
            <input type="text" class="form-control" name="email" placeholder="email" required
              v-model="farmer.email"
            />
            <div class="input-group-append">
              <span class="input-group-text d-flex fas fa-envelope"></span>
            </div>
          </div>
          <div class="input-group">
            <input type="text" class="form-control" name="phone" placeholder="phone" required
              v-model="farmer.phone"
            />
            <div class="input-group-append">
              <span class="input-group-text d-flex fas fa-phone"></span>
            </div>
          </div>
        </div>
        <div ref="farmForm" class="d-none my-4">
          <div class="input-group">
            <input type="text" class="form-control" name="name" placeholder="name" required
              v-model="farm.name"
            />
            <div class="input-group-append">
              <span class="input-group-text d-flex fas fa-user"></span>
            </div>
          </div>
          <div class="input-group">
            <input type="text" class="form-control" name="address" placeholder="address" required
              v-model="farm.address"
            />
            <div class="input-group-append">
              <span class="input-group-text d-flex fas fa-address-card"></span>
            </div>
          </div>
          <div class="input-group">
            <input type="text" class="form-control" name="city" placeholder="city" required
              v-model="farm.city"
            />
            <div class="input-group-append">
              <span class="input-group-text d-flex fas fa-city"></span>
            </div>
          </div>
          <div class="input-group">
            <input type="text" class="form-control" name="coordinates" placeholder="coordinates" required
              v-model="farm.coordinates"
            />
            <div class="input-group-append">
              <span class="input-group-text d-flex fas fa-map-marked-alt"></span>
            </div>
          </div>
        </div>
        <div ref="userForm" class="d-none my-4">
          <div class="d-flex justify-content-center my-3 p-1">
            <img class="img-fluid h-auto rounded-circle form-img" src="@/assets/img/icons/profiles/profile-unknown1.png">
          </div>
          <div class="input-group">
            <input type="text" class="form-control" name="name" placeholder="name" required
              v-model="user.name"
            />
            <div class="input-group-append">
              <span class="input-group-text d-flex fas fa-user"></span>
            </div>
          </div>
          <div class="input-group">
            <input type="text" class="form-control" name="email" placeholder="email" required
              v-model="user.email"
            />
            <div class="input-group-append">
              <span class="input-group-text d-flex fas fa-envelope"></span>
            </div>
          </div>
          <div class="input-group">
            <input type="password" class="form-control" name="password" placeholder="password" required
              v-model="user.password"
            />
            <div class="input-group-append">
              <span class="input-group-text d-flex fas fa-lock"
                @click="passwordGenerator($event)"
              ></span>
            </div>
          </div>
          <div class="input-group">
            <select class="form-control" name="role"
              v-model="user.role"
            >
              <option value="User" selected>User</option>
            </select>
            <div class="input-group-append">
              <span class="input-group-text d-flex fas fa-user-check"></span>
            </div>
          </div>
        </div>
        <button ref="createBtn" class="d-none btn w-100 btn-primary text-white release-btn"
          @click="createElement"
        >
          Create
        </button>
        <div v-if="error" class="py-3">
          <div class="alert p-3 alert-danger text-center">
            <p> {{ error }} </p>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="success" class="col-md-12 my-1">
      <div class="alert p-3 alert-success text-center">
        <p> {{ success }} </p>
      </div>
      <button ref="createNewBtn" class="btn w-100 bg-success text-white release-btn"
        @click="newElement"
      >
        Create New
      </button>
    </div>
  </div>
</template>

<script>
import MainService from '../services/MainService';

export default {
  name: 'create-element',
  data() {
    return {
      elementName: '',
      farmerForm: '',
      farmForm: '',
      userForm: '',
      createBtn: '',
      farmer: {
        id: null,
        name: '',
        email: '',
        phone: ''
      },
      farm: {
        id: null,
        name: '',
        address: '',
        city: '',
        coordinates: ''
      },
      user: {
        id: null,
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: '',
        token: '{}'
      },
      submitted: false,
      success: '',
      error: ''
    }
  },
  methods: {
    pressReleaseEffect(btn) {
      if (btn.classList.contains('release-btn')) {
        btn.classList.remove('release-btn');
        btn.classList.add('press-btn');
      } else {
        btn.classList.remove('press-btn');
        btn.classList.add('release-btn');
      }
    },

    passwordGenerator(event) {
      var input = event.target.parentNode.previousSibling;
      var generatedPassword = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);

      console.log(generatedPassword);

      input.value = generatedPassword;
      this.user.password = generatedPassword;
    },

    displayForm(event) {
      this.elementName = event.target.value;

      if (this.elementName === 'farmer' && this.farmerForm.classList.contains('d-none')) {
        this.farmForm.classList.add('d-none');
        this.userForm.classList.add('d-none');
        this.farmerForm.classList.remove('d-none');
        this.createBtn.classList.remove('d-none');
      } else if (this.elementName === 'farm' && this.farmForm.classList.contains('d-none')) {
        this.farmerForm.classList.add('d-none');
        this.userForm.classList.add('d-none');
        this.farmForm.classList.remove('d-none');
        this.createBtn.classList.remove('d-none');
      } else if (this.elementName === 'user' && this.userForm.classList.contains('d-none')) {
        this.farmerForm.classList.add('d-none');
        this.farmForm.classList.add('d-none');
        this.userForm.classList.remove('d-none');
        this.createBtn.classList.remove('d-none');
      } else if (event.target.index == 0) {
        this.farmerForm.classList.add('d-none');
        this.farmForm.classList.add('d-none');
        this.userForm.classList.add('d-none');
        this.createBtn.classList.add('d-none');
      }
    },

    getFormData() {
      var data;

      if (this.elementName === 'farmer') {
        data = {
          name: this.farmer.name,
          email: this.farmer.email,
          phone: this.farmer.phone
        }
      } else if (this.elementName === 'farm') {
        data = {
          name: this.farm.name,
          address: this.farm.address,
          city: this.farm.city,
          coordinates: this.farm.coordinates
        }
      } else if (this.elementName === 'user') {
        data = {
          name: this.user.name,
          email: this.user.email,
          password: this.user.password,
          confirmPassword: this.user.password,
          role: this.user.role,
        }
      }

      return data;
    },

    createElement() {
      var data = this.getFormData();

      this.pressReleaseEffect(this.createBtn);

      MainService.create(this.elementName + 's', data)
        .then(response => {
          console.log(response.data);

          this.pressReleaseEffect(this.createBtn);
          this.submitted = true;
          this.success = response.data.message;
        })
        .catch(e => {
          if (typeof e.response !== undefined) {
            console.log(e.response);

            this.pressReleaseEffect(this.createBtn);
            this.error = e.response.data.error;
          }
        });
    },

    newElement() {
      var createNewBtn = this.$refs.createNewBtn;
      this.pressReleaseEffect(createNewBtn);

      if (this.elementName === 'farmer') {
        this.farmer = {};
      } else if (this.elementName === 'farm') {
        this.farm = {};
      } else if (this.elementName === 'user') {
        this.user = {};
      }

      this.pressReleaseEffect(createNewBtn);
      this.submitted = false;
      this.elementName = '';
    }
  },
  mounted() {
    this.farmerForm = this.$refs.farmerForm;
    this.farmForm = this.$refs.farmForm;
    this.userForm = this.$refs.userForm;
    this.createBtn = this.$refs.createBtn;
  }
}
</script>

<style scoped>
.header-img {
  width: 225px;
}

.form-img {
  width: 70px;
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

.release-btn {
  border-bottom-width: calc(0.2rem + 0.0625rem) !important;
  border-color: rgba(0, 0, 0, 0.2) !important;
}

.press-btn {
  border-top-width: calc(0.2rem + 0.0625rem) !important;
  border-bottom-width: 0.0625rem !important;
}
</style>
