<template>
  <div class="main-content">
    <section class="bsb-faq-3 py-3 py-md-5 py-xl-8">
      <div class="container">
        <div class="row justify-content-md-center">
          <div class="col-12 col-md-10 col-lg-8 col-xl-7 col-xxl-6">
            <h2 class="mb-4 display-5 text-center">保險常見問題</h2>
            <p class="text-secondary text-center lead fs-4">
              歡迎來到 e險無憂, 需要甚麼幫忙呢? <br />
              我們會盡力解答您的問題
            </p>
            <div class="d-flex justify-content-center my-4">
              <input type="text" v-model="searchKeyword" class="form-control me-2" placeholder="輸入關鍵字..."
                @keydown.enter="searchQA" />
              <button @click="searchQA" class="btn btn-primary d-flex align-items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search"
                  viewBox="0 0 16 16">
                  <path
                    d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div v-if="error" class="alert alert-danger text-center">{{ error }}</div>
        <div v-else>
          <div v-if="qaList.length === 0" class="text-center">
            <p class="text-muted">抱歉,我們找不到您要查詢的資料。</p>
          </div>

          <div v-else>
            <div class="accordion accordion-flush" id="faqAccount">
              <div v-for="(faq, index) in qaList" :key="faq.qaid"
                class="accordion-item bg-transparent border-top border-bottom py-3">
                <!-- 修改点: 整个标题区域可点击 -->
                <h2 class="accordion-header d-flex align-items-center justify-content-between"
                  :id="`faqAccountHeading${index}`" @click="toggleFAQ(index)">
                  <span class="faq-title fw-bold">
                    {{ faq.question }}
                  </span>
                  <span :class="faq.isOpen ? 'rotate-up' : 'rotate-down'" class="arrow-icon">
                    ▼
                  </span>
                </h2>
                <transition name="slide-fade">
                  <div :class="{ 'accordion-collapse': true, collapse: !faq.isOpen }"
                    :aria-labelledby="`faqAccountHeading${index}`">
                    <div class="accordion-body">
                      <p>{{ faq.answer }}</p>
                    </div>
                  </div>
                </transition>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "QAComponent",
  data() {
    return {
      qaList: [], // FAQ 数据
      searchKeyword: "", // 搜索关键字
      error: null, // 错误信息
    };
  },
  methods: {
    getAllQA() {
      fetch("http://localhost:8081/api/QA/findalljson")
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          this.qaList = data.map((faq) => ({ ...faq, isOpen: false }));
        })
        .catch((error) => {
          this.error = `Failed to load FAQs: ${error.message}`;
        });
    },

    searchQA() {
      if (!this.searchKeyword.trim()) {
        this.getAllQA();
        return;
      }

      fetch(`http://localhost:8081/api/QA/search?keyword=${encodeURIComponent(this.searchKeyword)}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          this.qaList = data.map((faq) => ({ ...faq, isOpen: false }));
        })
        .catch((error) => {
          this.error = `Search failed: ${error.message}`;
        });
    },

    toggleFAQ(index) {
      const currentFAQ = this.qaList[index];
      currentFAQ.isOpen = !currentFAQ.isOpen;
    },
  },
  mounted() {
    this.getAllQA();
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  },
};
</script>

<style scoped>
.main-content {
  width: 100%;
  min-height: 100vh;
  background-color: rgba(246, 253, 248);
  padding-top: 70px;

}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.bsb-faq-3 {
  background-color: rgba(246, 253, 248);
  padding: 40px 20px;
}

.accordion-body {
  font-size: 1rem;
  color: #333;
}

h2 {
  color: #333;
  cursor: pointer;
}

/* 搜尋按鈕樣式 */
.btn-primary {
  background-color: #29293f !important;
  border-color: #29293f !important;
  color: white !important;
}

.btn-primary:hover {
  background-color: #47475f !important;
  border-color: #47475f !important;
}

/* 标题样式 */
.faq-title {
  font-size: 1.3rem;
  color: #000;
  font-weight: bold;
}

.faq-title:hover {
  color: #0056b3;
}

/* 箭头样式 */
.arrow-icon {
  font-size: 1.2rem;
  margin-left: 10px;
  transition: transform 0.3s ease;
}

.rotate-up {
  transform: rotate(180deg);
}

.rotate-down {
  transform: rotate(0deg);
}

/* 动画效果 */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.5s ease;
}

.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
</style>