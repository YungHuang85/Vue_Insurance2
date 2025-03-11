<template>
  <div class="page-container">
    <!-- 固定在視窗正中間的圖片 -->
    <div class="bg-image">
      <img src="../../public/bay2.jpg" alt="背景圖" />
    </div>

    <div class="user-details">
      <h2>填寫受益人資料</h2>
      <form @submit.prevent="submitAndNavigate">
        <!-- 保單號碼 -->
        <div>
          <label for="insuranceNumber">保單號碼：</label>
          <input id="insuranceNumber" v-model="form.insuranceNumber" disabled />
        </div>
        <!-- 受益人姓名 -->
        <div class="form-group" :class="{ 'has-error': !form.beneficiaryName && formSubmitted }">
          <label for="beneficiaryName">受益人姓名：</label>
          <input id="beneficiaryName" v-model="form.beneficiaryName" required />
          <span v-if="!form.beneficiaryName && formSubmitted">此欄位必填</span>
        </div>
        <!-- 與投保人關係 -->
        <div class="form-group" :class="{ 'has-error': !form.relation && formSubmitted }">
          <label for="relation">與投保人關係：</label>
          <select id="relation" v-model="form.relation" required>
            <option value="本人">本人</option>
            <option value="配偶">配偶</option>
            <option value="父子">父子</option>
            <option value="父女">父女</option>
            <option value="母子">母子</option>
            <option value="母女">母女</option>
            <option value="(外)祖父母">(外)祖父母</option>
            <option value="(外)孫子女">(外)孫子女</option>
          </select>
          <span v-if="!form.relation && formSubmitted">此欄位必填</span>
        </div>
        <!-- 受益人身分證字號 -->
        <div class="form-group" :class="{ 'has-error': !form.beneficiaryID && formSubmitted }">
          <label for="beneficiaryID">受益人身分證字號：</label>
          <input id="beneficiaryID" v-model="form.beneficiaryID" required />
          <span v-if="!form.beneficiaryID && formSubmitted">此欄位必填</span>
        </div>
        <!-- 受益人生日 -->
        <div class="form-group" :class="{ 'has-error': !form.beneficiaryBirthday && formSubmitted }">
          <label for="beneficiaryBirthday">受益人生日：</label>
          <input id="beneficiaryBirthday" type="date" v-model="form.beneficiaryBirthday" required />
          <span v-if="!form.beneficiaryBirthday && formSubmitted">此欄位必填</span>
        </div>
        <!-- 受益人性別 -->
        <div class="form-group" :class="{ 'has-error': !form.beneficiaryGender && formSubmitted }">
          <label for="beneficiaryGender">受益人性別：</label>
          <select id="beneficiaryGender" v-model="form.beneficiaryGender" required>
            <option value="">請選擇</option>
            <option value="男">男</option>
            <option value="女">女</option>
          </select>
          <span v-if="!form.beneficiaryGender && formSubmitted">此欄位必填</span>
        </div>
        <!-- 受益人電話 -->
        <div class="form-group" :class="{ 'has-error': !validatePhone(form.beneficiaryPhone) && formSubmitted }">
          <label for="beneficiaryPhone">受益人電話：</label>
          <input id="beneficiaryPhone" v-model="form.beneficiaryPhone" required />
          <span v-if="!validatePhone(form.beneficiaryPhone) && formSubmitted">電話格式不正確</span>
        </div>
        <!-- 受益人地址 -->
        <div class="form-group" :class="{ 'has-error': !form.beneficiaryAddress && formSubmitted }">
          <label for="beneficiaryAddress">受益人地址：</label>
          <input id="beneficiaryAddress" v-model="form.beneficiaryAddress" required />
          <span v-if="!form.beneficiaryAddress && formSubmitted">此欄位必填</span>
        </div>

        <!-- 按鈕容器 -->
        <div class="button-group">
          <button type="button" @click="goLastPage">上一頁</button>
          <button type="button" @click="travelInsuranceStore.autoFillDataForBene">一鍵插入</button>
          <button type="submit">進行繳費</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { useTravelInsuranceStore } from '@/store/travelInsuranceStore';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

export default defineComponent({
  setup() {
    const travelInsuranceStore = useTravelInsuranceStore();
    const { form, client } = storeToRefs(travelInsuranceStore);
    const router = useRouter();

    // 受益人電話格式驗證
    const validatePhone = (phone) => {
      return travelInsuranceStore.validatePhone(phone);
    };

    // 上一頁
    const goLastPage = () => {
      router.push('/travelclient');
    };

    // 提交並導向繳費頁面
    const submitAndNavigate = () => {
      travelInsuranceStore.formSubmitted = true;

      // 表單驗證成功，導向繳費頁面
      router.push('/payment');
    };

    return {
      form,
      client,
      travelInsuranceStore,
      validatePhone,
      goLastPage,
      submitAndNavigate,
    };
  },
  mounted() {
    window.scrollTo(0, 0); // 頁面打開時自動滾動到最上方
  },
});
</script>

<style scoped>
.user-details {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.92);
  margin-top: 120px;
  font-size: 1.2em;
  /* 加入放大效果 */
  transform: scale(1.2);
  /* 整體放大倍數 */
  transform-origin: top;
  /* 設定縮放的基點 */
  font-weight: bold;
}

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

button[type="submit"] {
  background-color: #33393f;
  color: white;
  width: 180px;
}

button[type="submit"]:hover {
  background-color: #5a6268;
}

button[type="button"] {
  background-color: #646969;
  color: white;
  width: 180px;
}

button[type="button"]:hover {
  background-color: #5a6268;
}

html,
body {
  margin: 0;
  padding: 0;

}

.page-container {
  position: relative;
  min-height: 150vh;
  /* 讓頁面足夠長可測試捲動，你可依需求調整 */
  margin: 0;
  padding: 0;
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
  width: 2700px;
  /* 例如：800px 寬 */
  height: auto;
  /* 高度自動，保持比例 */
  opacity: 0.6;
  /* 半透明，可視需求微調 */
  pointer-events: none;
  /* 滑鼠事件穿透，避免擋住表單 */
}
</style>
