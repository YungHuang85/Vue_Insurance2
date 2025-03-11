<template>
  <title>加入e險無憂!讓你生活無憂</title>
  <div class="register-container">
    <h2>會員註冊</h2>

    <el-form :model="form" :rules="rules" ref="registerForm" label-width="120px">
      <!-- 帳號 -->
      <el-form-item label="帳號" prop="account">
        <el-input v-model="form.account" maxlength="16" placeholder="請輸入帳號，包含英文字母和數字"></el-input>
      </el-form-item>

      <!-- 密碼 -->
      <el-form-item label="密碼" prop="password">
        <el-input v-model="form.password" type="password" maxlength="16" placeholder="請輸入密碼，包含大小寫字母、數字及特殊符號"></el-input>
      </el-form-item>

      <!-- 確認密碼 -->
      <el-form-item label="確認密碼" prop="confirmPassword">
        <el-input v-model="form.confirmPassword" type="password" maxlength="16" placeholder="請再次輸入密碼"></el-input>
      </el-form-item>

      <!-- 姓名 -->
      <el-form-item label="姓名" prop="username">
        <el-input v-model="form.username" placeholder="請輸入姓名"></el-input>
      </el-form-item>

      <!-- 性別 -->
      <el-form-item label="性別" prop="gender">
        <el-radio-group v-model="form.gender">
          <el-radio label="男">男</el-radio>
          <el-radio label="女">女</el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- 生日 -->
      <el-form-item label="生日" prop="birthday">
        <el-date-picker v-model="form.birthday" type="date" placeholder="請選擇生日" format="YYYY-MM-DD"></el-date-picker>
      </el-form-item>

      <!-- 身分證字號 -->
      <el-form-item label="身分證字號" prop="idNumber">
        <el-input v-model="form.idNumber" maxlength="10" placeholder="請輸入身分證字號"></el-input>
      </el-form-item>

      <!-- 電話 -->
      <el-form-item label="手機號碼" prop="phone">
        <el-input v-model="form.phone" maxlength="10" placeholder="請輸入手機號碼，09 開頭"></el-input>
      </el-form-item>

      <!-- 電子郵件 -->
      <el-form-item label="電子郵件" prop="email">
        <el-input v-model="form.email" placeholder="請輸入有效的電子郵件地址"></el-input>
      </el-form-item>

      <!-- 地址 -->
      <el-form-item label="地址" prop="address">
        <el-input v-model="form.address" placeholder="請輸入詳細地址"></el-input>
      </el-form-item>

      <!-- 按鈕 -->
      <el-form-item>
        <el-button type="primary" @click="submitForm">確定註冊</el-button>
        <el-button @click="autoFill">一鍵帶入資料</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";
import axios from "axios";

export default {
  name: "RegisterForm",
  setup() {
    const form = ref({
      account: "",
      password: "",
      confirmPassword: "",
      username: "",
      gender: "",
      birthday: "",
      idNumber: "",
      phone: "",
      email: sessionStorage.getItem("registerEmail") || "",
      address: "",
    });

    const rules = ref({
      account: [
        { required: true, message: "請輸入帳號", trigger: "blur" },
        {
          pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/,
          message: "帳號必須為 8 至 16 位英文字母和數字的組合",
          trigger: "blur",
        },
      ],
      password: [
        { required: true, message: "請輸入密碼", trigger: "blur" },
        {
          pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%&])[A-Za-z\d!@#$%&]{8,16}$/,
          message: "密碼必須包含大小寫字母、數字及特殊符號",
          trigger: "blur",
        },
      ],
      idNumber: [
        { required: true, message: "請輸入身分證字號", trigger: "blur" },
        {
          pattern: /^[A-Z][12]\d{8}$/,
          message: "身分證字號格式不正確",
          trigger: "blur",
        },
        {
          validator: (rule, value, callback) => {
            if (!value) {
              callback();
            } else {
              const genderCode = value.charAt(1);
              if (
                (form.value.gender === "男" && genderCode !== "1") ||
                (form.value.gender === "女" && genderCode !== "2")
              ) {
                callback(new Error("身分證字號與性別不匹配"));
              } else {
                callback();
              }
            }
          },
          trigger: "blur",
        },
      ],
    });

    const registerForm = ref(null);
    const router = useRouter();

    watch(
      () => form.value.gender,
      () => {
        if (form.value.idNumber) {
          registerForm.value.validateField("idNumber");
        }
      }
    );

    const submitForm = async () => {
      registerForm.value.validate(async (valid) => {
        if (valid) {
          console.log("送出的資料: ", form.value);
          try {
            const response = await axios.post(
              "http://localhost:8081/register",
              form.value, {
              headers: {
                "Content-Type": "application/json",
              },
            });
            if (response.data.success) {
              sessionStorage.setItem("registerEmail", '');
              Swal.fire({
                title: "註冊成功",
                text: "將跳轉登入頁面",
                icon: "success",
                confirmButtonText: "確定",
              }).then(() => {
                // SweetAlert 點擊確定後跳轉至登入頁面
                router.push("/membersLogin");
              });
            } else {
              Swal.fire({
                title: "資料有誤",
                text: "請檢查所有欄位是否正確填寫",
                icon: "error",
                confirmButtonText: "好",
              });
            }
          } catch (error) {
            console.error("API 請求失敗:", error);
            Swal.fire({
              title: "無法註冊",
              text: "已經註冊過囉!請於登入頁選擇忘記密碼或聯絡我們",
              icon: "error",
              confirmButtonText: "好",
            });
          }
        } else {
          Swal.fire({
            title: "欄位",
            text: "請檢查所有欄位是否正確填寫",
            icon: "error",
            confirmButtonText: "好",
          });
        }
      });
    };

    const autoFill = () => {
      const sampleData = {
        account: "insuranceco2024",
        password: "ASD123asd@@",
        confirmPassword: "ASD123asd@@",
        username: "康永蔡",
        gender: "男",
        birthday: "1990-01-01",
        idNumber: "A123456789",
        phone: "0903535855",
        // email: "insuranceco2024@gmail.com",
        address: "臺北市信義區林口街111號1樓",
      };
      Object.assign(form.value, sampleData);
      registerForm.value.clearValidate();
      registerForm.value.validate();
      Swal.fire({
        title: "自動填入資料",
        text: "請確認資料是否正確",
        icon: "info",
        confirmButtonText: "確定",
      });
    };

    return {
      form,
      rules,
      registerForm,
      submitForm,
      autoFill,
    };
  },
};
</script>

<style scoped>
.register-container {
  max-width: 600px;
  margin: 50px auto;
  padding: 100px 20px;
  /* 增加上方 padding */
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
}

h2 {
  text-align: center;
  /* 讓文字置中 */
  font-size: 24px;
  /* 設定字體大小 */
  font-weight: bold;
  /* 設定字體加粗 */
  margin-bottom: 20px;
  /* 增加下方間距，讓標題不會太擠 */
}
</style>
