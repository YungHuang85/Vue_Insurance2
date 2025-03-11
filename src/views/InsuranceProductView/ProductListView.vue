<script setup>
import ProductListNavbarComponent from '@/components/InsuranceProductComponent/ProductListNavbarComponent.vue';
import TravelAdComponent from '@/components/InsuranceProductComponent/TravelAdComponent.vue';
import axios from 'axios';

import { onMounted } from 'vue';
import { ref } from 'vue';
import { reactive } from 'vue';

const categories = reactive([{ id: 0, name: '全部' }])
const products = reactive({})
const datas = ref({ "categoryid": 0, "is_feature": true })//, "is_feature": false


const loadProducts = async () => {
    const BASE_URL = import.meta.env.VITE_APIURL

    let API_URL = `${BASE_URL}/productlist/GetAllProduct`;

    // 根据分类ID决定 API 路径
    if (datas.value.is_feature) {
        API_URL = `${BASE_URL}/productlist/GetFeaturedProduct`;
    } else if (datas.value.categoryid !== 0) {
        API_URL = `${BASE_URL}/productlist/GetAllProduct/${datas.value.categoryid}`;
    }
    Object.keys(products).forEach(key => delete products[key]);
    const response = await axios.get(API_URL)
    Object.assign(products, response.data)
}

const CategoryHandler = async (id) => {
    if (id === 'featured') {
        datas.value.categoryid = 0;  // 將分類ID設為0（或其他代表全部的值）
        datas.value.is_feature = true; // 新增一個變數來標示選擇的是精選產品
    } else {
        datas.value.categoryid = id;  // 更新分類ID
        datas.value.is_feature = false; // 取消精選狀態
    }
    await loadProducts();
};


onMounted(async () => {
    loadProducts();
})



</script>

<template>



    <div class="main-content">
        <div>
            <TravelAdComponent></TravelAdComponent>
        </div>
        <div style="background-color: white">
            <ProductListNavbarComponent @categoryClick="CategoryHandler"></ProductListNavbarComponent>
        </div>
        <div class="row row-cols-1 row-cols-md-3 g-4 mt-3">
            <div class="col" v-for="product in products" :key="product.productid">
                <div class="card h-100">
                    <!-- <RouterLink :to="{ name: `category${datas.categoryid}`, params: { categoryid: datas.categoryid} }"> -->
                    <a :href="'/' + `category${datas.categoryid}`">
                        <img :src="product.productPicture" class="card-img-top" :alt="product.productname">

                    </a>
                    <!-- </RouterLink> -->

                    <div class="card-body">
                        <h4 class="card-title" style="font-weight: bold;">{{ product.productname }}</h4>
                        <p class="card-text" style="font-size: 18px"> {{ product.productDescription && product.productDescription.length <= 100
                            ? product.productDescription : (product.productDescription ?
                                product.productDescription.substring(0, 100) : '') }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>





</template>

<style lang="css" scoped>
.main-content {
    padding-top: 70px;
}
</style>