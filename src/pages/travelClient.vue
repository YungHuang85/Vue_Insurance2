<template>
  <div class="page-container">
    <!-- 固定在視窗正中間的圖片 -->
    <div class="bg-image">
      <img src="../../public/bay2.jpg" alt="背景圖" />
    </div>

    <div class="user-details">
      <h1>旅行平安險</h1>
      <h2>填寫投保人資料</h2>
      <form @submit.prevent="submitForm">
        <!-- 保單號碼 -->
        <div class="form-group">
          <label for="insuranceNumber">保單號碼：</label>
          <input id="insuranceNumber" v-model="form.insuranceNumber" disabled />
        </div>

        <!-- 個人照片 -->
        <div class="form-group">
          <label for="profilePicture">個人照片：</label>
          <input id="profilePicture" type="file" accept="image/*" @change="onFileChange" />
        </div>

        <!-- 姓名 -->
        <div class="form-group">
          <label for="username">姓名：</label>
          <input id="username" v-model="client.username" required />
        </div>

        <!-- 身分證號 -->
        <div class="form-group">
          <label for="id_number">身分證號：</label>
          <input id="id_number" v-model="client.id_number" required />
        </div>

        <!-- 生日 -->
        <div class="form-group">
          <label for="birthday">生日：</label>
          <input id="birthday" type="date" v-model="client.birthday" required />
        </div>

        <!-- 性別 -->
        <div class="form-group">
          <label for="gender">性別：</label>
          <select id="gender" v-model="client.gender" required>
            <option value="">請選擇</option>
            <option value="男">男</option>
            <option value="女">女</option>
          </select>
        </div>

        <!-- 電話 -->
        <div class="form-group">
          <label for="phone">電話：</label>
          <input id="phone" type="tel" v-model="client.phone" required />
        </div>

        <!-- 電子郵件 -->
        <div class="form-group">
          <label for="email">電子郵件：</label>
          <input id="email" type="email" v-model="client.email" required />
        </div>

        <!-- 地址 -->
        <div class="form-group">
          <label for="address">地址：</label>
          <input id="address" v-model="client.address" required />
        </div>

        <!-- 投保商品 (隱藏) -->
        <input id="product" type="hidden" v-model="client.product" />

        <!-- 旅遊地區 -->
        <div class="form-group">
          <label for="location">旅遊地區：</label>
          <select id="location" v-model="client.location" required>
            <option value="" disabled>請選擇地區</option>
            <option value="台灣">台灣</option>
            <option value="日韓">日韓</option>
            <option value="東南亞">東南亞</option>
            <option value="歐洲">歐洲</option>
            <option value="美加">美加</option>
            <option value="紐澳">紐澳</option>
          </select>
        </div>

        <!-- 生效日期、結束日期 -->
        <div class="form-group">
          <label for="startTimeA">生效日期：</label>
          <input id="startTimeA" type="date" v-model="client.startTime" @change="travelInsuranceStore.validateDates"
            required />
        </div>
        <div class="form-group">
          <label for="endTimeA">結束日期：</label>
          <input id="endTimeA" type="date" v-model="client.endTime" @change="travelInsuranceStore.validateDates"
            required />
        </div>

        <!-- 保險天數 -->
        <div class="form-group">
          <label>保險天數：</label>
          <span>{{ client.days || '請選擇日期' }}</span>
        </div>

        <!-- 保額（意外身故） -->
        <div class="form-group">
          <label for="sumAssuredA">意外身故：</label>
          <select id="sumAssuredA" v-model="client.sumAssured" @change="travelInsuranceStore.fetchPremiums" required>
            <option value="100W">100萬</option>
            <option value="300W">300萬</option>
            <option value="500W">500萬</option>
            <option value="700W">700萬</option>
            <option value="1000W">1000萬</option>
          </select>
        </div>

        <!-- 保費（意外身故費用） -->
        <div class="form-group">
          <label for="premiumsA">意外身故費用：</label>
          <input id="premiumsA" type="number" min="0" v-model="client.premiums" readonly disabled />
        </div>

        <details open>
          <summary>附加醫療</summary>
          <div class="addon-container">

            <!-- 傷害醫療 -->
            <div>
              <input type="checkbox" id="enableMedical" v-model="client.enableMedical"
                @change="travelInsuranceStore.fetchPremiums" />
              <label class="form-check-label" for="enableMedical">
                傷害醫療
              </label>
              <input class="extra" v-model="client.medicalCoverage" @change="travelInsuranceStore.fetchPremiums"
                required disabled readonly style="width: 150px;" />
              <div><span class="cost-label">{{ client.medicalTreatment }} 元</span></div>
            </div>

            <!-- 海外突發疾病醫療 -->
            <div>
              <input type="checkbox" id="enableOverseasIllness" v-model="client.enableOverseasIllness"
                @change="travelInsuranceStore.fetchPremiums" />
              <label class="form-check-label" for="enableOverseasIllness">
                海外突發疾病醫療
              </label>
              <input class="extra" v-model="client.overseasIllnessCoverage" @change="travelInsuranceStore.fetchPremiums"
                required disabled readonly style="width: 150px;" />
              <div><span class="cost-label">{{ client.overseasIllness }} 元</span></div>
            </div>

            <!-- 海外醫療專機運送 -->
            <div>
              <input type="checkbox" id="enableOverseasFlights" v-model="client.enableOverseasFlights"
                @change="travelInsuranceStore.fetchPremiums" />
              <label class="form-check-label" for="enableOverseasFlights">
                海外醫療專機運送
              </label>
              <input class="extra" v-model="client.overseasFlightsCoverage" @change="travelInsuranceStore.fetchPremiums"
                required disabled readonly style="width: 150px;" />
              <div> <span class="cost-label">{{ client.overseasFlights }} 元</span></div>
            </div>
          </div>
        </details>

        <!-- 總保費 -->
        <div class="form-group">
          <label for="totalCost">總保費：</label>
          <input id="totalCost" type="number" v-model="client.totalCost" readonly disabled />
        </div>

        <!-- 按鈕群組 -->
        <div class="button-group">
          <button type="button" @click="goLastPage">上一頁</button>
          <button type="button" @click="travelInsuranceStore.autoFillDataForClient">一鍵插入</button>
          <button type="submit" @click="submitAndNavigate">下一頁</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { useTravelInsuranceStore } from '@/store/travelInsuranceStore';
import { storeToRefs } from 'pinia';
import { onMounted, defineComponent } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  setup() {
    const travelInsuranceStore = useTravelInsuranceStore();
    const { form, client } = storeToRefs(travelInsuranceStore);
    const router = useRouter();

    // 進入畫面時，先產生或取出保單號
    onMounted(() => {
      travelInsuranceStore.generateInsuranceNumber();

    });

    // 上一頁
    const goLastPage = () => {
      router.push('/productPage');
    };

    // 處理圖片上傳
    const onFileChange = (event) => {
      const file = event.target.files[0];
      travelInsuranceStore.handleFileUpload(file);
    };

    // 提交表單
    const submitForm = () => {
      travelInsuranceStore.formSubmitted = false; // 重置狀態
      console.log('表單驗證成功，準備進行下一步...');
    };

    // 下一頁
    const submitAndNavigate = () => {
      submitForm();
      if (travelInsuranceStore.validateClientForm()) {
        router.push('/bene');
      }
    };

    return {
      form,
      client,
      travelInsuranceStore,
      onFileChange,
      submitForm,
      submitAndNavigate,
      goLastPage,
    };
  },
});
</script>

<style scoped>
.user-details {
  font-weight: bold;
  position: relative;
  z-index: 1;
  margin: 50px auto;
  margin-top: 120px;
  /* 左右自動置中，上方留 50px 空間 */
  padding: 30px;
  background-color: rgba(255, 255, 255, 0.92);
  /* 半透明背景，方便閱讀文字 */
  border: 1px solid #ccc;
  border-radius: 8px;
  flex: 1;
  font-size: 1.4em;
}

/* 其餘原先的樣式可保持不動或視需求調整 */
.user-details h1,
.user-details h2 {
  text-align: center;
  margin-bottom: 20px;
  font-weight: bold;
}

.user-details form div {
  margin-bottom: 15px;
}

.user-details label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.user-details input,
.user-details select {
  width: calc(100%);
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.button-group {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 20px;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button[type='submit'] {
  background-color: #33393f;
  color: white;
  width: 180px;
}

button[type='submit']:hover {
  background-color: #5a6268;
}

button[type='button'] {
  background-color: #646969;
  color: white;
  width: 180px;
}

button[type='button']:hover {
  background-color: #5a6268;
}


.form-group {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
}

.form-group input[type='file'] {
  width: calc(100%);
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  box-sizing: border-box;
}

.form-group input[type='file']:hover {
  border-color: #888;
}

.form-group input[type='file']::-webkit-file-upload-button {
  background-color: #33393f;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 7px 12px;
  cursor: pointer;
}

/* 讓 Checkbox 和文字在同一行，可視需求調整 */
.form-group label {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

/* --- 附加醫療區塊相關樣式 --- */
details {
  margin-top: 10px;
  margin-bottom: 10px;
  padding: 10px;
  border: 2px solid #ccc;
  border-radius: 8px;
  background-color: #ffffff;
  transition: all 0.3s ease;
}

/* summary: 摺疊標題的可點擊區塊 */
details summary {
  cursor: pointer;
  font-size: 16px;
  font-weight: 700;
  color: #33393f;
  outline: none;
  /* 讓 summary 佔滿 details 的寬度，並與邊框保持一致 */
  margin: -10px -10px 10px -10px;
  padding: 10px;
  border-radius: 8px;
  background-color: #eee;

}

/* 摺疊後展開區塊裡面，若想在展開後 summary 與內容之間留些距離，可保留此設定 */
details[open] summary {
  margin-bottom: 10px;
}

/* 附加醫療容器 */
.addon-container {
  justify-content: center;
  display: flex;
  text-align: center;
  gap: 15px;

}

/* 費用標示(紅字) */
.cost-label {
  font-weight: bold;
  margin-left: auto;
}

.extra {
  text-align: center;
}


html,
body {
  margin: 0;
  padding: 0;

}

.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  /* 保證頁面至少填滿視窗高度 */
}

/* 2) 放置圖片的容器：固定在視窗中央 */
.bg-image {
  position: fixed;
  /* 隨捲動保持不動 */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  /* 使圖片以中心點對準視窗正中 */
  z-index: 0;
  /* 設定在最底層，表單會疊在上面 */
}

/* 3) 實際圖片，透過 width/height 控制比例(你可自行決定) */
.bg-image img {
  width: 2650px;
  /* 例如：800px 寬 */
  height: auto;
  /* 高度自動，保持比例 */
  opacity: 0.66;
  /* 半透明，可視需求微調 */
  pointer-events: none;
  /* 滑鼠事件穿透，避免擋住表單 */
}
</style>
