<template>
    <div class="container">
      <h2 class="text-center mb-4">修改密碼</h2>
      <el-form :model="form" :rules="rules" ref="passwordForm" label-width="120px">
        <!-- 舊密碼 -->
        <el-form-item label="舊密碼" prop="oldPassword">
          <el-input
            v-model="form.oldPassword"
            type="password"
            placeholder="請輸入舊密碼"
          ></el-input>
        </el-form-item>
  
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
          <el-button @click="closeModal">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </template>
  
  <script>
  import { ref } from "vue";
  import { ElMessage } from "element-plus";
  import axios from "axios";
  
  export default {
    name: "ChangePassword",
    setup() {
      const form = ref({
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
  
      const rules = ref({
        oldPassword: [
          { required: true, message: "請輸入舊密碼", trigger: "blur" },
        ],
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
  
      const passwordForm = ref(null);
  
      const submitPasswordChange = () => {
        passwordForm.value.validate(async (valid) => {
          if (valid) {
            try {
              const response = await axios.post("/changePassword", {
                oldPassword: form.value.oldPassword,
                newPassword: form.value.newPassword,
              });
              if (response.data.status === "success") {
                ElMessage.success("密碼修改成功！");
                form.value = {
                  oldPassword: "",
                  newPassword: "",
                  confirmNewPassword: "",
                };
              } else {
                ElMessage.error(response.data.message || "密碼修改失敗！");
              }
            } catch (error) {
              console.error("修改密碼失敗：", error);
              ElMessage.error("無法修改密碼，請稍後再試！");
            }
          }
        });
      };
  
      const closeModal = () => {
        form.value = {
          oldPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        };
        ElMessage.info("已取消密碼修改！");
      };

   
  
      return {
        form,
        rules,
        passwordForm,
        submitPasswordChange,
        closeModal,
      };
    },
  };
  </script>
  
  <style scoped>

.password-page {
  padding-top: 200px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-bottom: 100px; /* 添加底部 padding */
}

.container {
  flex: 1;
  max-width: 400px;
  margin: 200px auto 100px;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
  min-height: calc(100vh - 400px); /* 確保內容區域有最小高度 */
}
  </style>
  