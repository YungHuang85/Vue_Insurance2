<template>
    <div class="full-page">
        <!-- 簽名與進度條框 -->
        <div class="application-wrapper">
            <!-- 步驟條 -->
            <div class="steps">
                <div class="step" :class="{ active: currentStep === 1 }">STEP1 填寫保險申請書</div>
                <div class="step" :class="{ active: currentStep === 2 }">STEP2 線上簽名</div>
                <div class="step" :class="{ active: currentStep === 3 }">STEP3 完成結果</div>
            </div>


            <!-- 簽名存檔顯示區 -->
            <div class="signature-wrapper">
                <p class="signature-label">資料上傳成功</p>
                <div class="signature-preview">
                    <img src="/images/success.png" alt="簽名圖片" class="signature-image" />
                </div>
            </div>
            <!-- 下一步按鈕 -->
            <div class="button-group">

                <button @click="goToClaimsShow" class="btn btn-next">回理賠首頁</button>




            </div>
        </div>
    </div>
</template>


<script setup>
import { ref, onMounted } from "vue";
import { useClaimsStore } from '../store/ClaimStore.js';
import { useRouter } from 'vue-router';
const router = useRouter();
const store = useClaimsStore();
const currentStep = ref(3); // 默認為第3步
const imageData = ref('');
const signatureCanvas = ref(null);
let ctx = null;
let drawing = false;

// 初始化簽名畫布
onMounted(() => {

});
function goToClaimsShow() {
    router.push('/ClaimsShow');
}


</script>

<style scoped>
/* 簽名區外框 */
.signature-wrapper {
    position: relative;
    margin-top: 20px;
    text-align: center;
}

/* 上傳成功文字 */
.signature-label {
    font-size: 18px;
    font-weight: bold;
    color: #333;
    margin-bottom: 8px;
    position: relative;
    /* 不與框限重疊 */
    margin-bottom: -30px;
    /* 向上移動與框限分隔 */
}

/* 簽名存檔顯示區 */
.signature-preview {
    margin-top: 40px;
    text-align: center;
    padding: 10px;
    /* 調整內邊距 */
    border-radius: 8px;
    background-color: #f8f8f8;
    border: 2px solid black;
    /* 黑色邊框讓它更明顯 */
    width: 300px;
    /* 設定區塊寬度 */
    height: 250px;
    /* 設定區塊高度 */
    display: inline-block;
    /* 讓區塊自適應內容居中 */
}

/* 簽名圖片 */
.signature-image {
    max-width: 100%;
    max-height: 100%;
    height: auto;
    border-radius: 5px;
    object-fit: contain;
    /* 確保圖片適應框大小 */
}

/* 簽名標籤 */
.signature-label {
    font-size: 18px;
    font-weight: bold;
    color: #333;
    margin-bottom: 8px;
}

.full-page {
    display: flex;
    justify-content: center;
    /* 左右置中 */
    align-items: flex-start;
    /* 垂直靠上 */
    background-color: transparent;
    /* 灰色背景 */
    min-height: 100vh;
    padding-top: 20px;
    /* 與頁面頂部保持距離 */
}

.application-wrapper {
    width: 100%;
    max-width: 800px;
    background-color: #ffffff;
    /* 整個框的白色背景 */
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    padding: 20px;
}

/* 步驟條 */
.steps {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
}

.step {
    flex: 1;
    text-align: center;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background: #e9ecef;
    margin-right: 5px;
}

.step.active {
    background: #4caf50;
    color: white;
    font-weight: bold;
}

/* 簽名區塊 */
.modal-content {
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 16px;
    background-color: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.modal-header {
    text-align: center;
    margin-bottom: 16px;
}

.modal-title {
    font-size: 20px;
    font-weight: bold;
    color: #333;
}

.modal-body {
    padding: 8px;
    height: 350px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.signature-area {
    flex: 1;
    border: 1px solid #ccc;
    border-radius: 4px;
    background: #f9f9f9;
    cursor: crosshair;
}

.button-group {
    display: flex;
    justify-content: space-between;
    padding: 10px 20px;
    height: 60px;
}

.btn {
    color: #ffffff;
    background: #28a39d;
    border-radius: 6px;
    border: none;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
}

.btn:hover {
    background: #239083;
}

/* 調整按鈕組 */
.button-group {
    display: flex;
    justify-content: flex-end;
    /* 讓按鈕靠右 */
    gap: 10px;
    /* 讓按鈕之間有間距 */
    padding: 10px 20px;
}

/* 紅色 "重寫" 按鈕 */
.btn-clear {
    background: #d9534f;
    /* 紅色 */
}

.btn-clear:hover {
    background: #c9302c;
    /* 深紅色 */
}

/* 綠色 "存檔" 按鈕 */
.btn-submit {
    background: #4caf50;
}

.btn-submit:hover {
    background: #45a049;
}

.form-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
}

.btn-next {
    background: #4caf50;
}

.btn-next:hover {
    background: #45a049;
}
</style>
