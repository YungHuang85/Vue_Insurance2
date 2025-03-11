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

            <!-- 簽名版 -->
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title text-center">請在下方簽名</h3>
                </div>
                <div class="modal-body">
                    <!-- 簽名區 -->
                    <canvas ref="signatureCanvas" class="signature-area"></canvas>

                    <!-- 按鈕區域 -->
                    <div class="button-group">
                        <button type="button" @click="clearSignature" class="btn btn-clear">重寫</button>
                        <button type="button" @click="submitSignature" class="btn btn-submit">存檔</button>
                    </div>
                </div>
            </div>

            <!-- 簽名存檔顯示區 -->
            <div v-if="store.ClaimData.signature" class="signature-preview">
                <p class="signature-label">此簽名已存檔</p>
                <img :src="store.ClaimData.signature" alt="簽名圖片" class="signature-image" />
            </div>

            <!-- 下一步按鈕 -->
            <div class="button-group">

                <button @click="goToPreviousStep" class="btn btn-next">上一步</button>

                <button @click="submitForm" class="btn btn-next">送出申請</button>


            </div>
        </div>
    </div>
</template>


<script setup>
import { ref, onMounted } from "vue";
import { useClaimsStore } from '../store/ClaimStore.js';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
const router = useRouter();
const store = useClaimsStore();
const currentStep = ref(2); // 默認為第3步
const imageData = ref('');
const signatureCanvas = ref(null);
let ctx = null;
let drawing = false;
const API_URL = `http://localhost:8081/InsertClaimsVueNEW`


const submitForm = async () => {
    const formData = new FormData();

    // 加入 Pinia 裡的數據
    for (const key in store.ClaimData) {
        if (store.ClaimData[key] !== undefined) {
            if (Array.isArray(store.ClaimData[key])) {
                formData.append(key, store.ClaimData[key].join(",")); // 陣列轉字串
            } else {
                formData.append(key, store.ClaimData[key]);
            }
        }
    }

    // 檢查 Pinia 是否存有 Base64 檔案，並轉換成 File
    if (store.fileData.idCopy.base64) {
        const idCopyFile = convertBase64ToFile(store.fileData.idCopy.base64, store.fileData.idCopy.name, "image/jpeg");
        formData.append("idCopy", idCopyFile);
    }

    if (store.fileData.accountCopy.base64) {
        const accountCopyFile = convertBase64ToFile(store.fileData.accountCopy.base64, store.fileData.accountCopy.name, "image/jpeg");
        formData.append("accountCopy", accountCopyFile);
    }

    if (store.fileData.proveFile.base64) {
        const proveFile = convertBase64ToFile(store.fileData.proveFile.base64, store.fileData.proveFile.name, "image/jpeg");
        formData.append("proveFile", proveFile);
    }
    console.log("=== FormData 內容 ===");
    for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
    }


    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            Swal.fire({
                title: "失敗",
                text: "提交失敗！",
                icon: "error",
                confirmButtonText: "確認",
            });
            console.log("有問題!! 狀態碼: " + response.status);
        } else {
            //const result = await response.json(); // 假設後端回傳 JSON，這個JSON轉成JS物件
            //console.log("成功: ", result);
            router.push('/UploadResultView');
            console.log(response);
        }
    } catch (error) {
        console.error("發生錯誤: ", error);

    }

};

const convertBase64ToFile = (base64, fileName, mimeType) => {
    let byteCharacters = atob(base64.split(',')[1]); // 去掉 DataURL 前綴
    let byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    let byteArray = new Uint8Array(byteNumbers);
    return new File([byteArray], fileName, { type: mimeType });
};
// 初始化簽名畫布
onMounted(() => {
    const canvas = signatureCanvas.value;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    ctx = canvas.getContext("2d");
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#000";

    // 添加事件監聽器
    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseleave", stopDrawing);
});
function goToPreviousStep() {
    router.push('/InsertClaimsNew');
}
// 開始繪圖
function startDrawing(event) {
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(event.offsetX, event.offsetY);
}

// 繪圖過程
function draw(event) {
    if (!drawing) return;
    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.stroke();
}

// 結束繪圖
function stopDrawing() {
    drawing = false;
}

// 清除畫布
function clearSignature() {
    const canvas = signatureCanvas.value;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}



// 提交簽名
function submitSignature() {
    const canvas = signatureCanvas.value;
    store.ClaimData.signature = canvas.toDataURL("image/png");
    console.log("簽名資料（Base64 PNG）:", store.ClaimData.signature);
    Swal.fire({
        title: "成功",
        text: "簽名提交成功！",
        icon: "success",
        confirmButtonText: "確認",
    });


}


</script>

<style scoped>
/* 簽名存檔顯示區 */
.signature-preview {
    margin-top: 20px;
    text-align: center;
    padding: 15px;
    border-radius: 8px;
    background-color: #f8f8f8;
    border: 2px solid black;
    /* 黑色邊框讓它更明顯 */
}

/* 簽名圖片 */
.signature-image {
    max-width: 100%;
    height: auto;
    border-radius: 5px;
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
