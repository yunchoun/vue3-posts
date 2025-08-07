<template>
    <div class="pageOutWrap">
        <h2>Home View</h2>
        <button class="btn btn-primary" @click="goAboutPage">About으로 이동</button>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter()
const goAboutPage = () => {
    router.push('/about');
}
</script>

<style></style>