<template>
  <div id="app">
 <BasicLayout/>

  </div>
 
</template>

<style scoped>
#app {
  padding-top: 140px;  /* header 的高度 + 邊框 */
  min-height: 100vh;
}
</style>

<script setup> 
import { ref, provide } from "vue";
import BasicLayout from "@/layouts/BasicLayout.vue";
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/js/bootstrap.js'

// 定義全局響應式
const isLoggedIn = ref(false);
const username = ref("訪客");

// 初始化登入狀態
const initializeAuth = () => {
  const storedUsername = sessionStorage.getItem("username");
  if (storedUsername) {
    isLoggedIn.value = true;
    username.value = storedUsername;
  }
};

// 調初始化函數
initializeAuth();

// 提供全局狀態給子組件
provide("isLoggedIn", isLoggedIn);
provide("username", username);
</script>



