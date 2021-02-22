<template>
  <div>
    <div class="row">
      <div class="col-md-12">
        <h3 class="p-3 text-center">Current Farmers</h3>
      </div>
    </div>
    <div v-if="!error" class="row align-items-center">
      <div class="col-md-12">
        <div class="input-group my-auto p-3">
          <input type="text" class="form-control" placeholder="e.g. name=foo, name=foo&amp;email=foo@bar.fr"
            v-model="query"
            @change="textCounter($event)"
          />
          <div class="input-group-append">
            <button class="btn btn-outline-success" type="button"
              @click="findBy"
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
              @click="showHideInput('show', $event)"
            >
              <strong>Email:</strong> {{ currentFarmer.email }}
            </li>
            <input form="updateFarmer" type="text" class="form-control d-none"
              v-model="currentFarmer.email"
              @focusout="showHideInput('hide', $event)"
            />
            <li class="list-group-item"
              @click="showHideInput('show', $event)"
            >
              <strong>Phone:</strong> {{ currentFarmer.phone }}
            </li>
            <input form="updateFarmer" type="text" class="form-control d-none"
              v-model="currentFarmer.phone"
              @focusout="showHideInput('hide', $event)"
            />
          </ul>
          <button type="submit" class="btn w-100 my-1 btn-warning text-white"
            @click="updateFarmer"
          >
            Update
          </button>
          <button class="btn w-100 my-1 btn-danger text-white"
            @click="deleteFarmer"
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

    updateFarmer() {
      MainService.updateOne(`farmers/${this.currentFarmer.id}`, this.currentFarmer)
        .then(response => {
          console.log(response);

          this.successMsg = response.data.message;

          setTimeout(() => {
            this.successMsg = '';
            this.getFarmers();
          }, 2000);
        })
        .catch(e => {
          console.log(e.response);

          this.errorMsg = e.response.data.error;
        });
    },

    deleteFarmers() {
      MainService.deleteAll('farmers')
        .then(response => {
          console.log(response);

          this.success = response.data.message;

          setTimeout(() => {
            this.farmers = [];
            this.getFarmers();
          }, 10);
        })
        .catch(e => {
          console.log(e.response);

          this.error = e.response.data.error;
        });
    },

    deleteFarmer() {
      MainService.deleteOne(`farmers/${this.currentFarmer.id}`)
        .then(response => {
          console.log(response);

          this.successMsg = response.data.message;

          setTimeout(() => {
            this.currentFarmer = null;
            this.successMsg = '';
            this.getFarmers();
          }, 2000);
        })
        .catch(e => {
          console.log(e.response);

          this.errorMsg = e.response.data.error;
        });
    },

    findBy() {
      MainService.getBy('farmers', this.query)
        .then(response => {
          console.log(response.data);

          this.farmers = response.data;
        })
        .catch(e => {
          console.log(e.response);

          this.error = e.response.data.error;
        });
    },

    textCounter(event) {
      if (event.target.textLength == 0) {
        this.getFarmers();
      }
    }
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
