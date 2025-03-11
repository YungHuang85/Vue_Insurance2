<script setup>
import { reactive } from 'vue';

const insuranceData = reactive([
  {
    policyName: "主約:安心保網路投保旅行平安保險",
    coverages: [
      { title: "意外身故保障", description: "給付保險金額" },
      { title: "意外失能保障", description: "保險金額 * 失能給付比例 (5%-100% 不等)" }
    ],
    details: "※詳細給付內容或條件限制，請參閱保單條款"
  },
  {
    policyName: "附約:安心保海外突發疾病醫療健康保險",
    coverages: [
      { title: "海外突發疾病住院醫療保險金", description: "實支實付(最高給付海外突發疾病醫療健康保險金額)" },
      { title: "海外突發疾病門診醫療保險金", description: "實支實付(每日最高給付海外突發疾病醫療健康保險金額*1.0%)" }
    ],
    details: "※詳細給付內容或條件限制，請參閱保單條款"
  },
  {
    policyName: "附約:安心保網路投保旅行平安保險海外醫療專機運送",
    coverages: [
      { title: "海外醫療專機服務", description: "提供被保險人於有效期間內接受住院治療後，經診斷需以醫療專機運送返臺時之服務 (提供一次為限)" }
    ],
    details: "※詳細給付內容或條件限制，請參閱保單條款"
  },
  {
    policyName: "附約:安心保旅行平安保險傷害醫療保險",
    coverages: [
      { title: "傷害醫療保障", description: "實支實付，最高給付本附約保險金額" }
    ],
    details: "※詳細給付內容或條件限制，請參閱保單條款"
  }
]);

</script>

<template>
  <div class="insurance-overview">
    <h2>保障概覽</h2>
    <div class="policy-list">
      <div v-for="item in insuranceData" :key="item.policyName" class="policy-item">
        <button class="policy-header" data-bs-toggle="collapse" :data-bs-target="'#collapse_' + item.policyName">
          {{ item.policyName }}
        </button>
        <div class="collapse policy-content" :id="'collapse_' + item.policyName">
          <h4>保障項目</h4>
          <div class="coverage-list">
            <div v-for="coverage in item.coverages" :key="coverage.title" class="coverage-item">
              <div class="coverage-title">{{ coverage.title }}</div>
              <div class="coverage-description">{{ coverage.description }}</div>
            </div>
          </div>
          <div class="details-text">{{ item.details }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
/* 整體樣式 */
.insurance-overview {
  padding: 30px;
}

h2 {
  font-size: 30px;
  color: #222;
  text-align: center;
  font-weight: bold;
  margin-bottom: 25px;
}

h4 {
  font-weight: bold;
}


/* 保障區塊 */
.policy-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* 保單項目 */
.policy-item {
  border-radius: 8px;
  overflow: hidden;
}

/* 保單標題按鈕 */
.policy-header {
  width: 100%;
  text-align: left;
  background-color: lightgray;
  color: #222;
  padding: 12px 15px;
  font-size: 18px;
  font-weight: bold;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  transition: 0.3s;
}

.policy-header:hover {
  background-color: #5E666E;
  color: white;
}

/* 內容區域 */
.policy-content {
  padding: 20px;
  border-left: 4px solid lightgray;
  margin-top: 5px;
  background-color: transparent;
  border-radius: 5px;
}

/* 保障項目 */
.coverage-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.coverage-item {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.coverage-title {
  font-weight: bold;
}

.coverage-description {
  color: #222;
}

/* 詳細說明 */
.details-text {
  font-size: 14px;
  color: #777;
  text-align: center;
  margin-top: 10px;
}
</style>