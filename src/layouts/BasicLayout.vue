<template>
  <div class="page-container">
    <div class="content">
 
    <a-layout class="layout">
      <a-layout-header class="header">
        <GlobalHeader />
      </a-layout-header>

      <a-layout-content class="content">
        <router-view />
      </a-layout-content>

      <a-layout-footer class="footer">
        <a href="mailto:insuranceco2024@gmail.com" class="contact-link">
          <i class="email-icon"></i> 聯絡我們
        </a>
        <p>&copy; e-insurance All Rights Reserved</p>
      </a-layout-footer>

      <!-- 回到頂部按鈕 -->
      <button
        v-show="showBackToTop"
        class="back-to-top"
        @click="scrollToTop"
      >
        <i class="arrow-up"></i>
      </button>
    </a-layout>
  </div>
</div>

</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import GlobalHeader from '../components/GlobalHeader.vue';

const showBackToTop = ref(false);

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const handleScroll = () => {
  showBackToTop.value = window.scrollY > 100; 
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
#basicLayout {
  display: flex;
  flex-direction: column;
  min-height: 100vh; 
}

.layout {
  flex: 1;
  display: flex;
  flex-direction: column;
}

html, body {
  height: 100%; /* 設置滿高 */
  margin: 0;
}

.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* 滿高頁面 */
}

.content {
  flex: 1; /* 填滿剩餘空間 */
}

.footer {
  width: 100%;
  background-color: #2d572c;
  color: #ffffff;
  text-align: center;
  padding: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  z-index: 3;
}

.footer a.contact-link {
  color: #ffffff;
  text-decoration: none;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: color 0.3s ease;
}

.footer a.contact-link:hover {
  font-weight: 700;
  font-size: 1rem;
  color: #a8e6cf;
}

.footer .email-icon {
  display: inline-block;
  width: 16px;
  height: 16px;
  background: url('https://cdn-icons-png.flaticon.com/512/732/732200.png') no-repeat center;
  background-size: contain;
}

.footer p {
  margin-top: 8px;
  margin-bottom: 0;
  font-size: 0.9rem;
  opacity: 0.8;
}

.back-to-top {
  position: fixed;
  bottom: 40px; 
  right: 40px; 
  width: 50px; 
  height: 50px;
  background-color: #2d572c; 
  color: #ffffff; 
  border: none;
  border-radius: 8px; 
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2); 
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  opacity: 0.9; 
  transition: all 0.3s ease;
}

.back-to-top:hover {
  background-color: #155724; 
  opacity: 1; 
}

.back-to-top:active {
  transform: scale(0.9); 
}

.arrow-up {
  display: inline-block;
  width: 20px; 
  height: 20px; 
  border-right: 3px solid #ffffff; 
  border-bottom: 3px solid #ffffff; 
  transform: rotate(-135deg); 
}

</style>