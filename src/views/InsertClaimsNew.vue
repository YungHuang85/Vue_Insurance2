<template>
    <div class="full-page">
        <div class="application-form">
            <div class="steps">
                <div class="step" :class="{ active: currentStep === 1 }">STEP1 填寫保險申請書</div>
                <div class="step" :class="{ active: currentStep === 3 }">STEP2 線上簽名</div>
                <div class="step" :class="{ active: currentStep === 4 }">STEP3 完成結果</div>
            </div>

            <form id="form1">
                <section class="applicant-info">

                    <h2>基本資料</h2>

                    <div class="form-group">
                        <label>保單號碼:</label>
                        <input v-model="store.ClaimData.policyNumber" disabled type="text" />
                    </div>
                    <div class="form-group">
                        <label>身分證字號:</label>
                        <input v-model="store.ClaimData.id_number" type="text" disabled />
                    </div>
                    <div class="form-group">
                        <label>姓名</label>
                        <input v-model="store.ClaimData.clientName" type="text" disabled />
                    </div>

                    <div class="form-group">
                        <label>地址:</label>
                        <input v-model="store.ClaimData.address" class="long-input" />
                    </div>
                    <div class="form-group">
                        <label>聯絡電話:</label>
                        <input v-model="store.ClaimData.phone" type="tel" placeholder="請輸入聯絡電話" />
                    </div>
                    <div class="form-group">
                        <label>電子郵件:</label>
                        <input v-model="store.ClaimData.email" type="email" placeholder="請輸入電子郵件" />
                    </div>
                </section>

                <section class="application-details">
                    <h2>申請內容</h2>

                    <div class="form-group">
                        <label>事故原因:</label>
                        <input v-model="store.ClaimData.accidentReason" class="long-input" />
                    </div>
                    <div class="form-group">
                        <label>申請種類:</label>
                        <div>
                            <label>
                                <input type="radio" v-model="store.ClaimData.policyName" value="旅平險" />
                                旅平險
                            </label>
                            <label>
                                <input type="radio" v-model="store.ClaimData.policyName" value="登山險" />
                                登山險
                            </label>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>理賠類別:</label>
                        <div>
                            <label>
                                <input type="checkbox" value="班機延誤" v-model="store.ClaimData.claimCategories" />
                                班機延誤
                            </label>
                            <label>
                                <input type="checkbox" value="旅程更改" v-model="store.ClaimData.claimCategories" />
                                旅程更改
                            </label>
                            <label>
                                <input type="checkbox" value="行李延誤" v-model="store.ClaimData.claimCategories" />
                                行李延誤
                            </label>
                            <label>
                                <input type="checkbox" value="醫療實支" v-model="store.ClaimData.claimCategories" />
                                醫療實支
                            </label>
                            <label>
                                <input type="checkbox" value="死亡" v-model="store.ClaimData.claimCategories" />
                                死亡
                            </label>
                            <label>
                                <input type="checkbox" value="失能" v-model="store.ClaimData.claimCategories" />
                                失能
                            </label>
                        </div>
                    </div>

                </section>

                <section class="application-file">
                    <h2>檔案上傳</h2>

                    <!-- <div class="form-group">
                        <label>身分證檔案</label>
                        <input type="file" class="custom-file-input" name="idCopy" />
                    </div>
                    <div class="form-group">
                        <label>帳戶影本</label>
                        <input type="file" class="custom-file-input" name="accountCopy" />
                    </div>
                    <div class="form-group">
                        <label>證明文件</label>
                        <input type="file" class="custom-file-input" name="proveFile" />
                    </div> -->
                    <!-- <p v-if="store.fileData.idCopy.name">已選擇: {{ store.fileData.idCopy.name }}</p>
                    <p v-if="store.fileData.accountCopy.name">已選擇: {{ store.fileData.accountCopy.name }}</p>
                    <p v-if="store.fileData.proveFile.name">已選擇: {{ store.fileData.proveFile.name }}</p> -->

                    <div class="form-group">
                        <label>身分證檔案:</label>
                        <input type="file" @change="(e) => handleFileChange(e, 'idCopy')" />
                        <p v-if="store.fileData.idCopy">已選擇：{{ store.fileData.idCopy.name }}</p>
                    </div>
                    <div class="form-group">
                        <label>帳戶影本:</label>
                        <input type="file" @change="(e) => handleFileChange(e, 'accountCopy')" />
                        <p v-if="store.fileData.accountCopy">已選擇：{{ store.fileData.accountCopy.name }}</p>
                    </div>

                    <div class="form-group">
                        <label>證明文件:</label>
                        <input type="file" @change="(e) => handleFileChange(e, 'proveFile')" />
                        <p v-if="store.fileData.proveFile">已選擇：{{ store.fileData.proveFile.name }}</p>
                    </div>


                </section>

                <section class="payment-info">
                    <h2>保險金給付方式</h2>
                    <div class="gray-box">
                        <div class="form-group">
                            <label>受益人姓名</label>
                            <input v-model="store.ClaimData.beneficiaryName" type="text" />
                        </div>
                        <div class="form-group">
                            <label>受益人身分證字號</label>
                            <input v-model="store.ClaimData.beneficiaryID" type="text" />
                        </div>
                        <div class="form-group">
                            <label>銀行代號</label>
                            <input v-model="store.ClaimData.bankCode" type="text" />
                        </div>
                        <div class="form-group">
                            <label>行庫帳號</label>
                            <input v-model="store.ClaimData.accountCode" type="text" />
                        </div>
                    </div>
                </section>


                <div class="form-actions">
                    <button type="button" @click="goToNextStep">下一步</button>
                    <button type="button" @click="getData" class="btn">一鍵代入</button>



                </div>
            </form>
        </div>
    </div>

    <input type="hidden" path="applicationDate" id="applicationDate" name="applicationDate"
        v-model="formData.applicationDate" />
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import { useClaimsStore } from '../store/ClaimStore.js';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
const router = useRouter();
const store = useClaimsStore();
const BASE_URL = import.meta.env.VITE_APIURL;
const API_URL = `http://localhost:8081/InsertClaimsVueNEW` // "http://localhost:8088/InsertClaimsVueNEW"
console.log('API_URL ' + API_URL);
const currentStep = 1;

onMounted(() => {
    setApplicationDate();
    // 確保檔案名稱回填
    console.log("載入已儲存的檔案資料:", store.fileData);

});
function getData() {
    store.ClaimData.address = "桃園縣桃園市";
    store.ClaimData.phone = "0912346567";
    store.ClaimData.email = "kangtsai2025@gmail.com";
    store.ClaimData.accidentReason = "天災";
    store.ClaimData.accountCode = "1234 0000 4567";
    store.ClaimData.claimCategories = ["旅程更改", "班機延誤"];
    store.ClaimData.bankCode = "001";
}


function goToNextStep() {
    // 檢查是否有上傳檔案
    if (!store.fileData.idCopy.base64 || !store.fileData.accountCopy.base64 || !store.fileData.proveFile.base64) {

        Swal.fire({
            title: "失敗",
            text: "請上傳所有必填檔案（身分證、帳戶影本、證明文件）！",
            icon: "warning",
            confirmButtonText: "確認",
        });
        return; // 阻止進入下一步
    }
    router.push('/SignView');
}

// 用 ref 來存放檔案
const fileInputs = ref({
    idCopy: null,
    accountCopy: null,
    proveFile: null
})

// 處理檔案變更
// const handleFileChange = (event, fileType) => {
//     fileInputs.value[fileType] = event.target.files[0] // 存入對應的 key
// }

const handleFileChange = async (event, fileType) => {
    const file = event.target.files[0]; // 取得檔案

    if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file); // 讀取檔案並轉換為 Base64

        reader.onload = () => {
            store.setFileData(fileType, file.name, reader.result); // 存入 Pinia
        };
    }
};


function setApplicationDate() {
    let now = new Date();
    let year = now.getFullYear();
    let month = ('0' + (now.getMonth() + 1)).slice(-2); // 月份從0開始，所以要加1
    let day = ('0' + now.getDate()).slice(-2);
    let date = year + '-' + month + '-' + day;
    let hiddenInput = document.getElementById('applicationDate');
    hiddenInput.value = date;
    console.log(document.getElementById('applicationDate').value);

    store.ClaimData.applicationDate = date;
}




const formData = ref({
    // 基本資料
    policyNumber: "",//保單號碼
    policyName: "",//保單名稱
    id_number: "", // 身分證字號
    clientName: "", // 姓名
    claimStatus: "待審核", //理賠進度 (文字)
    idCopy: "", //身分證檔案 (PDF 檔案路徑)
    accountCopy: "", // 帳戶影本檔案 (PDF 檔案路徑


    address: "", // 地址
    phone: "", // 聯絡電話
    email: "", // 電子郵件

    // 申請內容
    applicationDate: "", // 申請日期
    accidentReason: "", // 事故原因
    applicationType: "", // 申請種類 (旅平險/登山險)，這個應該沒有財對，用保單名稱即可
    claimCategories: [], // 理賠類別

    // 保險金給付方式
    beneficiaryName: "", // 受益人姓名
    beneficiaryID: "", // 受益人身分證字號
    bankCode: "", // 銀行代號
    AccountCode: "", // 行庫帳號
    signature: "" //簽名檔案 base64
});



</script>

<style scoped>
h2 {
    font-size: 18px;
    color: #4caf50;
    margin-top: 20px;
    border-left: 5px solid #4caf50;
    padding-left: 10px;
}

.form-actions button:first-child {
    margin-right: 20px;
    /* 10px 的間距 */
}

.long-input {
    max-width: 400px;
    /* 設置最大寬度 */
    width: 100%;
    /* 適應父容器 */
    min-width: 300px;
    /* 設置最小寬度 */
}

.gray-box {
    border: 1px solid #ccc;
    /* 灰色邊框 */
    padding: 20px;
    /* 內部間距 */
    border-radius: 8px;
    /* 圓角邊框 */
    background-color: #f8f9fa;
    /* 淺灰色背景 */
    margin-bottom: 20px;
    /* 與下方內容的間距 */
}

.payment-info .form-group {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
}

.payment-info label {
    flex: 0 0 120px;
    /* 標籤的固定寬度 */
    font-weight: bold;
    text-align: right;
    margin-right: 10px;
}

.payment-info input {
    flex: 1;
    max-width: 300px;
    /* 輸入框最大寬度 */
    min-width: 200px;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
}


/* 確保背景覆蓋整個頁面 */
.full-page {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: transparent;
    /* 讓背景變透明 */
}

/* 表單樣式 */
.application-form {
    max-width: 800px;
    width: 100%;
    background-color: #ffffff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    font-family: Arial, sans-serif;
    color: #333;
}

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

form {
    background: #fff;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
}

.form-group {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 15px;
}

label {
    flex: 0 0 100px;
    font-weight: bold;
    text-align: right;
}

input,
select,
textarea {
    flex: 1;
    max-width: 200px;
    min-width: 100px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
}

textarea {
    resize: none;
}

button {
    background: #4caf50;
    color: white;
    border: none;
    padding: 10px 20px;
    cursor: pointer;
    border-radius: 4px;
    font-size: 16px;
}

button:hover {
    background: #45a049;
}

h2 {
    font-size: 18px;
    border-bottom: 2px solid #4caf50;
    padding-bottom: 5px;
    margin-bottom: 15px;
    color: #4caf50;
    font-weight: bold;
    /* 可選，讓標題加粗 */
}
</style>