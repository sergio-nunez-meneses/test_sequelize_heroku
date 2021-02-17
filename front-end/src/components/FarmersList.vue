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
          <h3 class="text-center">{{ currentFarmer.name }}</h3>
          <ul class="list-group">
            <li class="list-group-item">
              <strong>Id:</strong> {{ currentFarmer.id }}
            </li>
            <li class="list-group-item">
              <strong>Email:</strong> {{ currentFarmer.email }}
            </li>
            <li class="list-group-item">
              <strong>Phone:</strong> {{ currentFarmer.phone }}
            </li>
          </ul>
          <a class="btn w-100 my-1 bg-warning"
            :href="'/farmers/' + currentFarmer.id"
          >
            Edit
          </a>
        </div>
        <div v-else class="p-3">
          <p class="text-center">Click on an farmer to edit it...</p>
        </div>
      </div>
    </div>
    <div v-else >
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
      error: ''
    }
  },
  methods: {
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

    setActiveFarmer(farmer, index) {
      this.currentFarmer = farmer;
      this.currentIndex = index;
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
