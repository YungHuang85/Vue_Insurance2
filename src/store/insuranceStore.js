import { defineStore } from "pinia";
import Swal from "sweetalert2";
export const useInsuranceStore = defineStore("insuranceStore", {
    state: () => ({
        policies: [], // 儲存保單資料
    }),
    actions: {
        // 新增保單到比較清單
        addPolicy(policy) {
            if (this.policies.length >= 2) {
                Swal.fire({
                    icon: "warning",
                    title: "最多只能比較兩筆保單！",
                    text: "請先移除一筆保單再加入新的。",
                    // color: "#d33", // 文字顏色
                    confirmButtonColor: "#3085d6", // 確認按鈕顏色
                    confirmButtonText: '<span style="color: white;">確定</span>', // 文字變紅色
                });
                return;
            }
            Swal.fire({
                icon: "success",
                title: "已加入比較",
                showConfirmButton: false,
                timer: 500, // 1.5 秒後自動消失
            });
            this.policies.push(policy);

        },
    },
    persist: true, // 自動將 state 儲存到 localStorage
});