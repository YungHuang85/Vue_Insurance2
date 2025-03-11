<script setup>
import { onMounted } from "vue";
import { useInsuranceStore } from "@/store/insuranceStore"; // 引入 pinia store
import { storeToRefs } from "pinia"; // 引入 storeToRefs
import { useRouter } from "vue-router";

const router = useRouter();

const goToComparison = () => {
  const routeData = router.resolve({ name: 'comparison' }); // 'comparison' 是你的命名路由
  window.open(routeData.href, '_blank');
};
const store = useInsuranceStore(); // 使用 pinia store
const { policies } = storeToRefs(store); // 取得 policies 陣列

// 在組件掛載時載入數據
onMounted(() => {
  // 不需要手動載入資料，因為 Pinia 自動處理了 persist
  // policies 已經會在 store 裡面同步更新
});

// 移除方案
const removeInsurance = (index) => {
  store.policies.splice(index, 1); // 直接操作 Pinia store 中的 policies
};
</script>

<template>
    <div class="position-relative" style="width: 265px;">
      <div class="text-center card text-black border-1">
        <div class="card-body">
          <p class="m-0 fw-bold text" >試算比較清單</p>
          <p class="small">
            <i class="fas fa-check"></i> 請加入 {{ 2 - policies.length }} 種方案
          </p>
          <hr>
          <div v-if="policies.length">
            <div
              v-for="(item, index) in policies"
              :key="item.id" 
              class="d-flex align-items-center justify-content-between mb-2"
            ><!--使用 item.id 作為 key-->
              <a href="#" class="text-danger" style="width: 0%;"  @click.prevent="removeInsurance(index)">
                <i class="fas fa-times"></i>
              </a>
              <div class="d-flex justify-content-between" style="width: 60%;" >
                  <p class="text-dark m-0">{{ item.destination }}</p> <!-- 顯示目的地 -->
                  <p class="text-secondary m-0">${{ item.totalCost }}</p> <!-- 顯示保費 -->
              </div>
            </div>
          </div>
          <button id="compareBtn" type="button" class="btn  w-100 combutton" @click="goToComparison">立即比較</button>
          <!-- <hr />
          <form>
            <div class="input-group">
              <input name="email" placeholder="請輸入您的 E-mail" type="email" class="form-control" />
              <button type="submit" class="btn btn-primary">
                <i class="far fa-paper-plane"></i>
              </button>
            </div>
          </form> -->
        </div>
      </div>
    </div>
  </template>

<style lang="css" scoped>
.text{
  font-weight: bold;
  font-size: 20px;
}

.combutton{
  background-color: lightgray;
  font-weight: bold;
  color: black;
}

.combutton:hover{
  background-color:  #5E666E;
  font-weight: bold;
  color: white;
}

</style>