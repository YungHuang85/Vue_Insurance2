<template>
  <div class="verify-code-container">
    <div class="verify-code">
      <h2>請輸入驗證碼</h2>
      <!-- 第一段文字 -->
      <p class="info-text">我們已發送驗證碼至您註冊時填寫的信箱<strong>{{ maskedEmail }}</strong></p>
      
      <div>
        <span>{{ verificationCodePrefix }} - </span>
        <input
          v-model="form.verificationCode"
          placeholder="輸入驗證碼後4碼數字"
          maxlength="4"
          @input="validateNumericInput"
        />
      </div>
      <el-button :loading="loading" type="primary" @click="submitVerificationCode">
        <span v-if="!loading">下一步</span>
        <span v-else>驗證中...</span>
      </el-button>
      <!-- 第二段文字 -->
      <p class="help-text">
  若您的 email 有異動以至於無法收到驗證碼，<br />
  請致電 <strong>0800-202-490</strong>，我們將協助您。
</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import axios from "axios";

export default {
  setup() {
    const router = useRouter();
    const form = ref({
      verificationCode: "",
    });
    const verificationCodePrefix = ref(""); // 儲存驗證碼前4碼
    const loading = ref(false);
    const maskedEmail = ref(""); // 儲存隱藏的 email

    const loadVerificationCodePrefix = async () => {
      try {
        const idNumber = sessionStorage.getItem("idNumber"); // 從 sessionStorage 獲取 idNumber
        if (!idNumber) {
          Swal.fire({
            title: "錯誤",
            text: "身份證字號未找到，請重新輸入忘記密碼流程",
            icon: "error",
            confirmButtonText: "好",
          });
          router.push("/forgotPassword"); // 跳轉回忘記密碼頁
          return;
        }

        // 獲取驗證碼前4碼
        const response = await axios.get("http://localhost:8081/verificationCodePrefix", {
          params: { idNumber }, // 傳遞 idNumber 作為請求參數
        });

        if (response.data.verificationCodePrefix) {
          verificationCodePrefix.value = response.data.verificationCodePrefix; // 更新驗證碼前4碼
        } else {
          Swal.fire({
            title: "錯誤",
            text: response.data.errorMessage || "無法加載驗證碼前4碼",
            icon: "error",
            confirmButtonText: "好",
          });
        }

        // 獲取隱碼 email
        const emailResponse = await axios.get("http://localhost:8081/memberEmail", {
          params: { idNumber },
        });
        if (emailResponse.data.maskedEmail) {
          maskedEmail.value = emailResponse.data.maskedEmail;
        } else {
          Swal.fire({
            title: "錯誤",
            text: "無法加載會員的隱碼 email",
            icon: "error",
            confirmButtonText: "好",
          });
        }
      } catch (error) {
        Swal.fire({
          title: "系統錯誤",
          text: "無法加載資料，請稍後再試",
          icon: "error",
          confirmButtonText: "好",
        });
        console.error("無法加載資料", error);
      }
    };

    const validateNumericInput = (event) => {
      form.value.verificationCode = event.target.value.replace(/\D/g, "").slice(0, 4); // 僅保留4位數字
    };

    const submitVerificationCode = async () => {
      if (loading.value) return;
      loading.value = true;

      try {
        const response = await axios.post("http://localhost:8081/verifyCode", {
          idNumber: sessionStorage.getItem("idNumber"), // 從 sessionStorage 獲取 idNumber
          verificationCode: form.value.verificationCode, // 使用者輸入的後4碼
        });

        if (response.data.successMessage) {
          Swal.fire({
            title: "驗證成功",
            text: "即將跳轉至修改密碼頁面",
            icon: "success",
            confirmButtonText: "確定",
          }).then(() => {
            router.push("/membersNewPwd");
          });
        } else {
          Swal.fire({
            title: "驗證失敗",
            text: response.data.errorMessage,
            icon: "error",
            confirmButtonText: "好",
          });
        }
      } catch (error) {
        Swal.fire({
          title: "系統錯誤",
          text: "伺服器無法處理您的請求，請稍後再試",
          icon: "error",
          confirmButtonText: "好",
        });
        console.error(error);
      } finally {
        loading.value = false;
      }
    };

    // 元件掛載時加載驗證碼前4碼和 email
    onMounted(() => {
      loadVerificationCodePrefix();
    });

    return {
      form,
      verificationCodePrefix,
      maskedEmail,
      loading,
      validateNumericInput,
      submitVerificationCode,
    };
  },
};
</script>
<style scoped>
.verify-code-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* 讓容器滿版高度 */
  background-color: #f5f5f5; /* 背景色 */
}

.verify-code {
  max-width: 500px;
  width: 100%;
  padding: 30px;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.15);
  text-align: center;
  transition: all 0.3s ease-in-out;
}

.verify-code h2 {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
  border-bottom: 2px solid #4CAF50;
  display: inline-block;
  padding-bottom: 10px;
}

.info-text {
  font-size: 20px;
  color: #555;
  margin-bottom: 25px;
}

.verify-code input {
  width: 40%;
  padding: 10px;
  font-size: 20px;
  margin-top: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  text-align: center; /* 讓輸入文字置中 */
}

.verify-code .el-button {
  font-size: 20px;
  margin-top: 30px;
  width: auto; /* 自動調整按鈕寬度 */
  padding: 10px 20px; /* 設定內邊距 */
}

.help-text {
  font-size: 14px;
  color: #999;
  margin-top: 20px;
  line-height: 1.8;
  text-align: center;
}
</style>