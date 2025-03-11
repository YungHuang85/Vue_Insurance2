<script setup>

</script>

<template>
  <nav>
    <ul class="nav-bar">
      <li>
        <router-link :to="{ path: 'detail' }">商品說明</router-link>
      </li>
      <li>
        <router-link :to="{ path: 'introduction' }">投保規定</router-link>
      </li>
      <li>
        <router-link :to="{ path: 'policy' }">商品條款</router-link>
      </li>
    </ul>
  </nav>
  <div>
    <router-view></router-view>
  </div>
</template>

<style lang="css" scoped>
.nav-bar {
  display: flex;
  gap: 20px;
  list-style: none;
  padding: 10px;
  background-color: #f4f4f4;
  justify-content: center;
  align-items: center;
}

.nav-bar li {
  display: inline;
}

.nav-bar a {
  text-decoration: none;
  padding: 10px 20px;
  color: #333;
  background-color: #ddd;
  border-radius: 5px;
  transition: background 0.3s ease;
}

.nav-bar a:hover,
.nav-bar a.router-link-exact-active {
  background-color: #5e666e;
  color: #fff;
}

.content {
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #ddd;
  background-color: #fff;
}
</style>