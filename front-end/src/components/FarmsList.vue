<template>
  <div class="row">
    <div class="col-md-12">
      <div class="d-flex justify-content-center align-items-center my-1 p-1">
        <h3 class="px-5 text-center">Current Farms</h3>
        <img class="img-fluid h-auto rounded-circle header-img" src="@/assets/header-icons/farmer-man-soil.png">
      </div>
    </div>
    <div v-if="!error" class="row align-items-center">
      <div class="col-md-12">
        <div class="input-group my-3 p-3">
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
      <div class="col-md-5">
        <div class="my-auto p-3">
          <ul class="list-group">
            <li class="list-group-item d-flex justify-content-between align-items-center text-justify"
              :class="{ active: index == currentIndex }"
              v-for="(farm, index) in farms"
              :key="index"
              @click="setActiveFarm(farm, index)"
            >
            <img class="img-fluid h-auto rounded-circle icon-img"
              :src="farmIcon"
            >
              {{ farm.name }}
            </li>
          </ul>
          <button class="btn w-100 my-1 btn-danger releaseBtn"
            @click="deleteFarms($event)"
          >
            Delete All
          </button>
        </div>
      </div>
      <div class="col-md-7 m-auto">
        <div v-if="currentFarm" class="p-3">
          <div class="input-group">
            <input type="text" class="form-control" name="id" readonly
              v-model="currentFarm.id"
            />
            <div class="input-group-append">
              <span class="input-group-text d-flex fas fa-id-card"></span>
            </div>
          </div>
          <div class="input-group">
            <input type="text" class="form-control" name="name" readonly
              v-model="currentFarm.name"
              @click="showHideInput('show', $event)"
              @focusout="showHideInput('hide', $event)"
            />
            <div class="input-group-append">
              <span class="input-group-text d-flex fas fa-user"></span>
            </div>
          </div>
          <div class="input-group">
            <input type="text" class="form-control" name="address" readonly
              v-model="currentFarm.address"
              @click="showHideInput('show', $event)"
              @focusout="showHideInput('hide', $event)"
            />
            <div class="input-group-append">
              <span class="input-group-text d-flex fas fa-address-card"></span>
            </div>
          </div>
          <div class="input-group">
            <input type="text" class="form-control" name="city" readonly
              v-model="currentFarm.city"
              @click="showHideInput('show', $event)"
              @focusout="showHideInput('hide', $event)"
            />
            <div class="input-group-append">
              <span class="input-group-text d-flex fas fa-city"></span>
            </div>
          </div>
          <div class="input-group">
            <input type="text" class="form-control" name="coordinates" readonly
              v-model="currentFarm.coordinates"
              @click="showHideInput('show', $event)"
              @focusout="showHideInput('hide', $event)"
            />
            <div class="input-group-append">
              <span class="input-group-text d-flex fas fa-map-marked-alt"></span>
            </div>
          </div>
          <button type="submit" class="btn w-100 my-1 btn-warning text-white releaseBtn"
            @click="updateFarm($event)"
          >
            Update
          </button>
          <button class="btn w-100 my-1 btn-danger text-white releaseBtn"
            @click="deleteFarm($event)"
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
          <p class="text-center">Click on an farm to edit it...</p>
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
  name: 'farms-list',
  data() {
    return {
      farms: [],
      farmIcon: '',
      currentFarm: null,
      currentIndex: -1,
      query: '',
      success: '',
      successMsg: '',
      error: '',
      errorMsg: ''
    }
  },
  methods: {
    randomFarmIcons() {
      var farmIcons = ['barn-01', 'barn-02', 'hot-house', 'mill'];

      this.farmIcon = require('@/assets/farm-icons/farm-' + farmIcons[Math.floor(Math.random() * farmIcons.length)] + '.png');
    },

    textCounter(event) {
      if (event.target.textLength == 0) {
        this.getFarms();
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

    setActiveFarm(farm, index) {
      this.currentFarm = farm;
      this.currentIndex = index;

      console.log(this.currentFarm);
    },

    getFarms() {
      MainService.getAll('farms')
        .then(response => {
          console.log(response);

          this.farms = response.data;
        })
        .catch(e => {
          console.log(e.response);

          this.error = e.response.data.error;
        });
    },

    updateFarm(event) {
      this.pressReleaseEffect(event.target);

      MainService.updateOne(`farms/${this.currentFarm.id}`, this.currentFarm)
        .then(response => {
          console.log(response);

          this.pressReleaseEffect(event.target);
          this.successMsg = response.data.message;

          setTimeout(() => {
            this.successMsg = '';
            this.getFarms();
          }, 2000);
        })
        .catch(e => {
          console.log(e.response);

          this.pressReleaseEffect(event.target);
          this.errorMsg = e.response.data.error;
        });
    },

    deleteFarms(event) {
      this.pressReleaseEffect(event.target);

      MainService.deleteAll('farms')
        .then(response => {
          console.log(response);

          this.pressReleaseEffect(event.target);
          this.success = response.data.message;

          setTimeout(() => {
            this.farmers = [];
            this.getFarms();
          }, 10);
        })
        .catch(e => {
          console.log(e.response);

          this.pressReleaseEffect(event.target);
          this.error = e.response.data.error;
        });
    },

    deleteFarm(event) {
      this.pressReleaseEffect(event.target);

      MainService.deleteOne(`farms/${this.currentFarm.id}`)
        .then(response => {
          console.log(response);

          this.pressReleaseEffect(event.target);
          this.successMsg = response.data.message;

          setTimeout(() => {
            this.currentFarm = null;
            this.successMsg = '';
            this.getFarms();
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

      MainService.getBy('farms', this.query)
        .then(response => {
          console.log(response.data);

          this.pressReleaseEffect(event.target);
          this.farms = response.data;
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

    this.getFarms();
    this.randomFarmIcons();
  }
}
</script>

<style scoped>
.header-img {
  width: 215px;
}

.icon-img {
  width: 40px;
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
