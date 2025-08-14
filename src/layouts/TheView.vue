<template>
    <div class="view">
        <RouterView></RouterView>
    </div>
</template>

<script setup>

</script>

<style>
.view {
    padding: 60px 50px;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
}

.view h2 {
    text-align: center;
    font-family: 'Pretendard-Bold';
    margin-bottom: 30px;
}

.pageOutWrap {
    position: relative;
    width: 100%;
    height: 100%;
}
</style>