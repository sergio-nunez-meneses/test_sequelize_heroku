<template>
  <div>
    <div class="row">
      <div class="col-md-12">
        <h3 class="p-3 text-center">Current Farmers</h3>
      </div>
    </div>
    <div v-if="!error" class="row align-items-center">
      <div class="col-md-4">
        <div class="my-auto p-3">
          <ul class="list-group">
            <li class="list-group-item"
              :class="{ active: index == currentIndex }"
              v-for="(farmer, index) in farmers"
              :key="index"
              @click="setActiveFarmer(farmer, index)"
            >
              {{ farmer.name }}
            </li>
          </ul>

          <button class="btn w-100 my-1 btn-danger"
            @click="deleteFarmers"
          >
            Delete All
          </button>
        </div>
      </div>
      <div class="col-md-8 m-auto">
        <div v-if="currentFarmer" class="p-3">
          <form name="updateFarmer"></form>

          <h3 class="text-center">{{ currentFarmer.name }}</h3>
          <ul class="list-group">
            <li class="list-group-item">
              <strong>Id:</strong> {{ currentFarmer.id }}
            </li>
            <li class="list-group-item"
              @click="showInput($event)"
            >
              <strong>Email:</strong> {{ currentFarmer.email }}
            </li>
            <input form="updateFarmer" type="text" class="form-control d-none"
              v-model="currentFarmer.email"
              @focusout="hideInput($event)"
            />
            <li class="list-group-item">
              <strong>Phone:</strong> {{ currentFarmer.phone }}
            </li>
          </ul>
          <!-- <a class="btn w-100 my-1 bg-warning"
            :href="'/farmers/' + currentFarmer.id"
          >
            Edit
          </a> -->
          <button type="submit" class="btn w-100 my-1 btn-warning text-white"
            @click="updateFarmer"
          >
            Update
          </button>
          <div v-if="success"
            class="alert p-3 alert-success text-center">
            <p> {{ success }} </p>
          </div>
        </div>
        <div v-else class="p-3">
          <p class="text-center">Click on an farmer to edit it...</p>
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
  name: 'farmers-list',
  data() {
    return {
      farmers: [],
      currentFarmer: null,
      currentIndex: -1,
      success: '',
      error: ''
    }
  },
  methods: {
    setActiveFarmer(farmer, index) {
      this.currentFarmer = farmer;
      this.currentIndex = index;

      console.log(this.currentFarmer);
    },

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

    updateFarmer() {
      MainService.updateOne('farmers/' + this.currentFarmer.id, this.currentFarmer)
        .then(response => {
          console.log(response);

          this.success = 'Farmer updated successfully!';
        })
        .catch(e => {
          console.log(e.response);

          this.error = e.response.data.error;
        });
    },

    deleteFarmers() {
      MainService.deleteAll('farmers')
        .then(response => {
          console.log(response);

          this.farmers = response.data;
        })
        .catch(e => {
          console.log(e.response);

          this.error = e.response.data.error;
        });
    },
  },
  mounted() {
    this.getFarmers();
    console.log('route path:', this.$route.path);
  }
}
</script>

<style scoped>
/*  */
</style>
