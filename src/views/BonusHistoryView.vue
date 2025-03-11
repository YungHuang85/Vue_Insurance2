<template>
  <div class="main-content">
    <!-- 顯示用戶名稱和點數區塊 -->
    <div v-if="isLoggedIn" class="user-info">
      <span>{{ username }} 您好！</span>
      <span class="points-display">剩餘點數: {{ userPoints }} 點</span>
    </div>
    <div v-else class="user-info">
      <span>請先登入！</span>
    </div>

    <!-- 顯示兌換紀錄區域 -->
    <div v-if="isLoggedIn" class="exchange-history">
      <h3>您的兌換紀錄</h3>
      <table v-if="exchangeHistory.length > 0" class="table table-striped">
        <thead>
          <tr>
            <th>商品名稱</th>
            <th>消耗點數</th>
            <th>兌換日期</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(record, index) in exchangeHistory" :key="index">
            <td>{{ record.productname }}</td>
            <td>{{ record.cost }}</td>
            <td>{{ record.date }}</td>
          </tr>
        </tbody>
      </table>
      <p v-else>目前沒有兌換紀錄。</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// 用戶點數
const userPoints = ref(0);

// 用戶名
const username = ref(sessionStorage.getItem('username') || '');

// 使用者email，假設從sessionStorage中取得
const email = sessionStorage.getItem('email');

// 控制是否顯示登入提示
const isLoggedIn = ref(!!email); // 如果有email，表示已登入

// 兌換紀錄
const exchangeHistory = ref([]);

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

// 獲取用戶的兌換紀錄
const getExchangeHistory = async () => {
  try {
    const response = await fetch(`http://localhost:8081/api/bonushistory/history?email=${email}`);
    const data = await response.json();
    if (data && Array.isArray(data)) {
      exchangeHistory.value = data; // 更新兌換紀錄
    }
  } catch (error) {
    console.error("獲取兌換紀錄錯誤:", error);
  }
};

// 在組件加載時取得用戶點數和兌換紀錄
onMounted(() => {
  if (isLoggedIn.value) {
    getUserPoints();
    getExchangeHistory();
  }
});
</script>

<style scoped>
/* 主要內容區塊 */
.main-content {
  padding-top: 50px;
  /* 調整距離，讓頁面內容不會被 header 擋住 */
  text-align: center;
  /* 使所有內容集中在中間 */
  max-width: 1200px;
  /* 設置最大寬度 */
  margin-left: auto;
  margin-right: auto;
  /* 使主內容區域居中 */
  padding: 0 20px;
  /* 增加左右邊距 */
  margin-top: 50px;
}

/* 兌換紀錄區塊 */
.exchange-history {
  margin-top: 10px;
  /* 增加頂部間距 */
  padding: 20px;
  /* 增加內邊距 */
  background-color: #f9f9f9;
  /* 兌換紀錄區塊背景顏色 */
  border-radius: 8px;
  /* 使區塊有圓角 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  /* 添加陰影效果 */
  width: 100%;
  /* 確保區域最大化顯示 */
  max-width: 1000px;
  /* 設定最大寬度，防止過寬 */
  margin-left: auto;
  margin-right: auto;
  /* 居中顯示 */
}

/* 表格樣式 */
table {
  width: 100%;
  /* 使表格佔據整個容器寬度 */
  margin-top: 20px;
  margin-left: auto;
  margin-right: auto;
  /* 使表格居中 */
  border-collapse: collapse;
}

/* 文字處理 */
th,
td {
  text-align: center;
  padding: 12px;
  /* 增加內邊距，讓表格更易讀 */
  word-wrap: break-word;
  /* 讓長字自動換行 */
}

/* 表格標題背景顏色修改 */
th {
  background-color: #8A9A5B;
  /* 表格標題背景顏色改為 #155724 */
  color: white;
  /* 保持字體顏色為白色 */
  font-size: 18px;
  /* 調整標題字體大小 */
}

td {
  font-size: 16px;
  /* 調整表格內容字體大小 */
}

tr:nth-child(even) {
  background-color: #f1f1f1;
  /* 偶數行背景顏色 */
}

/* 顯示點數的樣式 */
.points-display {
  font-size: 22px;
  /* 增大字體大小 */
  font-weight: bold;
  color: #DB5009;
  /* 這裡是點數顏色，改成橘色 */
  margin-left: 10px;
}

/* 用戶資訊區塊 */
.user-info {
  display: flex;
  justify-content: center;
  /* 中央對齊 */
  align-items: center;
  font-size: 22px;
  /* 增大字體 */
  padding: 10px;
  background-color: #f5f5f5;
  /* 背景顏色 */
  margin-bottom: 20px;
  /* 增加底部空隙 */
  font-weight: bold;
}
</style>
