<script setup>
import { ref, watchEffect } from 'vue'
const BASE_URL = import.meta.env.VITE_APIURL
const API_URL = `${BASE_URL}/productlist/GetAllCategory`
const categories = ref([])
const categoryid = ref(0)
const emit = defineEmits(["categoryClick"])
const selectedCategory = ref('featured')
const clickHandler = id => {
  selectedCategory.value = id
  emit("categoryClick", id)
}
watchEffect(async () => {
  //用 fetch() 呼叫 API
  const response = await fetch(API_URL)
  const datas = await response.json();
  categories.value = datas;
})
</script>
<template>
  <div class="navbar">
    <ul v-if="categories && categories.length > 0" class="list-group list-group-horizontal">
      <!-- 精選產品按鈕 -->
      <li class="custom-list-group-item"
        :class="{ 'current': selectedCategory === 'featured', 'list-group-item ': true }"
        @click="clickHandler('featured')">
        <button type="button" class="btn btn-lg">精選產品</button> <!-- 新增btn-lg-->
      </li>
      <!-- 類別按鈕 -->
      <li class="custom-list-group-item"
        :class="{ 'current': selectedCategory === category.categoryid, 'list-group-item': true }"
        v-for="category in categories" :key="category.categoryid" @click="clickHandler(category.categoryid)">
        <button type="button" class="btn btn-lg">{{ category.categoryname }}</button> <!-- 新增btn-lg-->
      </li>
    </ul>
  </div>
</template>
<style lang="css" scoped>
.navbar {
  display: flex;
  justify-content: center;
  align-items: center;
}

.custom-list-group-item {
  border-collapse: collapse;
  color: rgb(1, 77, 1);
  border-color: white;
  border-radius: 10px !important;
}

.current {
  background-color: rgb(0, 77, 0);
  color: white;
}
</style>
