<template>
  <div class="main-content">
    <div>
      <!-- 顯示用戶名稱和點數區塊 -->
      <div v-if="isLoggedIn" class="user-info">
        <span>{{ username }} 您好！</span>
        <span class="points-display">剩餘點數: {{ userPoints }} 點</span>
      </div>
      <div v-else class="user-info">
        <span>請先登入！</span>
      </div>

      <!-- Navbar with Search -->
      <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
            aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item" v-for="(tab, index) in tabs" :key="tab.name">
                <a class="nav-link" :class="{
                  active: currentIndex === index,
                  'no-style': !tab.name // 只對名稱為空的 tab 設置 no-style 類
                }" href="#" @click.prevent="click(index)">
                  {{ tab.name || '' }} <!-- 搜尋結果 tab 會顯示空白 -->
                </a>
              </li>
            </ul>
            <form class="d-flex align-items-center" role="search" @submit.prevent="handleSearch">
              <input class="form-control me-2" type="search" placeholder="搜尋商品" aria-label="Search"
                v-model="searchKeyword" style="width: 200px;" />
              <button class="btn btn-outline-success" type="submit" style="width: 80px;">搜尋</button> <!-- 設定按鈕寬度 -->
            </form>
          </div>
        </div>
      </nav>
    </div>
    <!-- 顯示當前選擇的 tab -->
    <KeepAlive>
      <component :is="currentTab" :searchKeyword="searchKeyword" :exchangeProduct="exchangeProduct"
        :userPoints="userPoints" :isLoggedIn="isLoggedIn" />
    </KeepAlive>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// 引入子組件
import FeaturedProductComponent from '@/components/FeaturedProductComponent.vue';
import AllBonusMallProductComponent from '@/components/AllBonusMallProductComponent.vue';
import LifeProductComponent from '@/components/LifeProductComponent.vue';
import StarbuckProductComponent from '@/components/StarbuckProductComponent.vue';
import TrafficProductComponent from '@/components/TrafficProductComponent.vue';
import SearchResultComponent from '@/components/SearchResultComponent.vue';

// Tab選項
const tabs = ref([
  { name: '精選商品', component: FeaturedProductComponent },
  { name: '全部商品', component: AllBonusMallProductComponent },
  { name: '便利生活', component: LifeProductComponent },
  { name: '星巴克', component: StarbuckProductComponent },
  { name: '旅遊交通', component: TrafficProductComponent },
  { name: '', component: SearchResultComponent }, // 搜尋結果 tab 不顯示文字
]);

// 當前選中的 tab 索引
const currentIndex = ref(0);
const currentTab = ref(tabs.value[0].component);

// 搜尋關鍵字
const searchKeyword = ref('');

// 用戶點數
const userPoints = ref(0);

// 用戶名
const username = ref(sessionStorage.getItem('username') || '');

// 使用者email，假設從sessionStorage中取得
const email = sessionStorage.getItem('email');

// 控制是否顯示登入提示
const isLoggedIn = ref(!!email); // 如果有email，表示已登入

// 切換選項
const click = idx => {
  currentIndex.value = idx;
  currentTab.value = tabs.value[idx].component;
};

// 處理搜尋
const handleSearch = () => {
  if (searchKeyword.value) {
    currentIndex.value = tabs.value.length - 1; // 切換到搜尋結果 tab
    currentTab.value = SearchResultComponent; // 顯示搜尋結果組件
  }
};

// 獲取用戶點數
const getUserPoints = async () => {
  try {
    const response = await fetch(`http://localhost:8081/api/points/check?email=${email}`);
    const data = await response.json();
    if (data && data.points) {
      userPoints.value = data.points; // 更新點數
    }
  } catch (error) {
    console.error("獲取點數錯誤:", error);
  }
};

// 在組件加載時取得用戶點數
onMounted(() => {
  if (isLoggedIn.value) {
    getUserPoints();
  }
});

// 兌換商品的邏輯
const exchangeProduct = (productno) => {
  fetch(`http://localhost:8081/api/points/exchange?email=${email}&productno=${productno}`, {
    method: 'POST',
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        getUserPoints(); // 更新點數
      } else {
        alert('兌換失敗，請稍後再試！');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('兌換過程中發生錯誤，請稍後再試！');
    });
};
</script>

<style scoped>
.card {
  margin-bottom: 20px;
  border: none;
  background: transparent !important;
}

.product-image-wrapper {
  border: 2px solid #007BFF;
  padding: 5px;
}

.product-image {
  width: 100px;
  height: auto;
}

.point-img {
  width: 20px;
  height: auto;
  margin-right: 5px;
}

.point-text {
  font-size: 18px;
}

.card-title {
  font-size: 14px;
}

/* Navbar的按鈕變成區塊變色效果 */
.navbar-nav .nav-item .nav-link {
  min-width: 100px;
  /* Tab 寬度 */
  text-align: center;
  /* 文字置中 */
  font-weight: bold;
  /* 文字粗體 */
  font-size: 16px;
  /* 字體大小 */
  color: #8a9a5b;
  /* 預設文字顏色 */
  text-transform: uppercase;
  /* 文字大寫 */
  letter-spacing: 1px;
  /* 增加字母間距 */
  padding: 10px 15px;
  /* 增加內邊距 */
  margin-right: 10px;
  /* 增加右邊間隔，避免按鈕黏在一起 */
  transition: background-color 0.3s ease;
  /* 加入過渡效果 */
}

/* 當按鈕被選中時的區塊背景顏色 */
.navbar-nav .nav-item .nav-link.active {
  background-color: #8a9a5b;
  /* 設置選中狀態的背景顏色為灰綠色 */
  color: #fff;
  /* 選中狀態文字顏色為白色 */
  border-radius: 4px;
  /* 圓角效果 */
}

/* 當按鈕被懸停時的效果 */
.navbar-nav .nav-item .nav-link:hover {
  background-color: #b2c7a1;
  /* 懸停狀態的背景顏色 */
  color: #fff;
  /* 懸停狀態文字顏色為白色 */
  border-radius: 4px;
  /* 圓角效果 */
}

/* 僅針對沒有名稱的搜尋結果tab禁用背景顏色和懸浮效果 */
.navbar-nav .nav-item .nav-link.no-style {
  background-color: transparent !important;
  /* 禁止背景顏色 */
  color: transparent !important;
  /* 隱藏文字顏色 */
  border: none !important;
  /* 移除邊框 */
  pointer-events: none;
  /* 禁止點擊 */
}

/* 讓搜尋結果 tab 在懸停時不顯示任何效果 */
.navbar-nav .nav-item .nav-link.no-style:hover {
  background-color: transparent !important;
  /* 禁止懸停背景色 */
}

/* 顯示點數的樣式設定為灰綠色 */
.points-display {
  font-size: 18px;
  font-weight: bold;
  color: #8a9a5b;
  /* 修改點數顏色為灰綠色 */
  margin-left: 10px;
}

/* Navbar 背景顏色改為灰綠色 */
.navbar {
  background-color: #d1e0d0;
  /* 背景顏色設定為灰綠色 */
}

/* 顯示用戶名稱區塊背景顏色為淡灰綠 */
.user-info {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 20px;
  padding: 10px;
  background-color: #e3f0e1;
  /* 淡灰綠色背景 */
  margin-bottom: 10px;
  font-weight: bold;
}

.navbar-text {
  display: flex;
  align-items: center;
  font-size: 18px;
  color: #000;
  /* 可根據需求設定顏色 */
}

.user-info {
  background: transparent !important;
  /* 確保內部元素也保持透明 */
}

/* 顯示點數的樣式設定為橘色 */
.points-display {
  font-size: 18px;
  font-weight: bold;
  color: #DB5009;
  /* 修改點數顏色為橘色 */
  margin-left: 10px;
}

.main-content {
  padding-top: 70px;
  /* 根據 header 高度設置適當的間距 */
}
</style>