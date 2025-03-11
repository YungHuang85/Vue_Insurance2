# e-Insurance (e險無憂) 保險人壽網站 - 前端

# 專案簡介
這是一個使用 Vue.js 開發的 Web 應用程式，主要功能包括：

    - 會員中心(登入, 登出)
    - 商品介紹
    - 網路投保
    - 理賠服務
    - 討論區
    - 常見問題
    - 紅利兌換專區

# 技術棧
    Vue 3 – 現代化前端框架
    Vue Router – 路由管理
    Pinia – 狀態管理
    Vite – 應用程式開發與建置工具
    Axios – HTTP 請求處理
    Bootstrap / Vuetify / Ant Design Vue / Element Plus – UI 元件庫
    FontAwesome / Material Design Icons – 圖標庫
    SweetAlert2 – 彈出通知與提示框
    Swiper / Vue Slick Carousel – 輪播與滑動效果
    HTML2Canvas / jsPDF – 影像與 PDF 生成
    ESLint / Prettier – 代碼格式與品質檢查
    Vue3-reCAPTCHA2 – Google reCAPTCHA v2 服務
    Pinia Plugin Persisted State – Pinia 狀態持久化插件
    Vite Plugin Vue – Vue 3 的 Vite 插件


# 專案結構
    總結構: 
    MY-VUE-PROJECT
    │── .vscode/                  # VS Code 設定檔
    │── node_modules/             # npm 依賴
    │── public/                   # 靜態資源 
    │── src/                      # 主要程式碼
    │   ├── api/                  # API 呼叫相關
    │   ├── assets/               # 靜態資源
    │   ├── components/           # 可重用元件
    │   ├── layouts/              # 版面配置 
    │   ├── pages/                # 頁面級元件
    │   ├── router/               # Vue Router 設定
    │   ├── store/                # Pinia 狀態管理
    │   ├── views/                # 頁面元件 
    │   ├── App.vue               # 根元件
    │   ├── main.js               # 進入點，掛載 Vue 應用
    │── .env                      # 環境變數設定

    前端本人負責程式範圍:
    MY-VUE-PROJECT
    │── public/
    │── src/
    │   ├── pages/                # 頁面
    │   │   ├── beneficiary.vue
    │   │   ├── insuranceSearch.vue
    │   │   ├── maintenance.vue
    │   │   ├── payment.vue
    │   │   ├── productPage.vue
    │   │   ├── travelClient.vue
    │   ├── router/
    │   │   ├── index.js          # 路由設定
    │   ├── store/                # 狀態管理
    │   │   ├── travelInsuranceStore.js
    │   ├── views/
    │   │   ├── App.vue
    │   ├── main.js               # 主程式入口
    │── .env
    

# 環境需求
    - Vue 3
    - Node.js 版本：v22.12.0
    - npm


# 需安裝相依套件
你需要執行 npm install 來下載(專案運行所需)：

    @fortawesome/fontawesome-free
    @fortawesome/fontawesome-svg-core
    @fortawesome/free-solid-svg-icons
    @fortawesome/vue-fontawesome
    @mdi/font
    ant-design-vue
    axios
    bootstrap
    bootstrap-icons
    element-plus
    html2canvas
    jspdf
    pinia
    pinia-plugin-persistedstate
    sweetalert2
    swiper
    vue
    vue-router
    vue-slick-carousel
    vue3-recaptcha2
    vuetify


# 啟動伺服器

    npm run dev

--伺服器將會運行於 http://localhost:5173/