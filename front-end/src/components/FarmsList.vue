<template>
  <div>
    <div class="row">
      <div class="col-md-12">
        <h3 class="p-3 text-center">Current Farms</h3>
      </div>
    </div>
    <div v-if="!error" class="row align-items-center">
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
              @click="showInput($event)"
            >
              <strong>Name:</strong> {{ currentFarm.name }}
            </li>
            <input form="updateFarm" type="text" class="form-control d-none"
              v-model="currentFarm.name"
              @focusout="hideInput($event)"
            />
            <li class="list-group-item"
              @click="showInput($event)"
            >
              <strong>Address:</strong> {{ currentFarm.address }}
            </li>
            <input form="updateFarm" type="text" class="form-control d-none"
              v-model="currentFarm.address"
              @focusout="hideInput($event)"
            />
            <li class="list-group-item"
              @click="showInput($event)"
            >
              <strong>City:</strong> {{ currentFarm.city }}
            </li>
            <input form="updateFarm" type="text" class="form-control d-none"
              v-model="currentFarm.city"
              @focusout="hideInput($event)"
            />
            <li class="list-group-item"
              @click="showInput($event)"
            >
              <strong>Coordinates:</strong> {{ currentFarm.coordinates }}
            </li>
            <input form="updateFarm" type="text" class="form-control d-none"
              v-model="currentFarm.coordinates"
              @focusout="hideInput($event)"
            />
          </ul>
          <button type="submit" class="btn w-100 my-1 btn-warning text-white"
            @click="updateFarm"
          >
            Update
          </button>
          <div v-if="success"
            class="alert p-3 alert-success text-center">
            <p> {{ success }} </p>
          </div>
        </div>
        <div v-else class="p-3">
          <p class="text-center">Click on an farm to edit it...</p>
        </div>
      </div>
    </div>
    <div v-else>
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
      success: '',
      error: ''
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
      MainService.updateOne('farms/' + this.currentFarm.id, this.currentFarm)
        .then(response => {
          console.log(response);

          this.success = 'Farm updated successfully!';
        })
        .catch(e => {
          console.log(e.response);

          this.error = e.response.data.error;
        });
    },

    deleteFarms() {
      MainService.deleteAll('farms')
        .then(response => {
          console.log(response);

          this.farms = response.data;
        })
        .catch(e => {
          console.log(e.response);

          this.error = e.response.data.error;
        });
    },
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
