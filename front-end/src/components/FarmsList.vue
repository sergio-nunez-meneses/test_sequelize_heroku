<template>
  <div>
    <div class="row">
      <div class="col-md-12">
        <h3 class="p-3 text-center">Current Farms</h3>
      </div>
    </div>
    <div v-if="!error" class="row align-items-center">
      <div class="col-md-12">
        <div class="input-group my-auto p-3">
          <input type="text" class="form-control" placeholder="e.g. name=foo, name=foo&amp;city=bar"
            v-model="query"
            @change="textCounter($event)"
          />
          <div class="input-group-append">
            <button class="btn btn-outline-success" type="button"
              @click="searchBy"
            >
              Search
            </button>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="my-auto p-3">
          <ul class="list-group">
            <li class="list-group-item"
              :class="{ active: index == currentIndex }"
              v-for="(farm, index) in farms"
              :key="index"
              @click="setActiveFarm(farm, index)"
            >
              {{ farm.name }}
            </li>
          </ul>

          <button class="btn w-100 my-1 btn-danger"
            @click="deleteFarms"
          >
            Delete All
          </button>
        </div>
      </div>
      <div class="col-md-8 m-auto">
        <div v-if="currentFarm" class="p-3">
          <form name="updateFarm"></form>
          <h3 class="text-center">{{ currentFarm.name }}</h3>
          <ul class="list-group">
            <li class="list-group-item">
              <strong>Id:</strong> {{ currentFarm.id }}
            </li>
            <li class="list-group-item"
              @click="showHideInput('show', $event)"
            >
              <strong>Name:</strong> {{ currentFarm.name }}
            </li>
            <input form="updateFarm" type="text" class="form-control d-none"
              v-model="currentFarm.name"
              @focusout="showHideInput('hide', $event)"
            />
            <li class="list-group-item"
              @click="showHideInput('show', $event)"
            >
              <strong>Address:</strong> {{ currentFarm.address }}
            </li>
            <input form="updateFarm" type="text" class="form-control d-none"
              v-model="currentFarm.address"
              @focusout="showHideInput('hide', $event)"
            />
            <li class="list-group-item"
              @click="showHideInput('show', $event)"
            >
              <strong>City:</strong> {{ currentFarm.city }}
            </li>
            <input form="updateFarm" type="text" class="form-control d-none"
              v-model="currentFarm.city"
              @focusout="showHideInput('hide', $event)"
            />
            <li class="list-group-item"
              @click="showHideInput('show', $event)"
            >
              <strong>Coordinates:</strong> {{ currentFarm.coordinates }}
            </li>
            <input form="updateFarm" type="text" class="form-control d-none"
              v-model="currentFarm.coordinates"
              @focusout="showHideInput('hide', $event)"
            />
          </ul>
          <button type="submit" class="btn w-100 my-1 btn-warning text-white"
            @click="updateFarm"
          >
            Update
          </button>
          <button class="btn w-100 my-1 btn-danger text-white"
            @click="deleteFarm"
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
    <div v-else-if="success">
      <div class="col-md-12">
        <div class="alert p-3 alert-success text-center">
          <p> {{ success }} </p>
        </div>
      </div>
    </div>
    <div v-else-if="error">
      <div class="col-md-12">
        <div class="alert p-3 alert-danger text-center">
          <p> {{ error }} </p>
        </div>
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
    showHideInput(action, event) {
      if (action === 'show') {
        var input = event.target.nextSibling;

        if (input.classList.contains('d-none')) {
          input.classList.remove('d-none');
          event.target.classList.add('d-none');
        }
      } else if (action === 'hide') {
        var listElement = event.target.previousSibling;

        if (listElement.classList.contains('d-none')) {
          listElement.classList.remove('d-none');
          event.target.classList.add('d-none');
        }
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

    updateFarm() {
      MainService.updateOne(`farms/${this.currentFarm.id}`, this.currentFarm)
        .then(response => {
          console.log(response);

          this.successMsg = response.data.message;

          setTimeout(() => {
            this.successMsg = '';
            this.getFarms();
          }, 2000);
        })
        .catch(e => {
          console.log(e.response);

          this.errorMsg = e.response.data.error;
        });
    },

    deleteFarms() {
      MainService.deleteAll('farms')
        .then(response => {
          console.log(response);

          this.success = response.data.message;

          setTimeout(() => {
            this.farmers = [];
            this.getFarms();
          }, 10);
        })
        .catch(e => {
          console.log(e.response);

          this.error = e.response.data.error;
        });
    },

    deleteFarm() {
      MainService.deleteOne(`farms/${this.currentFarm.id}`)
        .then(response => {
          console.log(response);

          this.successMsg = response.data.message;

          setTimeout(() => {
            this.currentFarm = null;
            this.successMsg = '';
            this.getFarms();
          }, 2000);
        })
        .catch(e => {
          console.log(e.response);

          this.errorMsg = e.response.data.error;
        });
    },

    searchBy() {
      MainService.getBy('farms', this.query)
        .then(response => {
          console.log(response.data);

          this.farms = response.data;
        })
        .catch(e => {
          console.log(e.response);

          this.error = e.response.data.error;
        });
    },

    textCounter(event) {
      if (event.target.textLength == 0) {
        this.getFarms();
      }
    }
  },
  mounted() {
    this.getFarms();
    console.log('route path:', this.$route.path);
  }
}
</script>

<style scoped>
/*  */
</style>
