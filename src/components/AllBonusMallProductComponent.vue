<template>
  <div class="container">
    <div class="row mt-4"></div> <!--往下一點-->
    <h3 class="title">全部商品</h3>
    <div class="row mt-4"></div> <!--往下一點-->

    <!-- 中心化商品區塊 -->
    <div class="row justify-content-center">
      <!-- 每行顯示3個商品 -->
      <div class="col-12 col-sm-6 col-md-4 col-lg-3" v-for="product in paginatedProducts" :key="product.productno">
        <div class="card" style="width: 100%; border: none;">
          <div class="product-image-wrapper" style="border: 1px solid lightgray; padding: 5px;">
            <img :src="'http://localhost:8081' + product.productimage" class="card-img-top" alt="product image">
          </div>
          <div class="card-body">
            <h5 class="card-title" style="font-size: 14px;">{{ product.productname }}</h5>
            <div style="display: flex; align-items: center; font-size: 18px;">
              <img src="http://localhost:8081/BonusMallPic/point.jpg" alt="point image" class="point-img">
              <span class="point-text">{{ product.cost }} 點</span>
            </div>

            <!-- 按鈕，點擊後會傳遞整個 product 物件 -->
            <a href="#" class="btn mt-2" style="background-color: #ff5733; color: white;" @click="handleExchange(product)">兌換商品</a>
          </div>
        </div>
      </div>
    </div>

    <!-- 分頁按鈕 -->
    <nav aria-label="Page navigation example" class="mb-4">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <a class="page-link" href="#" @click.prevent="prevPage"><</a>
        </li>
        <li 
          class="page-item" 
          v-for="page in totalPages" 
          :key="page" 
          :class="{ active: currentPage === page }"
        >
          <a class="page-link" href="#" @click.prevent="goToPage(page)">{{ page }}</a>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <a class="page-link" href="#" @click.prevent="nextPage">></a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import Swal from 'sweetalert2'; // 引入 SweetAlert2

export default {
  props: {
    // 接收父組件傳遞的 exchangeProduct 方法
    exchangeProduct: {
      type: Function,
      required: true,
    },
    // 接收父組件傳遞的 isLoggedIn 屬性
    isLoggedIn: {  
      type: Boolean,
      required: true,
    },
    // 接收父組件傳遞的 userPoints 屬性
    userPoints: {  
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      products: [], // 存放從後端獲取的商品資料
      currentPage: 1, // 當前頁碼
      itemsPerPage: 12, // 每頁顯示的商品數量
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.products.length / this.itemsPerPage); // 計算總頁數
    },
    paginatedProducts() {
      const start = (this.currentPage - 1) * this.itemsPerPage; // 計算當前頁開始的索引
      const end = start + this.itemsPerPage; // 計算當前頁結束的索引
      return this.products.slice(start, end); // 返回當前頁的商品
    }
  },
  methods: {
    getAllProducts() {
      fetch("http://localhost:8081/api/bonusproduct/filter?category=全部")
        .then(response => response.json()) // 解析 JSON 資料
        .then(data => {
          console.log("API response:", data); // 檢查返回的數據
          this.products = data; // 更新 products
          this.currentPage = 1; // 獲取產品後重置到第一頁
        })
        .catch(error => {
          console.error("Error fetching products:", error);
        });
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++; // 增加當前頁碼
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--; // 減少當前頁碼
      }
    },
    goToPage(page) {
      this.currentPage = page; // 跳轉到指定的頁碼
    },

    handleExchange(product) {
      // 檢查是否登入
      if (!this.isLoggedIn) {
        Swal.fire({
          icon: 'info',
          title: '請先登入！',
          text: '您需要登入才能兌換商品。',
          confirmButtonColor: '#2894FF',
          confirmButtonText: '確定'
        }).then(() => {
          // 點擊確定後跳轉到登入頁面
          this.$router.push('/membersLogin'); // 登入頁面的路由
        });
        return; // 結束方法，不再執行兌換邏輯
      }

      // 檢查用戶的剩餘點數是否足夠
      if (this.userPoints < product.cost) {
        Swal.fire({
          icon: 'error',
          title: '點數不足',
          text: `您目前的點數不足，無法兌換此商品。`,
          confirmButtonColor: '#FF5151',
          confirmButtonText: '確定'
        });
        return; // 結束方法，不再執行兌換邏輯
      }

      // 若已登入，顯示 SweetAlert2 提示框，詢問是否確定兌換
      Swal.fire({
        title: '確定要兌換這個商品嗎?',
        text: `這個商品需要 ${product.cost} 點數。`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#2894FF',
        cancelButtonColor: '#FF5151',
        confirmButtonText: '確認',
        cancelButtonText: '取消',
      }).then((result) => {
        if (result.isConfirmed) {
          // 用戶點擊確認兌換，執行兌換操作
          this.exchangeProduct(product.productno); // 調用父組件傳遞過來的兌換方法

          // 顯示成功訊息
          Swal.fire(
            '兌換成功!',
            `您已成功兌換 ${product.productname}！`,
            'success'
          );
        }
      });
    }
  },
  mounted() {
    this.getAllProducts(); // 在組件掛載時獲取所有產品
  }
};
</script>

<style scoped>

.title {
  color: #DB5009; 
  font-weight: bold;
}

/* 這邊確保卡片區域有適當的外間距 */
.card {
  margin-bottom: 20px;
  background: transparent !important;
}

.product-image-wrapper {
  border: 2px solid #007BFF; /* 設定圖片外框顏色 */
}

.product-image {
  width: 100%; /* 設定圖片寬度 */
}

.point-img {
  width: 20px; /* 設定點數圖片寬度 */
}

.point-text {
  font-size: 18px; /* 放大點數文字，調整點數大小 */
}

.card-title {
  font-size: 14px; /* 商品名稱縮小字體 */
}

/* 分頁樣式 */
.pagination {
  display: flex;
  justify-content: center;
}

.pagination .page-item .page-link.active {
  background-color: #007BFF;
}

/* 加入外層 container，讓整體左右留白一致 */
.container {
  margin-left: auto;
  margin-right: auto;
  padding-left: 15px;  /* 左側間距 */
  padding-right: 15px; /* 右側間距 */
}

/* 保證排版響應式 */
.row {
  margin-left: -15px;
  margin-right: -15px;
}

.col-12, .col-sm-6, .col-md-4, .col-lg-3 {
  padding-left: 15px;  /* 左側間距 */
  padding-right: 15px; /* 右側間距 */
}

</style>
