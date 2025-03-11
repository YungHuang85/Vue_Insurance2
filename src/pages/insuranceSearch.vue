<template>
    <div class="PolicyInfo">
        <h2>保單資訊</h2>

        <!-- 資料載入中時顯示 "載入中..." -->
        <div v-if="loading">載入中...</div>
        <!-- 發生錯誤時顯示錯誤訊息 -->
        <div v-else-if="error">{{ error }}</div>
        <div v-else>
            <!-- 若無保單資料則顯示 "目前無保單資料。" -->
            <div v-if="policies.length === 0">目前無保單資料。</div>

            <!-- 保單列表 -->
            <div v-else class="policy-list">
                <div v-for="policy in policies" :key="policy.insuranceNumber" class="policy-item">
                    <!-- 保單編號和箭頭圖示，點擊以顯示/隱藏詳細資訊 -->
                    <div class="policy-header" @click="toggleDetails(policy.insuranceNumber)">
                        <p class="policy-number">
                            保單編號: {{ policy.insuranceNumber }}
                        </p>
                        <font-awesome-icon
                            :icon="expandedPolicy === policy.insuranceNumber ? 'chevron-up' : 'chevron-down'"
                            class="arrow-icon" />
                    </div>
                    <!-- 詳細資訊，根據狀態顯示或隱藏 -->
                    <div v-if="expandedPolicy === policy.insuranceNumber" class="policy-details">

                        <strong>投保人資訊:</strong>

                        <p><strong>保險產品:</strong> {{ policy.product }}</p>
                        <p><strong>地點:</strong> {{ policy.location }}</p>
                        <p><strong>開始日期:</strong> {{ policy.startTime }}</p>
                        <p><strong>結束日期:</strong> {{ policy.endTime }}</p>
                        <p><strong>保險金額:</strong> {{ policy.sumAssured }}</p>
                        <p><strong>保費:</strong> {{ policy.premiums }} NTD</p>
                        <div>
                            <hr>
                            <strong>受益人資訊:</strong>
                            <div v-for="beneficiary in policy.beneficiaries" :key="beneficiary.beneficiaryID"
                                class="beneficiary-info">
                                <p>
                                    姓名: {{ beneficiary.beneficiaryName }} (關係: {{
                                        beneficiary.relationship
                                    }})
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
    name: 'PolicyInfo',
    setup() {
        const policies = ref([]);
        const loading = ref(false);
        const error = ref(null);
        const expandedPolicy = ref(null); // 用於追蹤當前展開的保單編號

        const fetchPolicies = async () => {
            loading.value = true;
            error.value = null;
            try {
                const account = sessionStorage.getItem('account');
                if (!account) {
                    throw new Error('無法取得帳號資訊！');
                }

                const response = await fetch(
                    `http://localhost:8081/clients/policies?account=${account}`
                );

                if (!response.ok) {
                    throw new Error(`伺服器回應錯誤，狀態碼: ${response.status}`);
                }

                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    console.error('非 JSON 回應內容：', await response.text());
                    throw new Error('伺服器回傳非 JSON 資料！');
                }

                const data = await response.json();
                console.log('保單資料：', data);
                policies.value = data;
            } catch (err) {
                error.value = err.message;
            } finally {
                loading.value = false;
            }
        };

        // 切換詳細資訊的顯示狀態
        const toggleDetails = (insuranceNumber) => {
            if (expandedPolicy.value === insuranceNumber) {
                expandedPolicy.value = null;
            } else {
                expandedPolicy.value = insuranceNumber;
            }
        };

        onMounted(() => {
            fetchPolicies();
        });

        return {
            policies,
            loading,
            error,
            expandedPolicy,
            toggleDetails,
        };
    },
};
</script>

<style scoped>
/* 整體樣式 */
.PolicyInfo {
    max-width: 800px;
    margin: auto;
    padding: 20px;
    color: #2d572c;
    font-weight: bold;
    font-size: 23px;
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

/* 標題樣式 */
h2 {
    font-weight: bold;
    font-size: 28px;
    text-align: center;
    color: #1e4d2b;
    margin-bottom: 20px;
}

/* 保單列表 */
.policy-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

/* 單個保單區塊 */
.policy-item {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 15px;
    background-color: #f8fdf5;
    transition: all 0.3s ease-in-out;
}

.policy-item:hover {
    background-color: #e6f4e6;
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
}

/* 保單標題區 */
.policy-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    padding: 10px;
    background: #2d572c;
    color: white;
    border-radius: 6px;
    transition: background 0.3s ease-in-out;
}

.policy-header:hover {
    background: #1e4d2b;
}

/* 保單編號 */
.policy-number {
    margin: 0;
    font-size: 18px;
}

/* 箭頭圖示 */
.arrow-icon {
    font-size: 1.4em;
    transition: transform 0.3s;
}

.policy-header:hover .arrow-icon {
    transform: scale(1.1);
}

/* 詳細資訊區域 */
.policy-details {
    margin-top: 10px;
    padding: 10px 15px;
    border-left: 3px solid #2d572c;
    background: rgba(246, 253, 248);
    border-radius: 4px;
    animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-5px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* 保險資訊 */
.policy-details p {
    margin: 5px 0;
    font-size: 20px;
    color: #333;
}

/* 受益人資訊 */
.beneficiary-info {
    border-radius: 4px;
    margin-top: 5px;
    font-size: 20px;
}
</style>
