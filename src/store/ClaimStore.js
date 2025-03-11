import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useClaimsStore = defineStore('ClaimsStore', () => {
    //state

    const ClaimData = ref({
        // 基本資料
        policyNumber: "",//保單號碼
        policyName: "",//保單名稱
        id_number: "", // 身分證字號
        clientName: "", // 姓名
        claimStatus: "待審核", //理賠進度 (文字)

        accountCopy: "", // 帳戶影本檔案 (PDF 檔案路徑
        proveFile: "", //證明文件

        address: "", // 地址
        phone: "", // 聯絡電話
        email: "", // 電子郵件

        // 申請內容

        accidentReason: "", // 事故原因

        claimCategories: [], // 理賠類別

        // 保險金給付方式
        beneficiaryName: "", // 受益人姓名
        beneficiaryID: "", // 受益人身分證字號
        bankCode: "", // 銀行代號
        accountCode: "", //銀行帳號
        signature: "" //簽名檔案 base64
    });

    // Default state
    const defaultClaimData = {
        // 基本資料
        policyNumber: "", // 保單號碼
        policyName: "", // 保單名稱
        id_number: "", // 身分證字號
        clientName: "", // 姓名
        claimStatus: "待審核", // 理賠進度 (文字)

        accountCopy: "", // 帳戶影本檔案 (PDF 檔案路徑)
        proveFile: "", // 證明文件
        address: "", // 地址
        phone: "", // 聯絡電話
        email: "", // 電子郵件
        // 申請內容

        accidentReason: "", // 事故原因

        claimCategories: [], // 理賠類別
        // 保險金給付方式
        beneficiaryName: "", // 受益人姓名
        beneficiaryID: "", // 受益人身分證字號
        bankCode: "", // 銀行代號
        accountCode: "", //銀行帳號
        signature: "" //簽名檔案 base64
    };

    // 存放檔案資訊
    const fileData = ref({
        idCopy: { name: "", base64: "" },
        accountCopy: { name: "", base64: "" },
        proveFile: { name: "", base64: "" }
    });

    const defaultFileData = ref({
        idCopy: { name: "", base64: "" },
        accountCopy: { name: "", base64: "" },
        proveFile: { name: "", base64: "" }
    });
    //gettter




    // action
    const reset = () => {

        ClaimData.value = { ...defaultClaimData };
        fileData.value = {
            idCopy: { name: "", base64: "" },
            accountCopy: { name: "", base64: "" },
            proveFile: { name: "", base64: "" }
        }
    };

    const setFileData = (fileType, fileName, base64) => {
        fileData.value[fileType] = { name: fileName, base64: base64 };
    };
    const clearFiles = () => {
        fileData.value.idCopy = { name: "", base64: "" };
        fileData.value.accountCopy = { name: "", base64: "" };
        fileData.value.proveFile = { name: "", base64: "" };
    };
    return {


        ClaimData,
        fileData,
        clearFiles,
        setFileData,
        reset

    };
}, {
    persist: true, // 啟用持久化
});