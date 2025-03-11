<template>
  <div class="container">
    <div class="row mt-4"></div> <!-- 往下一點 -->
    <h3 class="title">便利生活</h3>

    <div class="row mt-4"></div> <!-- 往下一點 -->

    <div class="row">
      <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4" v-for="product in paginatedProducts" :key="product.productno">
        <div class="card" style="width: 100%; border: none;">
          <div class="product-image-wrapper" style="border: 1px solid lightgray; padding: 5px;">
            <img :src="'http://localhost:8081' + product.productimage" class="card-img-top" alt="product image">
          </div>
          <div class="card-body">
            <h5 class="card-title">{{ product.productname }}</h5>
            <div style="display: flex; align-items: center; font-size: 18px;">
              <img src="http://localhost:8081/BonusMallPic/point.jpg" alt="point image" class="point-img">
              <span class="point-text">{{ product.cost }} 點</span>
            </div>

            <!-- margin-bottom 點數跟按鈕的間隔 -->
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
import Swal from 'sweetalert2'; // 引入 SweetAlert2 來顯示提示訊息

export default {
  props: {
    exchangeProduct: {
      type: Function,
      required: true,
    },
    isLoggedIn: {  
      type: Boolean,
      required: true,
    },
    userPoints: {  
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      products: [],
      currentPage: 1,
      itemsPerPage: 12,
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.products.length / this.itemsPerPage); 
    },
    paginatedProducts() {
      const start = (this.currentPage - 1) * this.itemsPerPage; 
      const end = start + this.itemsPerPage;
      return this.products.slice(start, end); 
    }
  },
  methods: {
    getAllProducts() {
      fetch("http://localhost:8081/api/bonusproduct/filter?category=便利生活")
        .then(response => response.json())
        .then(data => {
          this.products = data;
          this.currentPage = 1; 
        })
        .catch(error => {
          console.error("Error fetching products:", error);
        });
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++; 
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--; 
      }
    },
    goToPage(page) {
      this.currentPage = page; 
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
          this.exchangeProduct(product.productno);

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
    this.getAllProducts();
  }
};
</script>

<style scoped>
.title {
  color: #DB5009;
  font-weight: bold;
}

.card {
  margin-bottom: 20px;
  background: transparent !important;
}

.product-image-wrapper {
  border: 2px solid #007BFF;
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
.pagination .page-item .page-link.active {
  background-color: #007BFF;
}

.container {
  margin-left: auto;
  margin-right: auto;
  padding-left: 15px;
  padding-right: 15px;
}

.row {
  margin-left: -15px;
  margin-right: -15px;
}

.col-12, .col-sm-6, .col-md-4, .col-lg-3 {
  padding-left: 15px;
  padding-right: 15px;
}
</style>
