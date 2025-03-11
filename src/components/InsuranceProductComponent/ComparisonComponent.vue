<script setup>
import { onMounted } from "vue";
import { useInsuranceStore } from "@/store/insuranceStore"; // 引入 pinia store
import { storeToRefs } from "pinia"; // 引入 storeToRefs
import Swal from "sweetalert2";
//pdf用
import { ref, reactive } from "vue";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";


const BASE_URL = import.meta.env.VITE_APIURL
const API_URL = `${BASE_URL}/productlist/SendPDF`
//pinia
const store = useInsuranceStore(); // 使用 pinia store
const { policies } = storeToRefs(store); // 取得 policies 陣列


// 在組件掛載時載入數據
onMounted(() => {
    // 不需要手動載入資料，因為 Pinia 自動處理了 persist
    // policies 已經會在 store 裡面同步更新
});

//pdf
// 初始化數據

const initData = reactive({
    formData: {
        email: "", // 存儲輸入的 email
        pdf: null  // 預先定義 pdf，避免 undefined
    },
    event: {
        generatePdf: async () => {
            const element = document.getElementById("view");
            if (!element) return;

            const canvas = await html2canvas(element, {
                useCORS: true,
                backgroundColor: "#fff",
                scale: 1, // 解析度較高但不過大，避免模糊 新增
            });

            const imgData = canvas.toDataURL("image/png");

            // **初始化 PDF**
            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "px",
                format: "a4",
            });



            pdf.addImage(imgData, "PNG", 0, 0, canvas.width * 0.4, canvas.height * 0.4); //新增
            pdf.save("試算方案比較.pdf");

            initData.formData.pdf = pdf; // **暫存 PDF**
        },

        sendPdf: async () => {
            if (!initData.formData.email) {
                    Swal.fire({
                    icon: "warning",
                    title: "請輸入 Email",
                    text: "發送 PDF 之前，請輸入一個有效的 Email。",
                    confirmButtonColor: "#3085d6", // 確認按鈕顏色
                    confirmButtonText: '<span style="color: white;">確定</span>', 
                    });
                    return;
                }
                            if (!initData.formData.pdf) {
                                Swal.fire({
                    icon: "warning",
                    title: "請先生成 PDF",
                    confirmButtonColor: "#3085d6", // 確認按鈕顏色
                    confirmButtonText: '<span style="color: white;">確定</span>', 
                    
                    });

                return;
            }

            // **將 PDF 轉為 Base64**
            Swal.fire({
  title: "確定要發送 PDF 嗎？",
  text: "確認後將會發送 PDF 到指定 Email。",
  icon: "question",
  showCancelButton: true,
  cancelButtonText: '<span style="color: white;">取消</span>',
  cancelButtonColor: "#d33",
  confirmButtonColor: "#3085d6", // 確認按鈕顏色
  confirmButtonText: '<span style="color: white;">確認</span>', // 文字變紅色
}).then((result) => {
  if (result.isConfirmed) {
    const pdfBlob = initData.formData.pdf.output("blob");
    const reader = new FileReader();

    // 顯示「發送中」狀態
    Swal.fire({
      title: "發送中...",
      text: "請稍候，正在寄送 PDF。",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    reader.readAsDataURL(pdfBlob);
    reader.onloadend = async () => {
      const base64Pdf = reader.result.split(",")[1]; // 去掉 Data URL 的前綴

      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: initData.formData.email,
            pdf: base64Pdf,
          }),
        });

        if (response.ok) {
          Swal.fire({
            icon: "success",
            title: "成功！",
            text: "PDF 已成功寄送！",
            confirmButtonColor: "#3085d6", // 確認按鈕顏色
            confirmButtonText: '<span style="color: white;">ok</span>', 
          });

          // ✅ 成功後清空 Email 欄位
          initData.formData.email = "";
        } else {
          const errorMsg = await response.text();
          Swal.fire({
            icon: "error",
            title: "發送失敗",
            text: errorMsg || "請稍後再試。",
          });
        }
      } catch (error) {
        console.error("錯誤:", error);
        Swal.fire({
          icon: "error",
          title: "發送失敗",
          text: "請檢查網絡連接或稍後再試。",
        });
          }
        }
      }});
    },
  },
});


</script>

<template>
    <div class="main" id="view">
        <h2>比較結果</h2>
        <!-- 新增 -->
        <table v-if="policies.length === 2" border="1" class="tablevw">
            <thead>
                <tr>
                    <th>項目</th>
                    <td style="background-color: #7d7d7d; color: white;">保單 1</td>
                    <td style="background-color: #7d7d7d; color: white;">保單 2</td>
                </tr>
            </thead>

            <tbody>
                <tr>
                    <th>目的地</th>
                    <td>{{ policies[0].destination }}</td>
                    <td>{{ policies[1].destination }}</td>
                </tr>


                <tr>
                    <th>開始日期</th>
                    <td>{{ policies[0].startDate }} {{ policies[0].startHour }}:00</td>
                    <td>{{ policies[1].startDate }} {{ policies[1].startHour }}:00</td>
                </tr>
                <tr>
                    <th>旅遊天數</th>
                    <td>{{ policies[0].days }} 天</td>
                    <td>{{ policies[1].days }} 天</td>
                </tr>
                <tr>
                    <th>保額</th>
                    <td>{{ policies[0].insuranceAmount }} 萬元</td>
                    <td>{{ policies[1].insuranceAmount }} 萬元</td>
                </tr>
                <tr>
                    <th>額外傷害險</th>
                    <td>{{ policies[0].extraInjuryCoverage ? "✔️ 有" : "❌ 無" }}</td>
                    <td>{{ policies[1].extraInjuryCoverage ? "✔️ 有" : "❌ 無" }}</td>
                </tr>
                <tr>
                    <th>額外緊急醫療</th>
                    <td>{{ policies[0].extraEmergencyCoverage ? "✔️ 有" : "❌ 無" }}</td>
                    <td>{{ policies[1].extraEmergencyCoverage ? "✔️ 有" : "❌ 無" }}</td>
                </tr>
                <tr>
                    <th>額外運送補償</th>
                    <td>{{ policies[0].extraTransportCoverage ? "✔️ 有" : "❌ 無" }}</td>
                    <td>{{ policies[1].extraTransportCoverage ? "✔️ 有" : "❌ 無" }}</td>
                </tr>
                <tr>
                    <th>總保費</th>
                    <td>{{ policies[0].totalCost }} 元</td>
                    <td>{{ policies[1].totalCost }} 元</td>
                </tr>
            </tbody>
        </table>
    </div>

    <div class="d-flex justify-content-center align-items-center gap-3">
    <button class="pdfbtn btn " @click="initData.event.generatePdf">另存為 PDF</button>
    <input type="email" v-model="initData.formData.email" class="form-control w-auto" placeholder="輸入 Email" />
    <button class="pdfbtn btn " @click="initData.event.sendPdf">寄送 PDF</button>
</div>
</template>

<style lang="css" scoped>
table {
    /* width: 100%; */
    border-collapse: collapse;
    /* white-space: nowrap;
    overflow-x: auto;
    min-width: 300px; */

}

table tr {
    border-bottom: solid 2px white;
}

table tr:last-child {
    border-bottom: none;
}

table th {
    position: relative;
    width: 30%;
    background-color: #7d7d7d;
    color: white;
    text-align: center;
    padding: 10px 0;
}

table th:after {
    display: block;
    content: "";
    width: 0px;
    height: 0px;
    position: absolute;
    top: calc(50% - 10px);
    right: -10px;
    border-left: 10px solid #7d7d7d;
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;
}

table td {
    text-align: left;
    width: 35%;
    text-align: center;
    background-color: #eee;
    padding: 15px;

}


.main {
    margin: 20px auto;
    align-items: center;
    width: 80%; 
    /* width: 80vw; */
    font-size: 20px;
}
/* 新增 */
.tablevw{
  width: 17vw;
}

h2 {
    font-size: 30px;
    color: #222;
    text-align: center;
    font-weight: bold;
    margin-bottom: 25px;
}

.pdfbtn {
    display: inline-block;
    padding: 10px 15px;
    background-color: lightgray;
    color: black;
    text-decoration: none;
    border-radius: 10px;
    font-size: 14px;
    font-weight: bold;
}

.pdfbtn:hover {
    background-color: #5E666E;
    color: white;
}
</style>