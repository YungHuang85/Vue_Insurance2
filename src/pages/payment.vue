<template>
    <div class="page-container">
        <!-- 固定在視窗正中間的圖片 -->
        <div class="bg-image">
            <img src="../../public/bay2.jpg" alt="背景圖" />
        </div>

        <div class="container">
            <div>
                <div class="credit-card-page">
                    <h1>線上繳費</h1>

                    <div class="pricing-container">
                        <div class="card">
                            <svg xmlns="http://www.w3.org/2000/svg" width="55" height="58" fill="currentColor"
                                class="bi bi-coin" viewBox="-4 1 24 6">
                                <path
                                    d="M5.5 9.511c.076.954.83 1.697 2.182 1.785V12h.6v-.709c1.4-.098 2.218-.846 2.218-1.932 0-.987-.626-1.496-1.745-1.76l-.473-.112V5.57c.6.068.982.396 1.074.85h1.052c-.076-.919-.864-1.638-2.126-1.716V4h-.6v.719c-1.195.117-2.01.836-2.01 1.853 0 .9.606 1.472 1.613 1.707l.397.098v2.034c-.615-.093-1.022-.43-1.114-.9zm2.177-2.166c-.59-.137-.91-.416-.91-.836 0-.47.345-.822.915-.925v1.76h-.005zm.692 1.193c.717.166 1.048.435 1.048.91 0 .542-.412.914-1.135.982V8.518z" />
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                <path
                                    d="M8 13.5a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11m0 .5A6 6 0 1 0 8 2a6 6 0 0 0 0 12" />
                            </svg>
                            <h2>保費金額<br>
                                {{ storeClient.totalCost.toLocaleString() }} NTD</h2>
                        </div>
                        <div class="card">
                            <svg xmlns="http://www.w3.org/2000/svg" width="55" height="58" fill="currentColor"
                                class="bi bi-gift" viewBox="-4 0 24 6">
                                <path
                                    d="M3 2.5a2.5 2.5 0 0 1 5 0 2.5 2.5 0 0 1 5 0v.006c0 .07 0 .27-.038.494H15a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 14.5V7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h2.038A3 3 0 0 1 3 2.506zm1.068.5H7v-.5a1.5 1.5 0 1 0-3 0c0 .085.002.274.045.43zM9 3h2.932l.023-.07c.043-.156.045-.345.045-.43a1.5 1.5 0 0 0-3 0zM1 4v2h6V4zm8 0v2h6V4zm5 3H9v8h4.5a.5.5 0 0 0 .5-.5zm-7 8V7H2v7.5a.5.5 0 0 0 .5.5z" />
                            </svg>
                            <h2>紅利回饋<br>
                                {{ storeClient.bonusPoints }} 點</h2>
                        </div>
                    </div>

                    <!-- Payment status -->
                    <div class="payment-status">
                        <p v-if="!isPaid" class="status-unpaid">
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="22" fill="currentColor"
                                class="bi bi-x-square" viewBox="1 0 16 16">
                                <path
                                    d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                                <path
                                    d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                            </svg>
                            尚未繳費
                        </p>
                        <p v-else class="status-paid">
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="22" fill="currentColor"
                                class="bi bi-check-square" viewBox="1 0 16 16">
                                <path
                                    d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                                <path
                                    d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z" />
                            </svg>
                            繳費成功
                        </p>
                    </div>

                    <!-- Email input field -->
                    <div class="email-input" v-if="isPaid">
                        <label for="email">發送郵件：</label>
                        <input type="email" v-model="userEmail" id="email" placeholder="請輸入您的電子郵件" />
                        <button type="button" @click="sendPolicyEmail">
                            重發郵件
                        </button>
                    </div>

                    <!-- PayPal 按鈕容器 -->
                    <div id="paypal-button-container"></div>

                    <div class="button-group">
                        <!-- <button type="button" @click="submitClientAndBeneData">
                            一鍵插入
                        </button> -->
                        <button type="button" @click="goBack">
                            返回首頁
                        </button>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
/** 假設在 @/store/travelInsuranceStore.js */
import { useTravelInsuranceStore } from "@/store/travelInsuranceStore";
import { storeToRefs } from "pinia";
import { onMounted, ref, defineComponent } from "vue";
import { useRouter } from "vue-router";
import Swal from 'sweetalert2';

export default defineComponent({
    setup() {
        const travelInsuranceStore = useTravelInsuranceStore();
        const { client, form } = storeToRefs(travelInsuranceStore);
        const { form: storeForm, client: storeClient } = storeToRefs(travelInsuranceStore);
        const router = useRouter();

        // 用於顯示 頁面中的變數預設值
        const userEmail = ref(client.value.email); // 預設值
        const isPaid = ref(false);
        const bonusPoints = ref(0); // 紅利

        // PayPal 加載完後要渲染按鈕
        const loadPaypalSdk = () => {
            const script = document.createElement("script");
            script.src = `https://www.paypal.com/sdk/js?client-id=test&currency=TWD&locale=en_US&vault=false`;
            script.onload = renderPaypalButtons;
            document.body.appendChild(script);
        };

        // 初始化 PayPal 按鈕
        const renderPaypalButtons = () => {
            // 注意：此處需確保全局有 paypal 物件（SDK 載入後）
            paypal
                .Buttons({
                    style: {
                        layout: "vertical",
                        color: "gold",
                        shape: "rect",
                        label: "paypal",
                        height: 55,
                    },
                    createOrder: (data, actions) => {
                        return actions.order.create({
                            purchase_units: [
                                {
                                    amount: {
                                        value: client.value.totalCost.toFixed(2),
                                    },
                                },
                            ],
                            application_context: {
                                user_action: "PAY_NOW",
                                shipping_preference: "NO_SHIPPING",
                            },
                        });
                    },
                    onApprove: (data, actions) => {
                        return actions.order.capture().then((details) => {
                            travelInsuranceStore.setBonusPoints();
                            isPaid.value = true; // 確認已付款
                            sendPolicyEmail(); // 自動寄送收據
                            submitClientAndBeneData(); // 提交相關數據

                            // 隱藏 PayPal 按鈕
                            const paypalContainer = document.getElementById("paypal-button-container");
                            if (paypalContainer) {
                                paypalContainer.style.display = "none";
                            }
                        });
                    },
                    onError: (err) => {
                        console.error("付款出錯：", err);
                        alert("付款過程中發生錯誤，請稍後再試！");
                    },
                })
                .render("#paypal-button-container");
        };

        // 回首頁
        const goBack = () => {
            router.push("/productPage");
        };

        // 根據保費計算紅利
        const calculateBonusPoints = () => {
            travelInsuranceStore.setBonusPoints(); // 透過 Pinia 設定紅利點數
        };

        // 發送保單 Email
        const sendPolicyEmail = async () => {
            if (!userEmail.value) {
                Swal.fire({
                    icon: 'warning',
                    title: '缺少電子郵件地址',
                    text: '請先輸入有效的電子郵件地址！',
                    confirmButtonColor: 'rgb(80, 200, 90)',
                });
                return;
            }

            const policyData = `保單號碼：${storeForm.value.insuranceNumber}`;

            const clientData = `
                姓名：${storeClient.value.username}
                身分證號：${storeClient.value.id_number}
                出生日期：${storeClient.value.birthday}
                性別：${storeClient.value.gender}
                電話：${storeClient.value.phone}
                電子郵件：${storeClient.value.email}
                地址：${storeClient.value.address}
                保障地區：${storeClient.value.location}
                保單期間：${storeClient.value.startTime} 至 ${storeClient.value.endTime}
                總保費：${storeClient.value.totalCost.toLocaleString()} NTD
                `;

            const beneficiaryData = `
                姓名：${storeForm.value.beneficiaryName}
                與投保人關係：${storeForm.value.relation}
                身分證字號：${storeForm.value.beneficiaryID}
                出生日期：${storeForm.value.beneficiaryBirthday}
                性別：${storeForm.value.beneficiaryGender}
                電話：${storeForm.value.beneficiaryPhone}
                地址：${storeForm.value.beneficiaryAddress}
                `;

            const payload = {
                to: userEmail.value,
                subject: "e險無憂 -電子保單通知",
                body: `${policyData}\n\n${clientData}\n\n${beneficiaryData}`
            };

            try {
                const response = await fetch("http://localhost:8081/api/emails/send-pdf", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });

                if (response.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: '郵件已發送',
                        text: `保單已發送至 ${userEmail.value}！`,
                        confirmButtonColor: 'rgb(80, 200, 90)',
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: '郵件發送失敗',
                        text: '請稍後再試！',
                        confirmButtonColor: 'rgb(80, 200, 90)',
                    });
                }
            } catch (error) {
                console.error("郵件發送錯誤：", error);
                Swal.fire({
                    icon: 'error',
                    title: '發送錯誤',
                    text: '無法發送郵件，請稍後再試！',
                    confirmButtonColor: 'rgb(80, 200, 90)',
                });
            }
        };




        // 一鍵插入 (或付款成功後插入) - 將 Pinia 中的投保人、受益人資料寫進後端
        const submitClientAndBeneData = async () => {
            try {
                // 從 sessionStorage 中取得 account
                const account = sessionStorage.getItem("account") || "訪客";

                // 1) 整理投保人資料
                const clientDataArray = [
                    {
                        account: account,
                        insuranceNumber: form.value.insuranceNumber,
                        profilePicture: form.value.profilePicture, // 若需要圖片 Base64
                        bonusPoints: client.value.bonusPoints,
                        username: client.value.username,
                        id_number: client.value.id_number,
                        birthday: client.value.birthday,
                        gender: client.value.gender,
                        phone: client.value.phone,
                        email: client.value.email,
                        address: client.value.address,
                        product: client.value.product,
                        location: client.value.location,
                        startTime: client.value.startTime,
                        endTime: client.value.endTime,
                        sumAssured: client.value.sumAssured,
                        premiums: client.value.premiums,
                        medicalTreatment: client.value.medicalTreatment,
                        overseasIllness: client.value.overseasIllness,
                        overseasFlights: client.value.overseasFlights,
                        totalCost: client.value.totalCost,
                    },
                ];

                // 2) 整理受益人資料
                const beneDataArray = [
                    {
                        insuranceNumber: form.value.insuranceNumber,
                        relationship: form.value.relation,
                        beneficiaryName: form.value.beneficiaryName,
                        beneficiaryID: form.value.beneficiaryID,
                        beneficiaryBirthday: form.value.beneficiaryBirthday,
                        beneficiaryGender: form.value.beneficiaryGender,
                        beneficiaryPhone: form.value.beneficiaryPhone,
                        beneficiaryAddress: form.value.beneficiaryAddress,
                    },
                ];

                // 3) 發送至後端
                const response = await fetch("http://localhost:8081/clients/insert1", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        clientList: clientDataArray,
                        beneList: beneDataArray,
                    }),
                });

                if (!response.ok) {
                    throw new Error("提交資料時出現問題");
                }

                // 使用 SweetAlert2 提示成功訊息
                Swal.fire({
                    icon: 'success',
                    title: '成功',
                    text: '資料提交成功！',
                    confirmButtonColor: 'rgb(80, 200, 90)',

                });
            } catch (error) {
                console.error("提交資料錯誤:", error);

                // 使用 SweetAlert2 提示錯誤訊息
                Swal.fire({
                    icon: 'error',
                    title: '錯誤',
                    text: '無法提交資料，請稍後再試！',
                    confirmButtonColor: 'rgb(80, 200, 90)',

                });
            }
        };

        onMounted(() => {
            // 進入頁面時，若保費有值則計算紅利
            if (client.value.totalCost) {
                calculateBonusPoints();
            }
            // 載入 PayPal SDK
            loadPaypalSdk();
        });

        return {
            // 取自 Pinia
            storeClient: client,
            storeForm: form,
            storeForm,
            storeClient,
            userEmail,
            isPaid,
            bonusPoints,
            goBack,
            loadPaypalSdk,
            renderPaypalButtons,
            calculateBonusPoints,
            sendPolicyEmail,
            submitClientAndBeneData,
        };
    },
});
</script>

<style scoped>
.container {
    max-width: 620px;
    margin: 0 auto;
    /* 置中 */
    display: flex;
    flex-direction: column;
    justify-content: center;
    /* 垂直置中 */
    align-items: center;
    /* 水平置中 */
    transform: scale(1.2);
    /* 放大效果 */
    transform-origin: top;
    /* 放大的基準點 */
    height: 85vh;
    /* 滿屏高度，確保可以垂直置中 */
    box-sizing: border-box;
    /* 確保 padding 計入總寬高 */
}

.pricing-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 15px;
    padding: 10px;
}

.card {
    background-color: #1e1e2f;
    color: #fff;
    border-radius: 5px;
    padding: 10px 2px;
    text-align: center;
    width: 280px;
    font-size: 15px;
    justify-content: center;
    align-items: center;
}

.credit-card-page {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 40vh;
    margin: 0;
    padding: 20px;
    background-color: #F5F5F5;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    text-align: center;
    border: 2px solid #aaaaaa;
}

h1,
h2 {
    margin: 10px 0;
    font-weight: bold;
}

.payment-status {
    margin: 20px 0;
    font-size: 45px;
    font-weight: bold;
}

.status-unpaid {
    color: red;
}

.status-paid {
    color: green;
}

#paypal-button-container {
    width: 500px;
    max-width: 100%;
    margin-top: 20px;
}

.button-group {
    margin-top: 20px;
    display: flex;
    gap: 10px;
}

button {
    padding: 10px 20px;
    font-size: 16px;
    border: none;
    border-radius: 5px;
    background-color: #33393f;
    color: white;
    cursor: pointer;
}

button:hover {
    background-color: #5a6268;
}

.aligned-text {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
}

.aligned-text h2 {
    display: inline-block;
    text-align: left;
    width: 300px;
    /* 確保文字寬度一致 */
    margin: 5px 0;
}

.email-input {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: Arial, sans-serif;
}


.email-input input[type="email"] {
    padding: 8px 12px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 250px;
    box-sizing: border-box;
}

.email-input input[type="email"]:focus {
    border-color: #d41919;
    outline: none;
}

.email-input button {
    padding: 8px 16px;
    font-size: 14px;
    color: #fff;
    background-color: #33393f;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.email-input button:hover {
    background-color: #5a6268;
}

html,
body {
    margin: 0;
    padding: 0;
}

.page-container {
    position: relative;
    min-height: 150vh;
    /* 讓頁面足夠長可測試捲動，你可依需求調整 */
    margin: 0;
    padding: 0;
}

/* 2) 放置圖片的容器：固定在視窗中央 */
.bg-image {
    position: fixed;
    /* 隨捲動保持不動 */
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    /* 使圖片以中心點對準視窗正中 */
    z-index: 0;
    /* 設定在最底層，表單會疊在上面 */
}

/* 3) 實際圖片，透過 width/height 控制比例(你可自行決定) */
.bg-image img {
    width: 2700px;
    /* 例如：800px 寬 */
    height: auto;
    /* 高度自動，保持比例 */
    opacity: 0.6;
    /* 半透明，可視需求微調 */
    pointer-events: none;
    /* 滑鼠事件穿透，避免擋住表單 */
}
</style>