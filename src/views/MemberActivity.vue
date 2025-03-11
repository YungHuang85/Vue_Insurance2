<template>
  <transition name="fade">
    <div class="modal-overlay" @click.self="closeModal">
      <div class="modal-container">
        <!-- 返回會員中心按鈕 -->
        <el-button type="text" class="back-button" @click="goToMemberProfile">
          <i class="el-icon-arrow-left"></i>
          <span>返回會員中心</span>
        </el-button>



        <!-- 內容 -->
        <h2>註冊成功活動</h2>
        <p>恭喜您成為我們的會員！分享此活動給 LINE 好友，即可獲得 100 點。</p>
        <img src="@/assets/logo.png" alt="活動圖片" class="event-image" />

        <!-- 分享按鈕 -->
        <LineShareButton shareUrl="http://localhost:5173/membersRegister" />
        <LineShareButtonCustom type="primary" shareUrl="http://localhost:5173/membersRegister"
          shareText="我加入了e險無憂，一起拿點數喝咖啡！" @click.native="shareToLine" />
      </div>
    </div>
  </transition>
</template>



<script>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import LineShareButton from "@/components/LineShareButton.vue";
import LineShareButtonCustom from "@/components/LineShareButtonCustom.vue";

export default {
  name: "RegisterEventModal",
  setup(props, { emit }) {
    const router = useRouter();

    // 返回會員中心
    const goToMemberProfile = () => {
      router.push("/membersprofile");
    };

    // 關閉 modal
    const closeModal = () => {
      emit("close"); // 通知父組件關閉 modal
    };

    // 鎖定背景滾動
    onMounted(() => {
      document.body.style.overflow = "hidden";
    });

    // 恢復背景滾動
    onUnmounted(() => {
      document.body.style.overflow = "auto";
    });

    return { closeModal, goToMemberProfile };
  },
  components: {
    LineShareButton,
    LineShareButtonCustom,
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  /* 半透明背景 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* `modal` 容器 */
.modal-container {
  background: white;
  width: 90%;
  max-width: 600px;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-align: center;
  position: relative;
  overflow-y: auto;
  max-height: 80vh;
  /* 讓 modal 內部可滾動 */
}

/* 關閉按鈕 */
.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  border: none;
  background: transparent;
  font-size: 24px;
  cursor: pointer;
}

/* 返回會員中心按鈕 */
.back-button {
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 14px;
  display: flex;
  align-items: center;
  color: #606060;
}

.back-button i {
  margin-right: 5px;
  font-size: 16px;
  color: #a0a0a0;
}

.back-button:hover {
  text-decoration: underline;
  color: #303030;
}

/* 活動圖片 */
.event-image {
  width: 100%;
  margin-bottom: 20px;
}

/* `modal` 進場 & 出場動畫 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
