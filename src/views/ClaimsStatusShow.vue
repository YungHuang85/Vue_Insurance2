<script setup>
import { ref } from 'vue';
import { useClaimsStatusShowStore } from '../store/ClaimsStatusShowStore.js';
import Swal from 'sweetalert2';
const store = useClaimsStatusShowStore();

const BASE_URL = import.meta.env.VITE_APIURL;
const API_URL = `${BASE_URL}/GetInsuranceClaimAll` // "http://localhost:8083/GetClientTravelAll"
console.log(`${BASE_URL}/GetInsuranceClaimAll/${store.id}`)
console.log('執行claimstatue');
const policies = ref([])

//讀取會員資料
const loadInsuranceClaimData = async () => {
    const response = await fetch(API_URL)
    console.log(response);
    if (!response.ok) {
        alert('有問題!!')
    } else {
        //將伺服器返回的 JSON 格式的資料轉換為 JavaScript 物件或陣列。(將伺服器回傳資料轉回物件或陣列)
        const data = await response.json();
        console.log(data);
        // members.value = datas.map(_member => ({
        //     ..._member,
        //     isBrowse: true

        // }))
        policies.value = data;
        console.log(policies.value + '測試')
    }
}
loadInsuranceClaimData()

</script>
<template>


    <table class="table">
        <thead>
            <tr>
                <th scope="col">保單號碼</th>
                <th scope="col">商品名稱</th>
                <th scope="col">投保人 </th>
                <th scope="col">理賠進度</th>
                <th scope="col">給付金額</th>
                <th scope="col">備註欄</th>
            </tr>
        </thead>
        <tbody>
            <!-- 使用 v-for 生成表格內容 -->
            <tr v-for="(policy, index) in policies" :key="policy.insuranceNumber">
                <td>{{ policy.policyNumber }}</td>
                <td>{{ policy.policyName }}</td>
                <td>{{ policy.clientName }}</td>
                <td>{{ policy.claimStatus }}</td>
                <td>{{ policy.claimAmount }}</td>
                <td>{{ policy.comment }}</td>
            </tr>
        </tbody>
    </table>
</template>

<style lang="css" scoped></style>