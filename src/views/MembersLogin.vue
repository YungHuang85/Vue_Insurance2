<template>
  <div id="element-plus">
    <div class="MemberLogin">
      <h2>會員登入</h2>
      <el-form :model="form" :rules="rules" ref="memberLoginForm" label-width="100px">
        <!-- 身分證字號欄位 -->
        <el-form-item label="身分證字號" prop="idNumber">
          <el-row>
            <el-col :span="24">
              <el-input v-model="form.idNumber" placeholder="格式:A123456789" maxlength="10" minlength="10"
                @blur="convertToUppercase('idNumber')"></el-input>
            </el-col>
          </el-row>
        </el-form-item>

        <!-- 密碼欄位 -->
        <el-form-item label="密碼" prop="password"> <el-row>
            <el-col :span="24">
              <el-input v-model="form.password" :type="passwordFieldType" placeholder="請輸入密碼">
                <template #suffix>
                  <i :class="passwordVisible ? 'fa fa-eye-slash' : 'fa fa-eye'" class="toggle-password-icon"
                    @click="togglePasswordVisibility"></i>

                </template>
              </el-input>
              <el-col :span="6" class="forgot-password-col">
                <el-button @click="goToForgotPwd" type="text">忘記密碼?</el-button>
              </el-col>

            </el-col>
          </el-row>

        </el-form-item>


        <!-- 登入按鈕 -->
        <el-row class="custom-row" gutter="20">
          <!-- 登入和 Google 登入按鈕 -->
          <el-col :span="24" class="login-section">
            <el-button type="primary" @click="submitForm">登入</el-button>

            <el-button @click="autoFill">一鍵帶入</el-button>
            <el-button @click="autoFill2">帶入新密碼</el-button>

          </el-col>
          <!--  <el-button class="btn-text" type="primary" @click="redirectToGoogle">以 Google 帳號登入</el-button> -->

          <el-button class="google-btn" @click="handleSignIn">
            <div class="google-icon-wrapper">
              <img class="google-icon" src="@/assets/google.png" />
            </div>
            <span class="btn-text" type="primary" @click="redirectToGoogle">以 Google 帳號登入</span>
          </el-button>

          <!-- 還不是會員嗎？立即註冊 -->
          <el-col :span="24" class="register-section">
            <div class="register-text">
              <span class="not-member-text">還不是會員嗎？</span>
              <el-button @click="goToRegister" type="text" class="register-button">
                立即註冊
              </el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>

    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import axios from "axios";
import { useUserStore } from "@/store/userStore";
import LineShareButton from "@/components/LineShareButton.vue";
import LineShareButtonCustom from "@/components/LineShareButtonCustom.vue";

export default {
  name: "MembersLogin",
  setup() {
    const router = useRouter();
    const userStore = useUserStore();

    const form = ref({
      idNumber: "",
      password: "",
    });

    const passwordVisible = ref(true); // 密碼可見性狀態
    const passwordFieldType = computed(() =>
      passwordVisible.value ? "password" : "text"
    );

    const togglePasswordVisibility = () => {
      passwordVisible.value = !passwordVisible.value;
      console.log("Password visibility:", passwordVisible.value);
    };

    const rules = ref({
      idNumber: [
        { required: true, message: "請輸入身分證字號", trigger: "blur" },
        {
          pattern: /^[A-Z][12]\d{8}$/,
          message: "身分證字號格式不正確",
          trigger: "blur",
        },
      ],
      password: [
        { required: true, message: "請輸入密碼", trigger: "blur" },
        {
          pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%&])[A-Za-z\d!@#$%&]{8,16}$/,
          message: "密碼為大小寫字母、數字及特殊符號組成8-16位",
          trigger: "blur",
        },
      ],
    });

    const memberLoginForm = ref(null);
    let loading = ref(false);

    const saveSessionData = (data) => {
      sessionStorage.setItem("idNumber", data.idNumber);
      sessionStorage.setItem("sessionId", data.sessionId);
      sessionStorage.setItem("username", data.username);
      sessionStorage.setItem("account", data.account);
      sessionStorage.setItem("email", data.email);
      sessionStorage.setItem("birthday", data.birthday);

      if (data.firstLogin) {
        sessionStorage.setItem("firstLogin", "true");
      }
    };

    const submitForm = () => {
      if (loading.value) return;
      loading.value = true;

      memberLoginForm.value.validate(async (valid) => {
        if (!valid) {

          loading.value = false;
          return;
        }

        try {
          const response = await axios.post("http://localhost:8081/membersLogin", form.value);
          console.log(response);

          if (response.data.success) {
            saveSessionData(response.data.data);

            // 更新 Pinia 狀態
            userStore.login(response.data.data.username);

            Swal.fire({
              title: "登入成功",
              text: `歡迎您，${response.data.data.username}`,
              icon: "success",
              confirmButtonText: "確定",
            }).then(() => {
              const firstLogin = sessionStorage.getItem("firstLogin");
              if (firstLogin === "true") {
                sessionStorage.removeItem("firstLogin");
                router.push("/membersprofile"); // 跳轉到活動頁面(失敗)
              } else {
                router.push("/membersprofile"); // 跳轉到會員頁面
              }
            });
          } else {
            Swal.fire({
              title: "無法登入",
              text: response.data.message,
              icon: "error",
              confirmButtonText: "好",
            });

          }
        } catch (error) {
          Swal.fire({
            title: "密碼有誤",
            text: "為保護您的帳戶，輸入錯誤次數超過3次將鎖定您的帳戶",
            icon: "error",
            confirmButtonText: "好",
          });
          console.error(error);
        } finally {
          loading.value = false;
        }
      });
    };

    const goToForgotPwd = () => {
      router.push("/membersforgotPwd1");
    };

    const goToRegister = () => {
      router.push("/membersregister");
    };

    const convertToUppercase = (field) => {
      form.value[field] = form.value[field].toUpperCase();
    };

    // Google OAuth 設定
    const clientId = ref("297976737181-92168784cou077mh5o14d6i4cbt2j12p.apps.googleusercontent.com");
    const redirectUri = ref("http://localhost:5173/oauthCallback");
    const scope = ref(
      "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile"
    );

    // 方法: 重定向到 Google OAuth 授權頁面
    const redirectToGoogle = () => {
      const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId.value}&redirect_uri=${redirectUri.value}&response_type=code&scope=${scope.value}&access_type=offline`;
      window.location.href = authUrl; // 導向 Google 授權頁面
    };

    const autoFill = () => {
      const sampleData = {
        idNumber: "A123456789",
        password: "ASD123asd@@",
      };
      form.value.idNumber = sampleData.idNumber;
      form.value.password = sampleData.password;
    };

    const autoFill2 = () => {
      const sampleData = {
        idNumber: "A123456789",
        password: "1qaz@WSX@@",
      };
      form.value.idNumber = sampleData.idNumber;
      form.value.password = sampleData.password;
    };




    return {
      form,
      rules,
      memberLoginForm,
      submitForm,
      goToForgotPwd,
      goToRegister,
      convertToUppercase,
      redirectToGoogle,
      autoFill,
      autoFill2,
      passwordVisible,
      passwordFieldType,
      togglePasswordVisibility,

    };
  }, components: {
    LineShareButton,
    LineShareButtonCustom,
  },
};
</script>

<style scoped>
#element-plus {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.MemberLogin {
  max-width: 400px;
  width: 100%;
  padding: 30px;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

/* ======== 標題樣式 ======== */
h2 {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #4CAF50;
}

/* ======== 輸入框間距 ======== */
.el-form-item {
  margin-bottom: 15px;
  /* 縮小間距，避免太散 */
}

/* ======== 忘記密碼按鈕 ======== */
.forgot-password-col {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
  margin-left: 20px;
}

.forgot-password-col .el-button {
  font-size: 14px;
  color: #409eff;
}

/* ======== 登入 & 一鍵帶入 ======== */
.login-section {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  /* 讓「登入」與「一鍵帶入」之間有 10px 間距 */
  margin-bottom: 10px;
  /* 與 Google 登入按鈕保持 10px 距離 */
  position: relative;
}


/* ======== Google 登入按鈕 ======== */
.google-login {
  display: flex;
  justify-content: flex-end;
  /* 靠右對齊 */
  width: 100%;
  /* 讓它與上方按鈕等寬 */
}

.google-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px 15px;
  cursor: pointer;
  width: 220px;
  /* 限制寬度，避免過寬 */
  text-align: center;
  margin-top: 10px;
  /* 與上方 login-section 保持 10px 距離 */
  margin-left: 20%;
}

/* Google 圖標與文字對齊 */
.google-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  /* 與文字保持間距 */
}

/* Google 圖標大小 */
.google-icon {
  width: 20px;
  height: 20px;
}

/* ======== 註冊連結 ======== */
.register-text {
  margin-top: 20px;
  font-size: 14px;
}

.register-text span {
  color: #666;
}

/* ======== 密碼顯示/隱藏眼睛按鈕 ======== */
.toggle-password-icon {
  cursor: pointer;
  font-size: 16px;
  color: #888;
}

.toggle-password-icon:hover {
  color: #333;
}

.register-button {
  color: rgb(17, 14, 236);
  /* 設定按鈕文字顏色為藍色 */
  text-decoration: underline;
  /* 增加下劃線效果，讓它看起來像連結 */
  cursor: pointer;
  /* 當滑鼠移到按鈕時，顯示手型指標 */
}

.register-button:hover {
  color: darkblue;
  /* 當使用者滑過時改為深藍色，提供互動提示 */
}

.swal2-title {
  border-bottom: none !important;
}

.swal2-confirm {
  color: white !important;
  /* 讓文字變白 */
  background-color: #3085d6 !important;
  /* 保持預設藍色 */
  border-color: #3085d6 !important;
}
</style>