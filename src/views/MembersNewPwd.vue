<template>
    <div class="container">
      <h2 class="text-center mb-4">重設密碼</h2>
      <el-form :model="form" :rules="rules" ref="newPwdForm" label-width="120px">

        <!-- 新密碼 -->
        <el-form-item label="新密碼" prop="newPassword">
          <el-input
            v-model="form.newPassword"
            type="password"
            placeholder="請輸入新密碼"
          ></el-input>
        </el-form-item>
  
        <!-- 確認新密碼 -->
        <el-form-item label="確認新密碼" prop="confirmNewPassword">
          <el-input
            v-model="form.confirmNewPassword"
            type="password"
            placeholder="請再次輸入新密碼"
          ></el-input>
        </el-form-item>
  
        <el-form-item>
          <el-button type="primary" @click="submitPasswordChange">確認修改</el-button>
          <el-button @click="closeModal">清除</el-button>
        </el-form-item>
        <el-form-item class="center-button">
  <el-button @click="autoFill">一鍵帶入修改之密碼</el-button>
</el-form-item>
      </el-form>
    </div>
  </template>
  
  <script>
  import { ref } from "vue";
  import { ElMessage } from "element-plus";
  import axios from "axios";
  import Swal from "sweetalert2";
  import { useRouter } from "vue-router";
  
  export default {
    name: "ChangePassword",
    setup() {
      const form = ref({
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
  
      const rules = ref({
       
        newPassword: [
          { required: true, message: "請輸入新密碼", trigger: "blur" },
          {
            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%&])[A-Za-z\d!@#$%&]{8,16}$/,
            message: "密碼必須包含大寫、小寫、數字和特殊符號，長度為8-16位",
            trigger: "blur",
          },
        ],
        confirmNewPassword: [
          { required: true, message: "請再次輸入新密碼", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              if (value !== form.value.newPassword) {
                callback(new Error("兩次輸入的密碼不一致"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
      });
  
      const newPwdForm = ref(null);
      const router = useRouter();
      const submitPasswordChange = () => {
  newPwdForm.value.validate(async (valid) => {
    if (valid) {
      try {
        const response = await axios.post("http://localhost:8081/MemberResetPassword", {
          idNumber: sessionStorage.getItem("idNumber"),
          newPassword: form.value.newPassword,
          confirmNewPassword: form.value.confirmNewPassword,
        });

        // 如果成功（HTTP 200）
        Swal.fire({
          title: "密碼修改成功！",
          text: "您的密碼已修改，將跳轉至登入頁面。",
          icon: "success",
          confirmButtonText: "確定",
        }).then(() => {
          router.push("/membersLogin"); // 跳轉到登入畫面
        });
      } catch (error) {
        // 如果出錯，根據 HTTP 狀態碼顯示不同的錯誤訊息
        if (error.response?.status === 400) {
          Swal.fire({
            title: "錯誤",
            text: "新密碼與確認密碼不一致，請重新輸入。",
            icon: "error",
            confirmButtonText: "好",
          });
        } else if (error.response?.status === 404) {
          Swal.fire({
            title: "錯誤",
            text: "會員不存在，請確認您的身份資訊。",
            icon: "error",
            confirmButtonText: "好",
          });
        } else {
          Swal.fire({
            title: "系統錯誤",
            text: "伺服器發生問題，請稍後再試。",
            icon: "error",
            confirmButtonText: "好",
          });
        }
      }
    }
  });
};
  
      const closeModal = () => {
        form.value = {
        
          newPassword: "",
          confirmNewPassword: "",
        };
       
      };

      const autoFill = () => {
      const sampleData = {
        newPassword: "1qaz@WSX@@",
        confirmNewPassword: "1qaz@WSX@@",
      };
      form.value.newPassword = sampleData.newPassword;
      form.value.confirmNewPassword = sampleData.confirmNewPassword;
    };
  
      return {
        form,
        rules,
        newPwdForm,
        submitPasswordChange,
        closeModal,
        autoFill,
      };
    },
  };
  </script>
 <style scoped>
.container {
  max-width: 420px;
  margin: auto;
  padding: 25px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15); /* 增加立體感 */
  transition: all 0.3s ease-in-out;
}
.container:hover {
  transform: scale(1.02);
}
h2 {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #4CAF50; /* 添加綠色底線 */
}
 
 /* 控制輸入框長度，保持與標籤同一列 */
/* 讓密碼輸入框的字體變大 */
.el-input {
  font-size: 18px;
  font-weight: bold; /* 設為粗體 */
  padding: 12px;
  border-radius: 6px;
  transition: all 0.3s ease-in-out;
  flex-grow: 1; /* 讓輸入框可以自適應填滿 */
}

/* 讓 placeholder 也變大 */
.el-input::placeholder {
  font-size: 20px;
  color: #bbb;
}

/* 讓輸入框有更明顯的 hover 與 focus 效果 */
.el-input:focus,
.el-input:hover {
  border-color: #4CAF50;
  box-shadow: 0 0 8px rgba(76, 175, 80, 0.3);
}

.el-form-item {
  display: flex;
  align-items: center; /* 讓標籤與輸入框垂直置中 */
  justify-content: flex-start;

}

/* 密碼標籤字體加大 */
.el-form-item label {
  font-size: 20px; /* 放大字體 */
  font-weight: bold; /* 設為粗體 */
  width: 120px; /* 調整標籤寬度，確保對齊 */
  text-align: right; /* 讓標籤靠右對齊 */
}

 
 /* 讓「確認修改」與「清除」按鈕保持在同一行 */
 .button-group {
   display: flex;
   justify-content: center;
   gap: 10px; /* 按鈕之間的間距 */
 }
 
 /* 讓「一鍵帶入」按鈕獨立一行並置中 */
 .center-button {
  display: flex;
  justify-content: center;
  margin-top: 10px; /* 與上方按鈕群組保持距離 */
}
 </style>
 
  