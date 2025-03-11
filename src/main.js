// 引入 Vue 核心函式 createApp
import { createApp } from 'vue';
// 引入應用程式的根組件
import App from './App.vue';

// 創建 Vue 應用實例
const app = createApp(App);

// 引入 Ant Design Vue 的組件 Button、Dropdown、Menu
import { Button, Dropdown, Menu } from 'ant-design-vue';
// 使用 Ant Design Vue 的組件
app.use(Button);
app.use(Dropdown);
app.use(Menu);


import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import '@mdi/font/css/materialdesignicons.css';
import 'element-plus/dist/index.css';

// 引入 Pinia 的插件，用於持久化狀態
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
// 創建 Pinia 狀態管理實例
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

// 創建 Vuetify 實例，設定主題顏色
const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#1976D2',
          secondary: '#424242',
          accent: '#82B1FF',
        },
      },
    },
  },
});
// 使用 Vuetify
app.use(vuetify);

// 引入 Vue Router
import router from './router';
app.use(router);

// 引入 Pinia
import { createPinia } from 'pinia';
// 使用 Pinia
app.use(pinia);


import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
app.use(ElementPlus);


import { library } from '@fortawesome/fontawesome-svg-core';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import '@fortawesome/fontawesome-free/css/all.min.css';

library.add(faChevronDown, faChevronUp);
app.component('font-awesome-icon', FontAwesomeIcon);


import 'vue-slick-carousel/dist/vue-slick-carousel.css';
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css';


app.use(vuetify);
app.use(router);
app.use(pinia);
app.use(ElementPlus);
app.component("font-awesome-icon", FontAwesomeIcon);

// 掛載 Vue 應用至 #app 元素
app.mount('#app');
