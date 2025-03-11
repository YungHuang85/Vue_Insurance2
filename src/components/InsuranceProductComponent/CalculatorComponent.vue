<script setup>
import { ref, computed, onMounted } from 'vue';
import { useInsuranceStore } from '@/store/insuranceStore'; // 根據您的文件結構調整導入

const store = useInsuranceStore();

// Reactive state
const destination = ref("日本");
const startDate = ref("");
const startHour = ref(12);
const days = ref(3);
const insuranceAmount = ref(1000);
const extraInjuryCoverage = ref(false);
const extraEmergencyCoverage = ref(false);
const extraTransportCoverage = ref(false);

// Minimum date for date picker
const minDate = new Date().toISOString().split("T")[0];

// On mounted lifecycle hook
onMounted(() => {
  store.policies = []; // Sync with localStorage
});

// Computed properties
const isOverseas = computed(() => destination.value !== "國內");

const endDate = computed(() => {
  if (!startDate.value) return "";

  const startDateObj = new Date(startDate.value);
  startDateObj.setHours(startHour.value);
  startDateObj.setDate(startDateObj.getDate() + days.value);
  return `${startDateObj.getFullYear()}年${startDateObj.getMonth() + 1}月${startDateObj.getDate()}日 ${startDateObj.getHours()}:00`;
});

const insuranceCost = computed(() => {
  const baseCostMap = {
    1000: 200,
    700: 140,
    500: 100,
    300: 60,
    100: 20,
  };
  return (baseCostMap[insuranceAmount.value] || 0) + days.value * 3;
});

const totalCost = computed(() => {
  let total = insuranceCost.value;
  if (extraInjuryCoverage.value) total += Math.floor(insuranceCost.value / 3);
  if (isOverseas.value) {
    if (extraEmergencyCoverage.value) total += Math.floor(insuranceCost.value * 0.8);
    if (extraTransportCoverage.value) total += Math.floor(insuranceCost.value / 2);
  }
  return total;
});

// Methods
const addToCompare = () => {
  store.addPolicy({
    id: Date.now(),
    destination: destination.value,
    startDate: startDate.value,
    startHour: startHour.value,
    days: days.value,
    insuranceAmount: insuranceAmount.value,
    extraInjuryCoverage: extraInjuryCoverage.value,
    extraEmergencyCoverage: extraEmergencyCoverage.value,
    extraTransportCoverage: extraTransportCoverage.value,
    totalCost: totalCost.value,
  });
};
</script>

<template>
  <div class="insurance-calculator">
    <h2>保費試算</h2>
    <!-- 整個外框 -->
    <div class="container">

      <!-- 旅遊地點 -->
      <div class="section">
        <div class="section1">
          <span class="span1">旅遊地點</span>
          <select v-model="destination" id="destination" class="form-select select-dropdown">
            <option value="國內">國內</option>
            <option value="日本">日本</option>
            <option value="南韓">南韓</option>
            <option value="中國大陸">中國大陸</option>
            <option value="香港">香港</option>
            <option value="澳門">澳門</option>
            <option value="東南亞">東南亞</option>
            <option value="新加坡">新加坡</option>
            <option value="馬來西亞">馬來西亞</option>
            <option value="印尼">印尼</option>
            <option value="泰國">泰國</option>
            <option value="菲律賓">菲律賓</option>
            <option value="越南">越南</option>
            <option value="緬甸">緬甸</option>
            <option value="寮國">寮國</option>
            <option value="帛琉">帛琉</option>
            <option value="柬埔寨">柬埔寨</option>
            <option value="馬爾地夫">馬爾地夫</option>
            <option value="歐洲申根國家">歐洲申根國家</option>
            <option value="歐洲非申根國家">歐洲非申根國家</option>
            <option value="美國">美國</option>
            <option value="加拿大">加拿大</option>
            <option value="紐西蘭">紐西蘭</option>
            <option value="澳大利亞">澳大利亞</option>
            <option value="其他">其他</option>
          </select>
        </div>
      </div>
      <!-- 旅遊期間 -->
      <div class="section">
        <div class="inputs d-flex section1">
          <span class="span1">旅遊期間</span>
          <input type="date" v-model="startDate" :min="minDate" class="form-control" />
          <input type="number" v-model="startHour" placeholder="時" class="form-control1" /> 時
          <input type="number" v-model="days" placeholder="天數" class="form-control1" /> 天
        </div>
        <!-- 結束日期 -->
        <div class="section result-box end-date-box">
          <p class="end-date">結束日期：{{ endDate }}</p>
        </div>
      </div>

      <!-- 試算結果 -->

      <hr> <!-- 分隔線 -->
      <h3 class="title" style="font-weight: bold;">試算結果</h3>
      <br>
      <div class="section1">
        <span class="span1">保障內容</span>
        <select v-model="insuranceAmount" id="insuranceAmount" class="form-select select-dropdown">
          <option value="1000">1000萬</option>
          <option value="700">700萬</option>
          <option value="500">500萬</option>
          <option value="300">300萬</option>
          <option value="100">100萬</option>
        </select>
      </div>
      <!-- 保險費用 -->
      <div class="result-box insurance-cost">
        <p style="color: #d51a1a;">保險費用：{{ insuranceCost }} 元</p>
      </div>

      <hr>

      <!-- 額外保障 -->
      <h4 style="font-weight: bold;">附加醫療</h4>
      <br>
      <div class="col-12 col-md-9">

        <!-- 傷害醫療 -->
        <div class="d-flex1 align-items-center justify-content-start">
          <div class="checkbox-container">
            <input type="checkbox" id="custom-check-medical" v-model="extraInjuryCoverage">
            <label for="custom-check-medical">傷害醫療</label>
          </div>
          <div class="col-auto">
            <select id="medical-amt" name="MedicalAmt" class="form-select">
              <option value="150">{{ insuranceAmount * 0.1 }}萬</option>
            </select>
          </div>
          <div class="col-2 col-lg-1 mb-2 text-end">
            <span>{{ Math.floor(insuranceCost / 3) }}</span>
          </div>
          <div class="col-auto">
            <span>元</span>
          </div>
        </div>

        <!-- 海外突發疾病醫療 -->
        <div v-if="isOverseas" class="d-flex1 align-items-center justify-content-start">
          <div class="checkbox-container">
            <input type="checkbox" id="custom-check-abroad" v-model="extraEmergencyCoverage">
            <label for="custom-check-abroad">海外突發疾病醫療</label>
          </div>
          <div class="col-auto">
            <select id="abroad-amt" class="form-select">
              <option value="150">{{ insuranceAmount * 0.1 }}萬</option>
            </select>
          </div>
          <div class="col-2 col-lg-1 mb-2 text-end">
            <span>{{ Math.floor(insuranceCost * 0.8) }}</span>
          </div>
          <div class="col-auto">
            <span>元</span>
          </div>
        </div>

        <!-- 海外醫療專機運送 -->
        <div v-if="isOverseas" class="d-flex1 align-items-center justify-content-start">
          <div class="checkbox-container">
            <input type="checkbox" id="custom-check-transport" v-model="extraTransportCoverage">
            <label for="custom-check-transport">海外醫療專機運送</label>
          </div>
          <div class="col-auto">
            <select id="transport-amt" class="form-select">
              <option value="150">{{ insuranceAmount * 0.1 }}萬</option>
            </select>
          </div>
          <div class="col-2 col-lg-1 mb-2 text-end">
            <span>{{ Math.floor(insuranceCost / 2) }}</span>
          </div>
          <div class="col-auto">
            <span>元</span>
          </div>
        </div>

      </div>

      <!-- 保費合計 -->
      <div class="section result-box total-cost">
        <h3 style="color:#d51a1a; font-weight: bold;">保費合計：{{ totalCost }} 元</h3>
      </div>

      <!-- 加入比較清單按鈕 -->
      <div>
        <button @click="addToCompare()" class="compare">＋比較清單</button>
      </div>


      <!-- 投保按鈕 -->
      <div class="button-container">
        <a href="#" class="button">立即投保</a>
      </div>
      <hr> <!-- 分隔線 -->

      <!-- 注意事項 -->

      <h4>注意事項</h4>
      <ul>
        <li>幣別：新臺幣</li>
        <li>保費試算結果僅供參考，實際依據要/被保險人資料及保障內容進行核保評估，要/被保險人投保保額上限請見規則與條款。</li>
        <li>同一被保險人以網路方式辦理投保旅行平安保險並附加實支實付傷害醫療保險(不包含海外突發疾病醫療健康保險)者，限投保一張。</li>
        <li>被保險人罹患依中華民國傳染病防治法第三條規定所稱之傳染病時，本公司不負給付e險新安心悠遊海外突發疾病醫療健康保險附約各項保險金之責任。</li>
        <li style="color: #d51a1a;">已出國或已出發不得投保。</li>
        <li style="color: #d51a1a;">海外醫療專機運送附加條款需與海外突發疾病醫療健康保險附約同時附加，本保險為實物給付型商品，請勿重覆投保。</li>
      </ul>
    </div>
  </div>

</template>

<style scoped>
h2 {
  font-size: 30px;
  color: #222;
  text-align: center;
  font-weight: bold;
  margin-bottom: 25px;
}

.insurance-calculator {
  font-family: Arial, sans-serif;
  margin: 20px;
}

.container {
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.section {
  margin-bottom: 20px;
}

.section1 {
  margin-bottom: 20px;
  display: flex;
  align-items: center;

}

.span1 {
  margin-right: 10px;
  font-size: 20px;
  font-weight: bold;
}

.inputs {
  display: flex;
  align-items: center;
  gap: 10px;
}

.inputs input {
  width: 120px;
}



.inputs .form-control {
  width: 150px;
  height: 40px;
  padding: 10px;
  font-size: 18px;
  text-align: left;
}

.inputs .form-control1 {
  width: 60px;
  height: 40px;
  padding: 10px;
  font-size: 16px;
  text-align: left;
  border: 1px solid #ccc;
  background-color: #fff;
  border-radius: 5px;
}

.end-date {
  font-size: 18px;
  margin-top: 10px;
  color: #d51a1a;
}

.result-box {
  font-weight: bold;
  font-size: 18px;
  margin-top: 20px;
}

.total-cost {
  font-size: 20px;
  color: #d51a1a;
}

.notice-box {
  margin-top: 30px;
  background-color: #f8f8f8;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.notice-box ul {
  list-style-type: none;
  padding-left: 0;
}

.notice-box li {
  font-size: 14px;
  margin-bottom: 10px;
}

.btn {
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 16px;
  text-align: center;
}

.compare {
  display: inline-block;
  padding: 10px 15px;
  background-color: lightgray;
  color: black;
  text-decoration: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: bold;
}

.compare:hover {
  background-color: #5E666E;
  color: white;
}

.select-dropdown {
  width: 200px;
}

hr {
  margin-top: 20px;
  border: 1px solid #ddd;
}

.calc-box {
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 5px;
}


/*  */
.d-flex {
  display: flex;
  align-items: center;
  /* 垂直對齊 */
  gap: 10px;
  /* 元素之間的間距 */
  flex-wrap: nowrap;
}

.d-flex1 {
  display: flex;
  align-items: center;
  /* 垂直對齊 */
  gap: 50px;
  /* 元素之間的間距 */
  flex-wrap: nowrap;
}

.checkbox-container {
  display: flex;
  align-items: center;
  gap: 5px;
  /* 控制 checkbox 和文字間的間距 */
  min-width: 180px;
  /* 給定一個最小寬度來避免文字長度影響對齊 */
}

.col-auto {
  display: flex;
  align-items: center;
}

.col-auto select {
  width: 100px;
  /* 控制選擇框的寬度 */
}

.text-end {
  text-align: end;
}

.col-auto span {
  margin-left: 5px;
  margin-right: 5px;
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