<template>
  <div class="row">
    <div class="col-md-12">
      <div class="d-flex justify-content-center align-items-center my-1 p-1">
        <h3 class="px-5 text-center">Current Farmers</h3>
        <img class="img-fluid rounded-circle" src="@/assets/farm-woman-01.png">
      </div>
    </div>
    <div v-if="!error" class="row">
      <div class="col-md-12">
        <div class="input-group p-3">
          <input type="text" class="form-control" placeholder="e.g. name=foo, name=foo&amp;email=foo@bar.fr"
            v-model="query"
            @change="textCounter($event)"
          />
          <div class="input-group-append">
            <button class="btn bg-success text-white" type="button"
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
              v-for="(farmer, index) in farmers"
              :key="index"
              @click="setActiveFarmer(farmer, index)"
            >
              <img class="icon-img img-fluid rounded-circle"
                :src="randomProfileIcons()"
              >
              {{ farmer.name }}
            </li>
          </ul>
          <button class="btn w-100 my-1 btn-danger"
            @click="deleteFarmers($event)"
          >
            Delete All
          </button>
        </div>
      </div>
      <div class="col-md-8 m-auto">
        <div v-if="currentFarmer" class="p-3">
          <div class="input-group">
            <input type="text" class="form-control" name="id" readonly
              v-model="currentFarmer.id"
            />
            <div class="input-group-append">
              <span class="input-group-text fas fa-id-card"></span>
            </div>
          </div>
          <div class="input-group">
            <input type="text" class="form-control" name="name" readonly
              v-model="currentFarmer.name"
            />
            <div class="input-group-append">
              <span class="input-group-text fas fa-user"></span>
            </div>
          </div>
          <div class="input-group">
            <input type="text" class="form-control" name="email" readonly
              v-model="currentFarmer.email"
              @click="showHideInput('show', $event)"
              @focusout="showHideInput('hide', $event)"
            />
            <div class="input-group-append">
              <span class="input-group-text fas fa-envelope"></span>
            </div>
          </div>
          <div class="input-group">
            <input type="text" class="form-control" name="phone" readonly
              v-model="currentFarmer.phone"
              @click="showHideInput('show', $event)"
              @focusout="showHideInput('hide', $event)"
            />
            <div class="input-group-append">
              <span class="input-group-text fas fa-phone"></span>
            </div>
          </div>
          <button type="submit" class="btn w-100 my-1 btn-warning text-white"
            @click="updateFarmer($event)"
          >
            Update
          </button>
          <button class="btn w-100 my-1 btn-danger text-white"
            @click="deleteFarmer($event)"
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
          <p class="text-center">Click on an farmer to edit it...</p>
        </div>
      </div>
    </div>
    <div v-else-if="success" class="col-md-12">
      <div class="alert p-3 alert-success text-center">
        <p> {{ success }} </p>
      </div>
    </div>
    <div v-else-if="error" class="col-md-12">
      <div class="alert p-3 alert-danger text-center">
        <p> {{ error }} </p>
      </div>
    </div>
  </div>
</template>

<script>
import MainService from '../services/MainService';

export default {
  name: 'farmers-list',
  data() {
    return {
      farmers: [],
      currentFarmer: null,
      currentIndex: -1,
      query: '',
      success: '',
      successMsg: '',
      error: '',
      errorMsg: ''
    }
  },
  methods: {
    randomProfileIcons() {
      var profileIcons = ['unknown1', 'unknown2', 'girl', 'boy', 'woman', 'man'];

      return require('@/assets/profile-icons/profile-' + profileIcons[Math.floor(Math.random() * profileIcons.length)] + '.png');
    },

    textCounter(event) {
      if (event.target.textLength == 0) {
        this.getFarmers();
      }
    },

    showHideInput(action, event) {
      if (action === 'show' && event.target.readOnly) {
        event.target.readOnly = false;
      } else if (action === 'hide' && !event.target.readOnly) {
        event.target.readOnly = true;
      }
    },

    pressBtnEffect(btn) {
      if (!btn.classList.contains('pressedBtn')) {
        btn.classList.add('pressedBtn');
      } else {
        btn.classList.remove('pressedBtn');
      }
    },

    setActiveFarmer(farmer, index) {
      this.currentFarmer = farmer;
      this.currentIndex = index;

      console.log(this.currentFarmer);
    },

    getFarmers() {
      MainService.getAll('farmers')
        .then(response => {
          console.log(response);

          this.farmers = response.data;
        })
        .catch(e => {
          console.log(e.response);

          this.error = e.response.data.error;
        });
    },

    updateFarmer(event) {
      this.pressBtnEffect(event.target);

      MainService.updateOne(`farmers/${this.currentFarmer.id}`, this.currentFarmer)
        .then(response => {
          console.log(response);

          this.pressBtnEffect(event.target);
          this.successMsg = response.data.message;

          setTimeout(() => {
            this.successMsg = '';
            this.getFarmers();
          }, 2000);
        })
        .catch(e => {
          console.log(e.response);

          this.pressBtnEffect(event.target);
          this.errorMsg = e.response.data.error;
        });
    },

    deleteFarmers(event) {
      this.pressBtnEffect(event.target);

      MainService.deleteAll('farmers')
        .then(response => {
          console.log(response);

          this.pressBtnEffect(event.target);
          this.success = response.data.message;

          setTimeout(() => {
            this.farmers = [];
            this.getFarmers();
          }, 10);
        })
        .catch(e => {
          console.log(e.response);

          this.pressBtnEffect(event.target);
          this.error = e.response.data.error;
        });
    },

    deleteFarmer(event) {
      this.pressBtnEffect(event.target);

      MainService.deleteOne(`farmers/${this.currentFarmer.id}`)
        .then(response => {
          console.log(response);

          this.pressBtnEffect(event.target);
          this.successMsg = response.data.message;

          setTimeout(() => {
            this.currentFarmer = null;
            this.successMsg = '';
            this.getFarmers();
          }, 2000);
        })
        .catch(e => {
          console.log(e.response);

          this.pressBtnEffect(event.target);
          this.errorMsg = e.response.data.error;
        });
    },

    searchBy(event) {
      this.pressBtnEffect(event.target);

      MainService.getBy('farmers', this.query)
        .then(response => {
          console.log(response.data);

          this.pressBtnEffect(event.target);
          this.farmers = response.data;
        })
        .catch(e => {
          console.log(e.response);

          this.pressBtnEffect(event.target);
          this.error = e.response.data.error;
        });
    }
  },
  mounted() {
    this.getFarmers();
    console.log('route path:', this.$route.path);
  }
}
</script>

<style scoped>
img {
  width: 100px;
  height: auto;
}

.icon-img {
  width: 50px;
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
