<script setup>
import TheHeader from '@/layouts/TheHeader.vue';
import TheView from '@/layouts/TheView.vue';
import TheSideBar from './layouts/TheSideBar.vue';
</script>

<template>
  <div class="layout">
    <TheSideBar></TheSideBar>
    <div class="main-content">
      <TheHeader></TheHeader>
      <TheView></TheView>
    </div>
  </div>

</template>

<style>
.layout {
  display: flex;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>
