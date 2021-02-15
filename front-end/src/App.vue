<template>
  <div id="app">
    <header class="nav-bar">
      <ul>
        <li>
          <router-link to="/">
            Users List
          </router-link>
        </li>
        <li>
          <router-link to="/login">
            Login
          </router-link>
        </li>
      </ul>
    </header>

    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style scoped>
#app {
  display: flex;
  flex-direction: column;
}

ul {
  display: flex;
  justify-content: space-around;
}

li {
  list-style-type: none;
  text-decoration: none;
}
</style>
