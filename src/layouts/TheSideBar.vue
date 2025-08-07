<template>
    <div class="sideWrap">
        <div class="profile">
            <div class="profileImg"><img src="/src/assets/images/profile.jpg" alt=""></div>
            <div class="name">YUN, CHOUN</div>
            <div class="career">Frond-end Developer</div>
        </div>
        <div class="listWrap">
            <div class="list">
                <i class="fa-brands fa-blogger-b"></i>
                <span class=text><a href="https://blog.naver.com/esme_ycu" target="_blank">blog</a></span>

            </div>
            <div class="list">
                <i class="fa-solid fa-envelope"></i>
                <span class="text"><a href="mailto:yunchoun1996@gmail.com">yunchoun1996@gmail.com</a></span>
            </div>
            <div class="list">
                <i class="fa-brands fa-github"></i>
                <span class="text"><a href="https://github.com/yunchoun/vue3-posts" target="_blank">git</a></span>
            </div>
        </div>
    </div>
</template>

<script setup>

</script>

<style>
.sideWrap {
    width: 20%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 50px;
    padding: 20px;
    box-sizing: border-box;
    background-color: #e1c8fe;
}

.sideWrap .profile {
    text-align: center;
    padding-bottom: 30px;
    border-bottom: 2px dotted #ffffff;
    box-sizing: border-box;
}

.sideWrap .profile .profileImg {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    overflow: hidden;
    margin-bottom: 20px;
}

.sideWrap .profile .profileImg img {
    width: 100%;
}

.sideWrap .profile .name {
    font-family: 'Pretendard-Medium';
    color: #333;
}

.sideWrap .profile .career {
    font-size: 14px;
    font-family: 'Pretendard-Light';
}

.sideWrap .listWrap {
    display: flex;
    flex-direction: column;
    gap: 40px;
}

.sideWrap .list {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
}

.sideWrap .list .text {
    font-size: 14px;
    font-family: 'Pretendard-Light';
    color: #333;
}

.sideWrap .list .text a {
    text-decoration: none;
    color: #333;
}
</style>