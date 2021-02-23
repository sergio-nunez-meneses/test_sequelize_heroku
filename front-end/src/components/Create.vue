<template>
  <div>
    <div class="row">
      <div class="col-md-12">
        <h3 class="p-3 text-center">Create Element</h3>
      </div>
    </div>
    <div class="row">
      <div v-if="!submitted" class="col-md-12">
        <div class="w-75 m-auto">
          <div class="form-group">
            <select class="form-control"
              @click="displayForm($event)"
            >
              <option>Select an element to create</option>
              <option value="farmer">Farmer</option>
              <option value="farm">Farm</option>
              <option value="user">User</option>
            </select>
          </div>
          <div ref="farmerForm" class="d-none">
            <div class="form-group">
              <input type="text" class="form-control" name="name" placeholder="name" required
                v-model="farmer.name"
              />
            </div>
            <div class="form-group">
              <input type="text" class="form-control" name="email" placeholder="email" required
                v-model="farmer.email"
              />
            </div>
            <div class="form-group">
              <input type="text" class="form-control" name="phone" placeholder="phone" required
                v-model="farmer.phone"
              />
            </div>
          </div>
          <div ref="farmForm" class="d-none">
            <div class="form-group">
              <input type="text" class="form-control" name="name" placeholder="name" required
                v-model="farm.name"
              />
            </div>
            <div class="form-group">
              <input type="text" class="form-control" name="address" placeholder="address" required
                v-model="farm.address"
              />
            </div>
            <div class="form-group">
              <input type="text" class="form-control" name="city" placeholder="city" required
                v-model="farm.city"
              />
            </div>
            <div class="form-group">
              <input type="text" class="form-control" name="coordinates" placeholder="coordinates" required
                v-model="farm.coordinates"
              />
            </div>
          </div>
          <div ref="userForm" class="d-none">
            <div class="form-group">
              <input type="text" class="form-control" name="name" placeholder="name" required
                v-model="user.name"
              />
            </div>
            <div class="form-group">
              <input type="text" class="form-control" name="email" placeholder="email" required
                v-model="user.email"
              />
            </div>
            <div class="input-group">
              <input type="password" class="form-control" name="password" placeholder="password" required
                v-model="user.password"
              />
              <div class="input-group-append">
                <i class="input-group-text fas fa-lock"
                  @click="passwordGenerator($event)"
                >
              </i>
              </div>
            </div>
            <div class="form-group">
              <select class="form-control" name="role"
                v-model="user.role"
              >
                <option value="User">User</option>
              </select>
            </div>
          </div>
          <button ref="submitButton" class="btn d-none w-100 btn-primary text-white"
            @click="createElement"
          >
            Submit
          </button>
          <div v-if="error" class="py-3">
            <div class="alert p-3 alert-danger text-center">
              <p> {{ error }} </p>
            </div>
          </div>
        </div>
      </div>
      <div v-else-if="success" class="col-md-12">
        <div class="alert p-3 alert-success text-center">
          <p> {{ success }} </p>
        </div>
        <button class="btn d-none w-100 btn-primary text-white"
          @click="newElement"
        >
          Create New
        </button>
      </div>
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
    displayForm(event) {
      var farmerForm = this.$refs.farmerForm;
      var farmForm = this.$refs.farmForm;
      var userForm = this.$refs.userForm;
      var submitButton = this.$refs.submitButton;
      this.elementName = event.target.value;

      if (this.elementName === 'farmer' && farmerForm.classList.contains('d-none')) {
        farmForm.classList.add('d-none');
        userForm.classList.add('d-none');
        farmerForm.classList.remove('d-none');
        submitButton.classList.remove('d-none');
      } else if (this.elementName === 'farm' && farmForm.classList.contains('d-none')) {
        farmerForm.classList.add('d-none');
        userForm.classList.add('d-none');
        farmForm.classList.remove('d-none');
        submitButton.classList.remove('d-none');
      } else if (this.elementName === 'user' && userForm.classList.contains('d-none')) {
        farmerForm.classList.add('d-none');
        farmForm.classList.add('d-none');
        userForm.classList.remove('d-none');
        submitButton.classList.remove('d-none');
      } else if (event.target.index == 0) {
        farmerForm.classList.add('d-none');
        farmForm.classList.add('d-none');
        userForm.classList.add('d-none');
        submitButton.classList.add('d-none');
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

    passwordGenerator(event) {
      var input = event.target.parentNode.previousSibling;
      var generatedPassword = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);

      console.log(generatedPassword);

      input.value = generatedPassword;
      this.user.password = generatedPassword;
    },

    createElement() {
      var data = this.getFormData();

      MainService.create(this.elementName + 's', data)
        .then(response => {
          console.log(response.data);

          this.submitted = true;
          this.success = response.data.message;
        })
        .catch(e => {
          console.log(e.response);

          this.error = e.response.data.error;
        });
    },

    newElement() {
      if (this.elementName === 'farmer') {
        this.farmer = {};
      } else if (this.elementName === 'farm') {
        this.farm = {};
      } else if (this.elementName === 'user') {
        this.user = {};
      }

      this.submitted = false;
      this.elementName = '';
    }
  }
}
</script>

<style scoped>
/*  */
</style>
