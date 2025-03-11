<template>
  <header class="global-header">
    <div class="header-left">
      <img class="logo" src="@/assets/logo.png" alt="Logo" />
      <!-- 標題 -->
      <div class="title-container">
        <h1 class="simple-title">e險無憂</h1>
        <p class="subtitle">Your safety, our priority</p>
      </div>
    </div>

    <!--紅利商城 修改-->
    <nav class="header-menu">
      <template v-for="item in menuItems" :key="item.key">
        <!-- 如果是紅利商城，顯示下拉選單 -->
        <a-dropdown v-if="item.key === 'bouns'">
          <template #overlay>
            <a-menu>
              <a-menu-item key="bounsMall">
                <router-link to="/bounsmall">紅利商城</router-link>
              </a-menu-item>
              <a-menu-item key="exchangeRecords">
                <router-link to="/bounshistory">兌換紀錄</router-link>
              </a-menu-item>
            </a-menu>
          </template>
          <a-button type="text" class="bonus-dropdown-btn">
            {{ item.label }} <!--<DownOutlined />-->
          </a-button>
        </a-dropdown>

        <!-- 其他項目則直接顯示為常規的 router-link -->
        <router-link v-else :to="item.link" class="menu-item">
          {{ item.label }}
        </router-link>
      </template>
      <!--紅利商城 修改-->
    </nav>

    <div class="header-right">
      <a-dropdown>
        <template #overlay>
          <a-menu>
            <template v-if="!isLoggedIn">
              <a-menu-item key="login">
                <router-link to="/membersLogin" class="login-link">
                  <!-- 添加圖示 -->
                  <i class="fa-solid fa-rocket login-icon"></i>
                  登入
                </router-link>
              </a-menu-item>
            </template>
            <template v-else>
              <a-menu-item key="profile">
                <router-link to="/membersprofile">會員中心</router-link>
              </a-menu-item>
              <a-menu-item key="logout" @click="handleLogout">登出</a-menu-item>
            </template>
          </a-menu>
        </template>
        <a-button type="text" class="user-dropdown-btn">
          <i class="fa-solid fa-user user-icon"></i>
          會員中心
          <DownOutlined />
        </a-button>
      </a-dropdown>
    </div>
  </header>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router';
import { DownOutlined } from '@ant-design/icons-vue';
import { useUserStore } from '@/store/userStore.js';

const router = useRouter();
const userStore = useUserStore();

const menuItems = [
  { key: 'productlist', label: '商品種類', link: '/' },
  { key: 'products', label: '網路投保', link: '/productPage' },
  { key: 'claims', label: '理賠服務', link: '/ClaimsShow' },
  { key: 'discussionView', label: '討論區', link: '/discussionView' },
  { key: 'faq', label: '常見問題', link: '/faq' },
  { key: 'bouns', label: '兌換專區', link: '/bouns' },
];

// 即時監聽登入狀態
const isLoggedIn = computed(() => userStore.isLoggedIn);

onMounted(() => {
  userStore.checkLogin();
});

const handleLogout = () => {
  userStore.logout();
  router.push('/'); // 登出後返回首頁
};
</script>

<style scoped>
.global-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  background-color: #f4f4f4;
  color: #000;
  font-family: 'Arial', sans-serif;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 142px;
  box-sizing: border-box;
  border-bottom: 10px solid #2d572c;
}


.header-left {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.logo {
  height: 130px;
  margin-right: 1rem;
  border-radius: 0;
  border: none;
  box-shadow: none;
  background-color: transparent;
}


.title-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.simple-title {
  font-family: 'Noto Sans TC', sans-serif;
  font-size: 2.5rem;
  font-weight: 700;
  color: #000;
  margin-top: 20px;
  letter-spacing: 3px;
}

.subtitle {
  font-family: 'Noto Sans', sans-serif;
  font-size: 1.2rem;
  font-weight: 700;
  color: #000;
  text-shadow: 2px 2px 3px rgba(0, 0, 0, 0.2);
  letter-spacing: 1px;
}

.header-menu {
  display: flex;
  gap: 2rem;
}

.menu-item {
  text-decoration: none;
  color: #2d572c;
  font-weight: 700;
  font-size: 1.9rem;
  transition: all 0.3s ease;
  text-transform: uppercase;
}

.menu-item:hover {
  color: #155724;
  transform: scale(1.1);
}

.header-right {
  display: flex;
  align-items: center;

}

.user-dropdown-btn {
  color: #2d572c;
  font-size: 1.1rem;
  transition: all 0.3s ease;
}

.user-dropdown-btn:hover {
  color: #155724;
  transform: scale(1.05);
}

.user-dropdown-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #2d572c;
  font-size: 1.8rem;
  transition: all 0.3s ease;
  font-weight: 700;
}

.user-icon {
  font-size: 1.8rem;
}

.login-link {
  display: flex;
  align-items: center;
  gap: 8px;
  color: inherit;
  text-decoration: none;
  font-size: 1.5rem;
}

.login-icon {
  font-size: 1.8rem;
  color: #2d572c;
}

/*紅利商城 修改*/

/* 只修改紅利商城的樣式，讓它跟其他tab一致 */
.bonus-dropdown-btn {
  display: inline-flex;
  /* 確保文字與圖標並排 */
  align-items: center;
  /* 垂直對齊 */
  justify-content: center;
  /* 水平居中對齊 */
  color: #2d572c;
  /* 預設文字顏色 */
  font-size: 1.9rem;
  /* 字體大小一致 */
  font-weight: 700;
  /* 字重加粗 */
  transition: all 0.3s ease;
  /* 平滑過渡 */
  padding: 0;
  /* 去除內邊距 */
  text-transform: uppercase;
  /* 大寫字母 */
  border: none;
  /* 去除邊框 */
  background: none;
  /* 去除背景 */
  height: 43px;
  /* 高度自適應 */
}

/* 統一懸停效果：與其他tab一致，不顯示灰色背景 */
.bonus-dropdown-btn:hover {
  color: #155724;
  /* 懸停文字顏色 */
  transform: scale(1.1);
  /* 放大效果 */
  background: none !important;
  /* 確保懸停時沒有背景 */
}

/* 保證按鈕和其他tab的對齊一致 */
.menu-item,
.bonus-dropdown-btn {
  display: inline-flex;
  /* 使用 inline-flex 保證項目在行內對齊 */
  align-items: center;
  /* 垂直對齊 */
  justify-content: center;
  /* 水平居中對齊 */
}

/*紅利商城 修改*/
</style>
