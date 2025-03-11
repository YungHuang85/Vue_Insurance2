<template>
  <div class="container">
    <div class="row mt-4"></div> <!-- 往下一點 -->
    <div class="row mt-4"></div> <!-- 往下一點 -->
    <!-- 廣告輪播 -->
    <swiper
      :loop="true"
      :navigation="false"
      :modules="modules"
      :pagination="{ clickable: true }"
      :slides-per-view="1"
      :space-between="10"
      :autoplay="{ delay: 2500, disableOnInteraction: false }"
      @slideChange="onSlideChange"
      class="mySwiper"
    >
      <swiper-slide>
        <img :src="'https://media.istockphoto.com/id/1483875169/zh/%E5%90%91%E9%87%8F/coffee-to-go-or-take-away-poster-or-flyer-set-or-coffee-shop-menu-cover-bright-colored-design.jpg?s=612x612&w=0&k=20&c=CvK98HY_QNOfU9p7m9ZgSfXku5-YQKoSXNLVPvzK0bc='" class="slide-image" alt="product advertisement">
      </swiper-slide>

      <swiper-slide>
        <img :src="'https://media.istockphoto.com/id/1183349783/zh/%E5%90%91%E9%87%8F/%E5%92%96%E5%95%A1%E5%BA%97-%E5%B0%8F%E5%9E%8B%E4%BC%81%E6%A5%AD%E5%9C%96%E5%BD%A2-%E5%92%96%E5%95%A1.jpg?s=612x612&w=0&k=20&c=5kL-juMUze6ZEDZBgLN_ZQSQ_gO0WHC8t2RmeLss5kY='" class="slide-image" alt="product advertisement">
      </swiper-slide>

      <swiper-slide>
        <img :src="'https://media.istockphoto.com/id/1877908749/zh/%E5%90%91%E9%87%8F/realistic-coffee-cup-vector-banner.jpg?s=612x612&w=0&k=20&c=iwwo2w0eN3Ia-HH6Dh7m8Uw8VsFlY2oyImeVUBqq-bU='" class="slide-image" alt="product advertisement">
      </swiper-slide>
    </swiper>

    <div class="row mt-4"></div> <!-- 往下一點 -->

    <h3 class="title">推薦商品</h3>

    <div class="row mt-4"></div> <!-- 往下一點 -->

    <!-- 顯示篩選後的商品 -->
    <div class="row">
      <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4" v-for="product in paginatedProducts" :key="product.productno">
        <div class="card" style="border: none;">
          <div class="product-image-wrapper">
            <img :src="'http://localhost:8081' + product.productimage" class="card-img-top" alt="product image">
          </div>
          <div class="card-body">
            <h5 class="card-title" style="font-size: 14px;">{{ product.productname }}</h5>
            <div style="display: flex; align-items: center; font-size: 18px;">
              <img src="http://localhost:8081/BonusMallPic/point.jpg" alt="point image" class="point-img">
              <span class="point-text">{{ product.cost }} 點</span>
            </div>

            <a href="#" class="btn mt-2" style="background-color: #ff5733; color: white;" @click="handleExchange(product)">兌換商品</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import Swal from 'sweetalert2'; // 引入 SweetAlert2

export default {
  components: {
    Swiper,
    SwiperSlide,
  },
  props: {
    searchKeyword: {
      type: String,
      default: '',
    },
    isSearchMode: {
      type: Boolean,
      default: false,
    },
    exchangeProduct: {
      type: Function,
      required: true,
    },
    isLoggedIn: {  // 接收父組件傳遞的 isLoggedIn 屬性
      type: Boolean,
      required: true,
    },
    userPoints: {  // 接收父組件傳遞的 userPoints 屬性
      type: Number,
      required: true,
    },
  },
  setup() {
    const onSlideChange = () => {
      console.log("slide change");
    };
    return {
      onSlideChange,
      modules: [Autoplay, Navigation, Pagination],
    };
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
    },
  },
  methods: {
    getAllProducts() {
      fetch("http://localhost:8081/api/bonusproduct/filter?category=全部")
        .then(response => response.json()) // 解析 JSON 資料
        .then(data => {
          console.log("API response:", data); // 檢查返回的數據

          // 根據兌換次數 (count) 進行排序，並選擇前4個商品
          const topProducts = data.sort((a, b) => b.count - a.count).slice(0, 4);

          this.products = topProducts; // 更新為前4個兌換次數最高的商品
          this.currentPage = 1; // 重置頁碼為1
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
/* Swiper 相關樣式 */
.mySwiper {
  width: 100%; /* 設置寬度為 100% */
  height: 400px; /* 設置固定高度 */
}

.slide-image {
  width: 100%; /* 使圖片寬度為容器的 100% */
  height: 100%; /* 設置高度為容器的 100% */
  object-fit: cover; /* 保證圖片以適當的方式填充容器 */
}

/* 商品區域樣式 */
.title {
  color: #DB5009;
  font-weight: bold;
}

.card {
  margin-bottom: 20px;
  background: transparent !important;
}

.card-img-top {
  width: 100%; /* 設定圖片寬度為 100% */
  height: auto; /* 保持圖片原比例，依據寬度自動調整高度 */
  border-radius: 10px; /* 讓圖片的四個角變圓，數值可以調整 */
}

.product-image-wrapper {
  border: 1px solid lightgray;
  padding: 5px;
}

.product-image {
  width: 100px;
}

.point-img {
  width: 20px;
}

.point-text {
  font-size: 18px;
}

.card-title {
  font-size: 14px;
}

.pagination {
  display: flex;
  justify-content: center;
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
