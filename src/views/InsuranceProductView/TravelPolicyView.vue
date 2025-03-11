<script setup>
import { ref } from 'vue';

const pdfUrl = ref('/sample.pdf'); // PDF 存放在 public 資料夾

</script>

<template>
    <div class="tab-pane fade active show" id="proRules" role="tabpanel" aria-labelledby="proRules-tab">
        <div class="container">
            <div class="tab-content mb-5" id="pills-tabContent-proRules">
                <div class="tab-pane fade show active" id="proRules-A" role="tabpanel" aria-labelledby="proRules-A-tab">
                    <div>
                        <div class="position-relative">
                            <div></div>
                        </div>
                        <div>&nbsp;</div>
                        <h2 class="text-center fw-bold mb-4">商品條款</h2>
                        <h2 class="fw-bold mb-2">商品名稱/文號</h2>
                        <div>
                            <div>
                                <p class="fw-bold">
                                    <a :href="pdfUrl" target="_blank">安心保網路投保旅行平安保險：</a>
                                </p>
                            </div>
                            <div class="d-table">
                                <div class="d-block d-md-table-row">
                                    <div class="d-block d-md-table-cell fw-bold">給付項目：</div>
                                    <div class="d-block d-md-table-cell">
                                        <ul class="mb-1">
                                            <li>意外身故保險金或喪葬費用保險金</li>
                                            <li>意外失能保險金</li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="d-block d-md-table-row">
                                    <div class="d-block d-md-table-cell fw-bold">商品文號：</div>
                                    <div class="d-block d-md-table-cell position-relative">
                                        <ul class="mb-1">
                                            <li>114.02.01 e險精字第1130002245號函備查</li>
                                            <li>114.02.01 e險精字第1130005679號函備查</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <a class="d-table fw-bold mb-1 ps-1 ps-lg-3"
                                href="https://direct.fubonlife.com.tw/directBack/documents/EJCADD_條款樣張_1140101.pdf"
                                download="">
                                <span class="d-table-cell"><i></i></span>
                                <span class="d-table-cell fw-bold">安心保海外突發疾病醫療健康保險：</span>
                            </a>
                            <div class="d-table">
                                <div class="d-block d-md-table-row">
                                    <div class="d-block d-md-table-cell fw-bold">給付項目：</div>
                                    <div class="d-block d-md-table-cell">
                                        <ul class="mb-1">
                                            <li>海外突發疾病住院醫療保險金</li>
                                            <li>海外突發疾病門診醫療保險金</li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="d-block d-md-table-row">
                                    <div class="d-block d-md-table-cell fw-bold">商品文號：</div>
                                    <div class="d-block d-md-table-cell position-relative">
                                        <ul class="mb-1">
                                            <li>114.02.01 e險精字第1130000034號函備查</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <a class="d-table fw-bold mb-1 ps-1 ps-lg-3"
                                href="https://direct.fubonlife.com.tw/directBack/documents/EJCADD_條款樣張_1140101.pdf"
                                download="">
                                <span class="d-table-cell"><i></i></span>
                                <span class="d-table-cell fw-bold">安心保網路投保旅行平安保險海外醫療專機運送：</span>
                            </a>
                            <div class="d-table">
                                <div class="d-block d-md-table-row">
                                    <div class="d-block d-md-table-cell fw-bold">給付項目：</div>
                                    <div class="d-block d-md-table-cell">
                                        <ul class="mb-1">
                                            <li>海外醫療專機服務</li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="d-block d-md-table-row">
                                    <div class="d-block d-md-table-cell fw-bold">商品文號：</div>
                                    <div class="d-block d-md-table-cell position-relative">
                                        <ul class="mb-1">
                                            <li>114.02.01 e險精字第1130003749號函備查</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <a class="d-table fw-bold mb-1 ps-1 ps-lg-3"
                                href="https://direct.fubonlife.com.tw/directBack/documents/EJCADD_條款樣張_1140101.pdf"
                                download="">
                                <span class="d-table-cell"><i></i></span>
                                <span class="d-table-cell fw-bold">安心保旅行平安保險傷害醫療保險：</span>
                            </a>
                            <div class="d-table">
                                <div class="d-block d-md-table-row">
                                    <div class="d-block d-md-table-cell fw-bold">給付項目：</div>
                                    <div class="d-block d-md-table-cell">
                                        <ul class="mb-1">
                                            <li>傷害醫療保障</li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="d-block d-md-table-row">
                                    <div class="d-block d-md-table-cell fw-bold">商品文號：</div>
                                    <div class="d-block d-md-table-cell position-relative">
                                        <ul class="mb-1">
                                            <li>114.02.01 e險精字第1130006534號函備查</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 class="fw-bold mb-2">注意事項</h2>
                            <div class="text-start">
                                <ol class="fw-bold mb-0" style="color: #d51a1a;">
                                    <li>消費者投保前應審慎瞭解本商品之承保範圍、除外責任等。</li>
                                    <li>人壽保險之死亡給付不得作為被保險人之遺產。</li>
                                    <li>保險契約各項權利義務皆詳列於保單條款。</li>
                                    <li>本網頁簡介僅供參考，詳細商品內容及變更，以投保當時保單條款內容及本公司核保、保全作業等規定為準。</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<style lang="css" scoped></style>