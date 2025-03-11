<script setup>
import { ref } from "vue";
const imgUrl1 = ref("/images/flighthospital.png");
const imgUrl2 = ref("/images/savelife.png");
const imgUrl3 = ref("/images/note.png");
</script>

<template>
  <div class="container">
    <h2>提供最好的</h2>
    <div class="service-section">
      <div class="service-item">
        <img :src="imgUrl1" alt="醫療加值服務">
        <div class="service-title">海外緊急住院+醫療專機服務</div>
        <div class="service-description">
          經專業醫生判斷有機會啟動<br>
          <span class="highlight">緊急醫療轉送及安排返國</span>
        </div>
      </div>
      <div class="service-item">
        <img :src="imgUrl2" alt="急難救助">
        <div class="service-title">多項海外急難救助服務</div>
        <div class="service-description">
          罹病諮詢、介紹醫療等服務<br>
          <span class="highlight">專人24小時待命讓出國有保障</span>
        </div>
      </div>
      <div class="service-item">
        <img :src="imgUrl3" alt="隨時保險">
        <div class="service-title">24小時隨時保真方便</div>
        <div class="service-description">
          最晚出國前10分鐘即可投保<br>
          保障快速又彈性
        </div>
      </div>
    </div>
    <div class="button-container">
      <a href="#" class="button">立即投保</a>
    </div>
  </div>
</template>

<style lang="css" scoped>
body {
  font-family: Arial, sans-serif;
  text-align: center;
  margin: 0;
  padding: 0;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 50px 20px;
}

h2 {
  font-size: 30px;
  color: #333;
  margin-bottom: 50px;
  text-align: center;
  font-weight: bold;
}

.service-section {
  display: flex;
  justify-content: space-around;
  text-align: center;
  margin-bottom: 50px;
}

.service-item {
  width: 40%;
}

.service-item img {
  width: 130px;
  height: 130px;
}

.service-title {
  font-size: 25px;
  font-weight: bold;
  color: #0074a6;
  margin-top: 15px;
}

.service-description {
  font-size: 20px;
  color: #666;
  margin: 10px 0;
}

.highlight {
  color: #d51a1a;
  font-weight: bold;
}

.button {
  display: inline-block;
  margin-top: 20px;
  padding: 10px 30px;
  background-color: #0074a6;
  color: #fff;
  text-decoration: none;
  border-radius: 20px;
  font-size: 20px;
  font-weight: bold;
}

.button-container {
  display: flex;
  justify-content: center;
}

.button:hover {
  background-color: #00587a;
}
</style>