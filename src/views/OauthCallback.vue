<template>
    <div>
      <p>正在處理 Google 認證...</p>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    async mounted() {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");
  
      if (!code) {
        console.error("Google 認證失敗：缺少 code");
        return;
      }
  
      try {
        // 將 code 傳遞給後端 API
        const response = await axios.post("http://localhost:8081/api/auth/google", { code });
  
        // 處理認證結果（例如儲存 Token）
        console.log(response);
        
        sessionStorage.setItem("registerEmail", response.data.email);

        console.log(sessionStorage.getItem("registerEmail"));
        // 跳轉至其他頁面
        this.$router.push({ name: "MembersRegister" });
      } catch (error) {
        console.error("後端認證失敗：", error);
      }
    },
  };
  </script>
  