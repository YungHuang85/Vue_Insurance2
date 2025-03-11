<template>
  <div class="wrapper">
    <el-tabs v-model="activeName" class="demo-tabs">

      <el-tab-pane label="理賠申請" name="notApplied">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">保單號碼</th>
              <th scope="col">商品名稱</th>
              <th scope="col">投保人 </th>
              <th scope="col">受益人</th>
              <th scope="col">功能</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(policy, index) in notAppliedPolicies" :key="policy.insuranceNumber">
              <td>{{ policy.insuranceNumber }}</td>
              <td>{{ policy.insuranceProduct }}</td>
              <td>{{ policy.username }}</td>
              <td>{{ policy.beneficiaryName }}</td>
              <td>
                <button class="btn btn-primary btn-sm" @click="applyClaim(policy)">申請理賠</button>
              </td>
            </tr>

          </tbody>

        </table>

      </el-tab-pane>

      <!-- 所有理賠記錄 -->

      <el-tab-pane label="理賠進度查詢" name="claimsHistory">
        <!-- 篩選下拉選單 -->
        <div class="mb-3">
          <select v-model="selectedStatus" class="form-select">
            <option v-for="status in uniqueStatuses" :key="status" :value="status">
              {{ status }}
            </option>
          </select>
        </div>

        <!-- 資料表 -->
        <table class="table">
          <thead>
            <tr>
              <th scope="col">保單號碼</th>
              <th scope="col">商品名稱</th>
              <th scope="col">投保人</th>
              <th scope="col">受益人</th>
              <th scope="col">理賠進度</th>
              <th scope="col">給付金額</th>
              <th scope="col">備註欄</th>
              <th v-if="selectedStatus === '待審核'" scope="col">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(policy, index) in filteredClaims" :key="policy.policyNumber">
              <td>{{ policy.policyNumber }}</td>
              <td>{{ policy.policyName }}</td>
              <td>{{ policy.clientName }}</td>
              <td>{{ policy.beneficiaryName }}</td>
              <td>{{ policy.claimStatus }}</td>
              <td>{{ policy.claimAmount }}</td>
              <td>{{ policy.comment }}</td>
              <td v-if="selectedStatus === '待審核'">
                <button class="btn btn-danger btn-sm" @click="handleDelete(policy)">取消申請</button>
              </td>
            </tr>
          </tbody>
        </table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useClaimsStore } from '../store/ClaimStore.js'
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';

const router = useRouter();
const idNumber = ref(sessionStorage.getItem("idNumber") || "訪客");
console.log(idNumber);
console.log(`http://localhost:8081/GetNotApplyCliams/${idNumber.value}`);

// 目前選中的 Tab
const activeName = ref('notApplied') // 預設顯示 "未申請理賠"

const store = useClaimsStore()


// API Base URL
const BASE_URL = import.meta.env.VITE_APIURL

// 未申請理賠的保單
const notAppliedPolicies = ref([])
const claimsHistory = ref([])

// 讀取未申請理賠的保單
const loadNotAppliedPolicies = async () => {
  const API_URL = `http://localhost:8081/GetNotApplyCliams/${idNumber.value}`
  const response = await fetch(API_URL)
  if (response.ok) {
    notAppliedPolicies.value = await response.json()
  } else {

    Swal.fire({
      title: "失敗",
      text: "獲取未申請理賠保單失敗！",
      icon: "error",
      confirmButtonText: "確認",
    });
  }
}

// 讀取所有理賠記錄
const loadClaimsHistory = async () => {
  //const API_URL = `http://localhost:8081/GetInsuranceClaimAll`
  const API_URL = `http://localhost:8081/GetInsuranceClaimbyID/${idNumber.value}`
  console.log("理賠紀錄" + API_URL);
  const response = await fetch(API_URL)
  if (response.ok) {
    claimsHistory.value = await response.json();
    console.log(claimsHistory.value);
  } else {
    Swal.fire({
      title: "失敗",
      text: "獲取理賠記錄失敗！",
      icon: "error",
      confirmButtonText: "確認",
    });

  }
}

// **將點擊的保單資料存入 Pinia**
function applyClaim(policy) {
  store.reset();
  store.ClaimData.policyNumber = policy.insuranceNumber
  store.ClaimData.policyName = policy.insuranceProduct
  store.ClaimData.id_number = policy.id_number
  store.ClaimData.clientName = policy.username
  store.ClaimData.beneficiaryName = policy.beneficiaryName
  store.ClaimData.beneficiaryID = policy.beneficiaryID


  console.log('保單資料已存入 Pinia', store.ClaimData);
  router.push('/InsertClaimsNew');
}
// **自動獲取唯一的理賠進度選項**
const uniqueStatuses = computed(() => [...new Set(claimsHistory.value.map((claim) => claim.claimStatus))])

// **選擇的理賠進度，預設為「待審核」**
const selectedStatus = ref('待審核')

// **根據選擇的理賠進度篩選表格資料**
const filteredClaims = computed(() =>
  claimsHistory.value.filter((claim) => claim.claimStatus === selectedStatus.value)
)

// **刪除按鈕功能**
const handleDelete = async (policy) => {
  console.log('刪除保單：' + policy.policyNumber);
  let delete_URL = `http://localhost:8081/DeleteClaims/${policy.policyNumber}`;

  console.log('發送 DELETE 請求至:', delete_URL);

  try {
    const response = await fetch(delete_URL, {
      method: 'DELETE' // ✅ 指定 DELETE 方法

    });

    if (response.ok) {
      Swal.fire({
        title: "成功",
        text: "取消理賠申請成功",
        icon: "success",
        confirmButtonText: "確認",
      });



      // 重新讀取理賠資料，確保前後端同步
      //兩個同時執行
      await Promise.all([loadClaimsHistory(), loadNotAppliedPolicies()]);


    } else {

      Swal.fire({
        title: "失敗",
        text: "刪除失敗！",
        icon: "error",
        confirmButtonText: "確認",
      });
    }
  } catch (error) {
    console.error('刪除請求錯誤:', error);

  }
};


// 在組件載入時自動取得資料
onMounted(() => {
  loadNotAppliedPolicies()
  loadClaimsHistory()
})
</script>

<style scoped>
/* 設定 Tabs 整個標籤列的背景為白色 */
::v-deep(.el-tabs__header) {
  background-color: white !important;
  border-bottom: 1px solid #ddd;
  /* 加個底線讓區隔更清楚 */
  padding: 5px 10px;
  border-radius: 8px;
}

::v-deep(.el-tabs__item) {
  min-width: 100px;
  /* 讓 Tab 按鈕大小與 Navbar 按鈕一致 */
  text-align: center;
  font-weight: bold;
  font-size: 16px;

  /* 預設文字顏色（灰綠色） */
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 10px 15px;
  margin-right: 10px;
  transition: background-color 0.3s ease;
  background-color: white;
  /* ✅ 設定未選中時的背景為白色 */
}



th {
  background-color: black;

  /* 设置背景颜色为黑色 */
  color: white;
  /* 设置字体颜色为白色 */
}

.wrapper {
  width: 80vw;
  /* 限制寬度為螢幕的 80% */
  margin: auto;
  /* 讓內容區塊置中 */
  padding: 10px;
}



.demo-tabs>.el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 16px;
  font-weight: 600;
}
</style>
