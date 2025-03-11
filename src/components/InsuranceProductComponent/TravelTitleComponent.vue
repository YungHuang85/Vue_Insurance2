<script setup>

</script>

<template>
    <div>
        <div class="position-relative container">
            <!-- 文字區塊 -->
            <div class="text-content">
                <h1 class="h1 mb-3" style="font-weight: bold;">旅平險</h1>
                <br><br><br>
                <div class="h5">
                    國內/外旅遊發生意外事故或是突發疾病，<br class="d-none d-sm-block">
                    不僅影響旅遊心情還需負擔龐大醫療費用，投保旅平險更放心
                </div>
            </div>

            <!-- 圖片區塊 (使用 position: absolute) -->
            <picture data-aos="fade-in" class="position-absolute custom-image"><!--aos動畫暫時不理她-->
                <!-- <source media="(min-width: 992px)" srcset="/images/cutelugman.png"> -->
                <img class="img-fluid" src="/images/cutelugman.png" alt="">
            </picture>
        </div>

    </div>

</template>

<style lang="css" scoped>
.text-content {
    min-height: 450px;
}

.custom-image {
    bottom: 20px;
    /* 向下偏移 0px */
    right: 90px;
    /* 向左偏移 70px */
    width: 40%;
    /* 控制圖片大小 */
}
</style>