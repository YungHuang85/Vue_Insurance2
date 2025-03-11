import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    isLoggedIn: false, // 初始值為 false
    username: '訪客',
  }),
  actions: {
    login(user) {
      this.isLoggedIn = true;
      this.username = user;
      sessionStorage.setItem('username', user);
    },
    logout() {
      this.isLoggedIn = false;
      this.username = '訪客';
      sessionStorage.clear();
    },
    checkLogin() {
      const storedUsername = sessionStorage.getItem('username');
      if (storedUsername) {
        this.isLoggedIn = true;
        this.username = storedUsername;
      } else {
        this.isLoggedIn = false;
      }
    },
  },
});
