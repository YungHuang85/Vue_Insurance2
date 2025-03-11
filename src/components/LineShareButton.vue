<template>

      
  </template>
  
  <script>
  export default {
    name: "LineShareButton",
    props: {
      shareUrl: {
        type: String,
        required: true, // 需要傳遞分享的 URL
      },
    },
    mounted() {
      // 檢查是否已經載入過 script，避免重複載入
      if (!document.getElementById("line-share-button-script")) {
        const script = document.createElement("script");
        script.src = "https://www.line-website.com/social-plugins/js/thirdparty/loader.min.js";
        script.id = "line-share-button-script";
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
      } else {
        // 如果 script 已載入，手動初始化按鈕
        this.initializeLineButton();
      }
    },
    methods: {
      initializeLineButton() {
        // 初始化 LINE 按鈕
        if (window.LINE) {
          window.LINE.Liff.initialize({
            success: () => console.log("LINE 按鈕初始化成功"),
            fail: () => console.error("LINE 按鈕初始化失敗"),
          });
        }
      },
    },
  };
  </script>
  
  <style scoped>
  /* 根據需要添加樣式 */
  </style>
  