<template>
  <a
    :href="lineShareUrl"
    target="_blank"
    rel="noopener noreferrer"
    class="line-share-button"
    @click="handleClick"
  >
    分享到 LINE給好友
  </a>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";


export default {
  props: {
    shareUrl: {
      type: String,
      required: true,
    },
    shareText: {
      type: String,
      default: "",
    },
  },
  computed: {
    lineShareUrl() {
      const baseUrl = "https://social-plugins.line.me/lineit/share";
      const encodedUrl = encodeURIComponent(this.shareUrl);
      const encodedText = encodeURIComponent(this.shareText);
      return `${baseUrl}?url=${encodedUrl}&text=${encodedText}`;
    },
  },
  methods: {
    async handleClick() {

      console.log("開始執行分享點數新增邏輯");
      try {
     
console.log("rrrrrr");

     // 獲取用戶 email
     const email = sessionStorage.getItem("email");
     const username = sessionStorage.getItem("username");
     console.log(email);
     
     if (!email) {
      //  Swal.fire({
      //    title: "錯誤",
      //    text: "找不到用戶資訊，請重新登入",
      //    icon: "error",
      //    confirmButtonText: "好",
      //  });
       return;
     }

     // 調用 API
     const response = await axios.post(
       "http://localhost:8081/addpoints",
       { email: email,
        username: username, }
     );

     // 顯示成功或失敗訊息
     if (response.data.success) {
      console.log("點數新增成功！");
      setTimeout(() => {
          Swal.fire({
            title: "分享成功!",
            text: "您已獲得 100 點",
            icon: "success",
            confirmButtonText: "好",
            confirmButtonColor: 'rgb(80, 200, 90)'
          });
        }, 5000);
    } else {
      console.error("加點數失敗:", response.data.message);
    }
  } catch (error) {
    console.error("加點數失敗:", error);
  }

    },
  },
};
</script>

<style scoped>
.line-share-button {
  display: inline-block;
  background-color: #00b900; /* LINE 綠色 */
  color: white; /* 白色文字 */
  text-decoration: none;
  padding: 10px 20px; /* 按鈕的內邊距 */
  border-radius: 5px; /* 圓角 */
  font-size: 16px; /* 字體大小 */
  font-weight: bold; /* 加粗字體 */
  text-align: center;
  transition: background-color 0.3s ease; /* 動態效果 */
}

.line-share-button:hover {
  background-color: #008e00; /* 滑鼠懸停時更深的綠色 */
}
</style>
