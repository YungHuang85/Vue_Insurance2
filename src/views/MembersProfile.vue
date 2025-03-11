<template>
  <div class="Profile">
    <h2></h2>
    <div class="profile-container">
      <!-- 左側會員資訊 -->
      <div class="profile-left">
        <div class="info-card">
          <p><strong></strong> {{ username }}，您好</p>
          <p><strong></strong> {{ memberLevel }}</p>
          <p><strong>專屬推薦碼 :</strong> {{ account }}</p>
          <p><strong>我的點數 :</strong> {{ points }}</p>
        </div>
      </div>
      <!-- 右側功能區塊 -->
      <div class="profile-right">
        <div class="feature-card" @click="goToPolicy">
          <font-awesome-icon :icon="['fas', 'file-shield']" />
          <p>我的保單</p>
        </div>
        <div class="feature-card" @click="goToClaims">
          <font-awesome-icon :icon="['fas', 'shield-alt']" />
          <p>理賠專區</p>
        </div>
        <div class="feature-card" @click="goToMemberInformation">
          <font-awesome-icon :icon="['fas', 'user']" />
          <p>會員資料</p>
        </div>
        <div class="feature-card" @click="goToMembersPassword">
          <font-awesome-icon :icon="['fas', 'user-lock']" />
          <p>修改密碼</p>
        </div>
        <div class="feature-card" @click="goToActivity">
          <font-awesome-icon :icon="['fas', 'star']" />
          <p>專屬活動</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import axios from "axios";


export default {
  name: "membersprofile",
  components: {
    FontAwesomeIcon,
  },
  setup() {
    const router = useRouter();

    const username = ref(sessionStorage.getItem("username") || "訪客");
    const memberLevel = ref("一般會員");
    const email = ref(sessionStorage.getItem("email") || "訪客");
    const account = ref(sessionStorage.getItem("account") || "訪客");
    const idNumber = ref(sessionStorage.getItem("idNumber") || "訪客");
    const points = ref(0);
    if (!username.value || !email.value || !account.value) {
      router.push("/login");
    }


    const fetchPoints = async () => {
      try {
        console.log("調用 API 獲取點數...");
        const response = await axios.get("http://localhost:8081/getpoints", {
          params: { email: email.value },
        });
        console.log("API 返回結果:", response.data); // 打印 API 返回數據
        if (response.data.success) {
          points.value = response.data.points; // 更新 points 的值
        } else {
          console.error("無法獲取點數:", response.data.message);
        }
      } catch (error) {
        console.error("獲取點數失敗:", error);
      }
    };
    onMounted(() => {
      fetchPoints();
      console.log("當前 points 的值:", points.value); // 確認是否為 100
    });

    const goToPolicy = () => router.push("/insuranceSearch");
    const goToClaims = () => router.push("/ClaimsShow");
    const goToActivity = () => router.push("/memberActivity");
    const goToMemberInformation = () => router.push("/memberInformation");
    const goToMembersPassword = () => router.push("/membersPassword");




    return {
      username,
      memberLevel,
      email,
      account,
      idNumber,
      points,
      goToPolicy,
      goToClaims,
      goToActivity,
      goToMemberInformation,
      goToMembersPassword,
    };
  },


};
</script>

<style scoped>
/* 全局字體與樣式 */
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&family=Roboto:wght@300;500&display=swap");

* {
  font-family: "Poppins", "Roboto", sans-serif;
  line-height: 1.6;
  color: #333;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.Profile {
  max-width: 1100px;
  margin: 200px auto;
  /* 添加 margin-top 讓它離 header 有距離 */
  padding: 40px;
  /* 適當減少 padding 以免內容太擁擠 */
  border: 1px solid #ddd;
  border-radius: 10px;
  background-color: #fdfdfd;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h2 {
  font-size: 24px;
  font-weight: 600;
  text-align: center;
  color: #222;
  margin-bottom: 20px;
}

.profile-container {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.profile-left {
  flex: 1;
}

.info-card {
  padding: 40px;
  border-radius: 10px;
  background: #ffffff;
  box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.08);
  margin-right: 15px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border-left: 5px solid #4CAF50;
  /* 左邊加綠色標示條 */
  transition: transform 0.3s, box-shadow 0.3s;
}

.info-card:hover {
  transform: scale(1.02);
  box-shadow: 5px 5px 20px rgba(0, 0, 0, 0.15);
}

.info-card p:first-child {
  font-size: 26px;
  font-weight: bold;
  color: #2E7D32;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.15);
  margin-bottom: 10px;
}

.info-card p {
  font-size: 18px;
  color: #333;
  margin-bottom: 15px;
  line-height: 1.8;
  display: flex;
  align-items: center;
  gap: 5px;
  /* 增加標題與數值的間距 */
}

.info-card p:first-child strong {
  font-size: 26px;
  /* 加大字體 */
  font-weight: 700;
  color: #222;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  /* 增加陰影效果 */
}

.info-card strong {
  font-weight: 600;
  font-size: 20px;
  color: #222;
}

.info-card p:nth-child(3) strong,
.info-card p:nth-child(4) strong {
  color: #053013;
  /* 橘色標題 */
}

.info-card p:nth-child(3) span,
.info-card p:nth-child(4) span {
  font-weight: bold;
  color: #06121f;
  /* 藍色數值 */
}

.profile-right {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px;
}

/* feature-card 的淡綠色設計 */
.feature-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px;
  border: 2px solid #cce5cc;
  border-radius: 10px;
  background: linear-gradient(135deg, #a8d5a8, #cce5cc);
  text-align: center;
  color: #2f4f2f;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 1px;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.feature-card:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  /* 加深陰影效果 */
  background: linear-gradient(135deg, #cce5cc, #a8d5a8);
  /* 反轉淡綠漸層 */
}

.feature-card p {
  margin-top: 10px;
  font-size: 23px;
  font-weight: bold;
  color: #2f4f2f;
  /* 深綠字體 */
}
</style>