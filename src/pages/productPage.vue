<template>
  <div class="page-container">

    <h1>網路投保</h1>

    <div class="cart-icon" @click="toggleCartDropdown">
      🛒 <span>{{ cart.length }}</span>
    </div>

    <!-- 下拉購物車視窗 -->
    <div v-if="showCartDropdown" class="cart-dropdown">
      <h2>購物車</h2>
      <div>
        <div v-for="(item, index) in cart" :key="index" class="cart-item">
          <span class="item-info">{{ item.name }}</span>
          <button @click="goToCheckout(item.name)" class="buy-from-cart">進行投保</button>
          <button @click="removeFromCart(index)" class="remove-from-cart">移除</button>
        </div>
      </div>
    </div>

    <!-- 添加的圖片 -->
    <div class="custom-image-container">
      <img src="../../public/process.jpg" alt="Custom Image" class="custom-image" />
      <span> </span>
      <video :src="videoUrl" autoplay muted loop playsinline controls width="480" height="270"></video>
    </div>

    <!-- Styled Image Slider -->
    <div class="slider-container" @mousedown="startDrag" @mousemove="onDrag" @mouseup="endDrag" @mouseleave="endDrag">
      <div class="slider" :style="sliderStyle">
        <div v-for="(product, index) in products" :key="product.id" class="slide"
          :class="{ 'active': currentSlide === index }">
          <div class="card">
            <img :src="product.imageUrl" :alt="product.name" class="card-image" />
            <div class="card-content">
              <span class="product-label">商品類別</span>
              <h2 class="product-name">{{ product.name }}</h2>

              <!-- 改成顯示多個 icon 的區塊 -->
              <div class="product-description-icons">
                <div v-for="(descItem, i) in productDescriptions[product.name]" :key="i" class="description-icon">
                  <img :src="descItem.iconUrl" :alt="descItem.title" class="desc-icon-img" />
                  <div class="desc-icon-text">{{ descItem.title }}</div>
                </div>
              </div>

              <div class="card-actions">
                <button @click="goToCheckout(product.name)" class="action-button">
                  進行投保
                </button>
                <button @click="addToCart(product)" class="action-button">
                  加入購物車
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button class="nav-button prev" @click="prevSlide">&#10094;</button>
      <button class="nav-button next" @click="nextSlide">&#10095;</button>
      <div class="indicators">
        <span v-for="(product, index) in products" :key="index" :class="{ 'active-indicator': currentSlide === index }"
          class="indicator" @click="() => (currentSlide = index)"></span>
      </div>
      <hr class="divider" />
    </div>

    <div class="powerbi-container">
      <iframe
        src="https://app.powerbi.com/reportEmbed?reportId=bdfc3a69-8092-4de1-9c31-5f4e886f08a9&autoAuth=true&ctid=ac5b424d-e400-4fc2-ba28-db94be4b9765&filterPaneEnabled=false&navContentPaneEnabled=false"
        width="1280px" height="720px" frameborder="0" allowfullscreen></iframe>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from "vue";

export default {

  data() {
    return {
      // 這裡放入S3 上的影片公開網址
      videoUrl: 'https://yistorage.s3.ap-northeast-3.amazonaws.com/insurance.mp4'
    }
  },
  setup() {
    const products = ref([
      { id: 1, name: "旅平險", imageUrl: "/Vue_Insurance2/roadtrip.jpg" },
      { id: 2, name: "登山險", imageUrl: "/Vue_Insurance2/hike.jpg" },
      { id: 3, name: "意外險", imageUrl: "/Vue_Insurance2/accident.png" },
      { id: 4, name: "醫療險", imageUrl: "/Vue_Insurance2/medical.jpg" },
      { id: 5, name: "壽險", imageUrl: "/Vue_Insurance2/lifeinsurance1.jpg" },
      { id: 6, name: "汽車險", imageUrl: "/Vue_Insurance2/carAccident.jpg" },
    ]);

    // 把原先單純文字的 productDescriptions 改成陣列物件 (示範：可依實際需求/商品改寫)
    const productDescriptions = reactive({
      旅平險: [
        { iconUrl: "../public/travelc.png", title: "身故" },
        { iconUrl: "../public/travelc1.png", title: "意外醫療" },
        { iconUrl: "../public/travelc2.png", title: "突發疾病" },
        { iconUrl: "../public/travelc3.png", title: "醫療專機" },
      ],
      登山險: [
        { iconUrl: "../public/hikeinjure2.png", title: "緊急救援" },
        { iconUrl: "../public/hikeinjure3.png", title: "高山症" },
        { iconUrl: "../public/hikeinjure1.png", title: "意外傷害" },
        { iconUrl: "../public/travelc.png", title: "身故" },

      ],
      意外險: [
        { iconUrl: "../public/accident2.png", title: "失能保障" },
        { iconUrl: "../public/accident1.png", title: "意外身故" },
        { iconUrl: "../public/accident3.png", title: "骨折" },
        { iconUrl: "../public/accident4.png", title: "燒燙傷" },
      ],
      醫療險: [
        { iconUrl: "../public/medical1.png", title: "住院保障" },
        { iconUrl: "../public/medical2.png", title: "手術費用" },
        { iconUrl: "../public/medical3.png", title: "身故給付" },
        { iconUrl: "../public/medical4.png", title: "其他給付" },
      ],
      壽險: [
        { iconUrl: "../public/specificdisease.png", title: "特定傷病" },
        { iconUrl: "../public/travelc.png", title: "失能保障" },
        { iconUrl: "../public/age.png", title: "祝壽金" },
        { iconUrl: "../public/medical3.png", title: "身故給付" },
      ],
      汽車險: [
        { iconUrl: "../public/car2.png", title: "第三責任" },
        { iconUrl: "../public/car1.png", title: "車損保障" },
        { iconUrl: "../public/accident2.png", title: "駕駛意外" },
        { iconUrl: "../public/medical4.png", title: "其他給付" },
      ],
    });

    const cart = ref([]);
    const showCartDropdown = ref(false);
    const currentSlide = ref(0);
    const isDragging = ref(false);
    const startX = ref(0);
    const dragDistance = ref(0);

    // 拖曳切換效果
    const sliderStyle = computed(() => {
      const offset = -20 * currentSlide.value + 10 + dragDistance.value;
      return {
        transform: `translateX(${offset}%)`,
        transition: isDragging.value ? "none" : "transform 0.5s ease-in-out",
      };
    });

    // 改以陣列方式呈現，不再需要 getProductDescription()
    // const getProductDescription = (productName) => {
    //   return productDescriptions[productName] || '這是一般保險商品的描述，請查看詳細資訊。';
    // };

    const goToCheckout = (productName) => {
      // 此處邏輯不變，依產品決定導向
      if (["登山險", "意外險", "醫療險", "壽險", "汽車險"].includes(productName)) {
        window.location.href = "/maintenance";
      } else {
        window.location.href = "/travelClient";
      }
    };

    const addToCart = (product) => {
      const productToAdd = { ...product };
      cart.value.push(productToAdd);
      localStorage.setItem("cart", JSON.stringify(cart.value));
    };

    const removeFromCart = (index) => {
      cart.value.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(cart.value));
    };

    const toggleCartDropdown = () => {
      showCartDropdown.value = !showCartDropdown.value;
    };

    const nextSlide = () => {
      currentSlide.value = (currentSlide.value + 1) % products.value.length;
    };

    const prevSlide = () => {
      currentSlide.value =
        (currentSlide.value - 1 + products.value.length) % products.value.length;
    };

    const startDrag = (event) => {
      isDragging.value = true;
      startX.value = event.clientX;
    };

    const onDrag = (event) => {
      if (!isDragging.value) return;
      dragDistance.value = ((event.clientX - startX.value) / window.innerWidth) * 130;
    };

    const endDrag = () => {
      if (!isDragging.value) return;
      isDragging.value = false;
      if (dragDistance.value > 10 && currentSlide.value > 0) {
        prevSlide();
      } else if (
        dragDistance.value < -20 &&
        currentSlide.value < products.value.length - 1
      ) {
        nextSlide();
      }
      dragDistance.value = 0;
    };

    onMounted(() => {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        cart.value = JSON.parse(savedCart);
      }
    });

    return {
      products,
      productDescriptions,
      cart,
      showCartDropdown,
      currentSlide,
      isDragging,
      startX,
      dragDistance,
      sliderStyle,
      goToCheckout,
      addToCart,
      removeFromCart,
      toggleCartDropdown,
      nextSlide,
      prevSlide,
      startDrag,
      onDrag,
      endDrag,
    };
  },
};
</script>

<style scoped>
h1 {
  font-size: 45px;
  margin-top: 40px;
  margin-bottom: -20px;
  color: #2d572c;
  font-weight: bold;
}

h2 {
  font-weight: bold;
  color: #29293f;
}

.page-container {
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  box-sizing: border-box;
  background-color: rgba(246, 253, 248);
}

.slider-container {
  position: relative;
  width: 100%;
  max-width: 2500px;
  margin: 0 auto;
  overflow: hidden;
  cursor: grab;
}

.slider {
  display: flex;
  transition: transform 0.8s ease-in-out;
}

.slide {
  /* 卡片間距 */
  min-width: 22%;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  transform: scale(1.2);
  transition: transform 0.5s, opacity 0.5s;
}

.card {
  background-color: #F5F5F5;
  border-radius: 20px;
  box-shadow: 0 6px 12px rgba(8, 8, 8, 0.15);
  max-width: 350px;
  text-align: center;
  padding: 22px;
  margin: 73px;
  margin-right: 10px;
  border: 2px solid #29293f;
}

.card-image {
  border-radius: 16px;
  max-width: 100%;
  height: auto;
}

.card-content {
  margin-top: 20px;
}

.product-label {
  display: inline-block;
  background-color: #dbeafe;
  color: #103674;
  padding: 6px 12px;
  border-radius: 10px;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 6px;
}

.product-name {
  font-size: 22px;
  font-weight: bold;
  margin: 10px 0;
}

/* 商品描述 */
.product-description {
  font-size: 16px;
  color: #070707;
  margin-bottom: 20px;
  text-align: left;
}

.card-actions {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.action-button {
  flex: 1;
  padding: 11px;
  font-size: 19px;
  color: white;
  border-radius: 14px;
  border: none;
  cursor: pointer;
  background-color: #29293f;
  font-weight: bold;
}

.action-button:hover {
  background-color: #47475f;
}

.remove-from-cart:hover {
  background-color: #a71d2a;
}

/* 滑塊樣式 */
.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  color: rgb(3, 3, 3);
  border: none;
  padding: 14px;
  font-size: 70px;
  cursor: pointer;
  z-index: 1;
  /* 確保按鈕位於最上層 */
  display: flex;
  /* 確保按鈕內容可見 */
  align-items: center;
  justify-content: center;
}

.prev {
  left: 15px;
  /* 調整滑塊按鈕的水平位置 */
}

.next {
  right: 15px;
}

.indicators {
  display: flex;
  justify-content: center;
  margin-top: 65px;
}

.indicator {
  width: 14px;
  height: 14px;
  margin: 0 6px;
  background-color: #ccc;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.3s;
}

.active-indicator {
  background-color: #33393f;
  transition: all 0.3s ease;
}

/* 購物車css */
.cart-icon {
  position: relative;
  top: -35px;
  right: -300px;
  background-color: #29293f;
  color: rgb(245, 245, 245);
  padding: 10px 25px;
  border-radius: 20px;
  width: 140px;
  font-size: 35px;
  cursor: pointer;
  font-weight: bold;

}

.cart-icon:hover {
  background-color: #47475f;
}


.buy-from-cart:hover {
  background-color: #47475f;
}

/* 購物車下拉選單 */
.cart-dropdown {
  position: absolute;
  top: 210px;
  right: 480px;
  background: rgb(241, 238, 238);
  border: 3px solid #29293f;
  border-radius: 14.4px;
  width: fit-content;
  z-index: 1000;
  padding: 20px;

}

.cart-item {
  display: flex;
  align-items: center;
  padding: 12px;
  gap: 30px;
  /* 調整內部元素間距 */
  background: #f9f9f9;
  border: 1.8px solid #ddd;
  border-radius: 12px;
  margin-bottom: 15px;
  /* 購物車內商品字體大小 */
  max-width: fit-content;

}

.item-info {
  font-size: 23px;
  word-wrap: break-word;
  font-weight: bold;
}

.buy-from-cart {
  background-color: #29293f;
  color: white;
  border: none;
  padding: 9px 18px;
  cursor: pointer;
  border-radius: 14px;
  font-size: 23px;
  font-weight: 500;
}

.remove-from-cart {
  background-color: darkred;
  color: white;
  border: none;
  padding: 9px 18px;
  cursor: pointer;
  border-radius: 14px;
  /*購物車內字體*/
  font-size: 23px;
  font-weight: 500;
}

.buy-from-cart:hover {
  background-color: #47475f;
}

.remove-from-cart:hover {
  background-color: #a71d2a;
}

.checkout-button:hover {
  background-color: green;
}

.divider {
  border-top: 4px solid;
  color: #29293f;
  margin: 40px 0;
}

.powerbi-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  padding: 20px;
  display: inline-block;
  border: 3px solid #000;
  border-radius: 30px;
  background-color: #F5F5F5;
}

/* 新增的圖片樣式 */
.custom-image-container {
  text-align: center;
  margin: 10px;
  justify-content: center;
  display: flex;
}

.custom-image {
  margin-right: 20px;
  max-width: 60%;
  height: auto;
  border-radius: 6px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* 調整為顯示 icon 的容器 */
.product-description-icons {
  margin-top: 15px;
  margin-bottom: 15px;
  display: flex;
  justify-content: center;
  gap: 18px;
}

.description-icon {
  display: flex;
  flex-direction: column;
  align-items: center;

}

.desc-icon-img {
  width: 58px;
  height: 58px;
  margin-bottom: 5px;
}

.desc-icon-text {
  font-size: 14px;
  font-weight: 600;
  color: #070707;
}
</style>
