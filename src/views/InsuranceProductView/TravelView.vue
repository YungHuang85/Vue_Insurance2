<script setup>

import ProductNavbarComponent from '@/components/InsuranceProductComponent/ProductNavbarComponent.vue';
import TravelTitleComponent from '@/components/InsuranceProductComponent/TravelTitleComponent.vue'

</script>

<template>

    <div class="main-content">

        <div class="container-fluid">
            <TravelTitleComponent></TravelTitleComponent>
        </div>

        <div>
            <ProductNavbarComponent></ProductNavbarComponent>
        </div>
    </div>



</template>

<style lang="css" scoped>
.main-content {
    padding-top: 70px;
    width: 100% !important;
}
</style>