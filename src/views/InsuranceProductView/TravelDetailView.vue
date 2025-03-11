<script setup>
import CalculatorComponent from '@/components/InsuranceProductComponent/CalculatorComponent.vue';
import ProductDetailComponent from '@/components/InsuranceProductComponent/ProductDetailComponent.vue';
import ProductSloganComponent from '@/components/InsuranceProductComponent/ProductSloganComponent.vue';
import CalculateSidebarComponent from '@/components/InsuranceProductComponent/CalculateSidebarComponent.vue';
import { onMounted, onUnmounted } from 'vue';

const updateTablePosition = () => {
  const header = document.querySelector('.top');
  const fixedTable = document.getElementById('fixedTable');

  if (!header || !fixedTable) return; // 確保 DOM 存在

  const headerBottom = header.offsetTop + header.offsetHeight / 3;

  if (window.scrollY > headerBottom) {
    fixedTable.style.position = 'fixed';
    fixedTable.style.top = '0px';
  } else {
    fixedTable.style.position = 'absolute';
    fixedTable.style.top = `${headerBottom}px`;
  }
};

onMounted(() => {
  window.addEventListener('scroll', updateTablePosition);
  updateTablePosition(); // 初始化表格位置
});

onUnmounted(() => {
  window.removeEventListener('scroll', updateTablePosition);
});



</script>

<template>
  <div class="container">
    <div>
      <ProductSloganComponent></ProductSloganComponent>
    </div>
    <div>
      <ProductDetailComponent></ProductDetailComponent>
    </div>
    <div class="top">
      <CalculatorComponent></CalculatorComponent>
    </div>

    <div id="fixedTable">
      <CalculateSidebarComponent></CalculateSidebarComponent>
    </div>
  </div>
</template>

<style lang="css" scoped>
.container>div {
  width: 100%;
}

#fixedTable {
  position: absolute;
  /*right: -1600px;
  靠右邊 20px，視需要調整 */
  left: 85%;

}
</style>