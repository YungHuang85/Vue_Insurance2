<script setup>
import { ref } from "vue";
// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from "swiper/vue";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Import required modules
import { Autoplay, Navigation, Pagination } from "swiper/modules";

// Define the onSlideChange function
const onSlideChange = () => {
  console.log("slide change");
};

// Define Swiper modules
const modules = [Autoplay, Navigation, Pagination];

const imgUrl1 = ref("/Vue_Insurance2/5.JPG");
const imgUrl2 = ref("/Vue_Insurance2/6.jpg");
const imgUrl3 = ref("/Vue_Insurance2/7.JPG");

</script>

<template>
  <div class="container">
    <!-- 廣告輪播 -->
    <swiper :loop="true" :navigation="false" :modules="modules" :pagination="{ clickable: true }" :slides-per-view="1"
      :space-between="10" :autoplay="{ delay: 2500, disableOnInteraction: false }" @slideChange="onSlideChange"
      class="mySwiper">
      <swiper-slide>
        <img :src="imgUrl1" class="slide-image" alt="product advertisement">
      </swiper-slide>

      <swiper-slide>
        <img :src="imgUrl2" class="slide-image" alt="product advertisement">
      </swiper-slide>

      <swiper-slide>
        <img :src="imgUrl3" class="slide-image" alt="product advertisement">
      </swiper-slide>
      <!-- 
      <swiper-slide>
        <img :src="imgUrl4" class="slide-image" alt="product advertisement">
      </swiper-slide> -->
    </swiper>
  </div>
</template>

<style lang="css" scoped>
.mySwiper {
  width: 100%;
  /* 設置寬度為 100% */
  height: 400px;
  /* 設置固定高度 */
}

.slide-image {
  width: 100%;
  /* 使圖片寬度為容器的 100% */
  height: 100%;
  /* 設置高度為容器的 100% */
}

.swiper-slide {
  display: flex;
  /* 使用 Flexbox */
  justify-content: center;
  /* 水平居中 */
  align-items: center;
  /* 垂直居中 */
  height: 100%;
  /* 確保容器高度一致 */
}

.slide-content {
  display: flex;
  align-items: center;
  /* 垂直居中 */
  justify-content: space-between;
  /* 左右對齊 */
  width: 100%;
  max-width: 800px;
  /* 限制內容寬度 */
}

.text-left,
.text-right {
  width: 20%;
  /* 左右文字區域寬度 */
  text-align: center;
  /* 文字居中 */
  font-size: 16px;
  color: #333;
}

img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  /* 保證圖片不被裁切 */
}
</style>
