<template>
    <header>
        <nav class="navBar">
            <div class="logo"><a class="" href="#"><img src="/src/assets/images/logo.png" alt=""></a></div>
            <ul class="nav">
                <li>
                    <RouterLink active-class="active" to="/">About Me</RouterLink>
                </li>
                <li>
                    <RouterLink active-class="active" to="/skiils">Skiils</RouterLink>
                </li>
                <li>
                    <RouterLink active-class="active" to="/project">Projects</RouterLink>
                </li>
                <li>
                    <RouterLink active-class="active" to="/posts">게시글</RouterLink>
                </li>
                <!-- <li>
                    <RouterLink active-class="active" to="/nested">nested</RouterLink>
                </li> -->
            </ul>
        </nav>
        <div class="btnArea">
            <button class="btn" type="button" @click="goPage">글쓰기</button>
        </div>
    </header>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
const goPage = () => {
    // router.push('/posts/create');
    router.push({
        name: 'PostCreate',
    })
};

</script>

<style>
header {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 75px;
    border-bottom: 1px solid #f0e2ff;
    padding: 0 30px;
}

.navBar {
    display: flex;
    align-items: center;
    box-sizing: border-box;
}

.nav {
    display: flex;
    align-items: center;
}

.nav li>a {
    position: relative;
    padding: 25px 30px;
    display: block;
    box-sizing: border-box;
    font-family: 'Pretendard-Regular';
    font-size: 15px;
}

.nav li>a:hover,
.nav li>a.active {
    color: #420085;
}

.nav li>a:hover:after,
.nav li>a.active:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: #c19fe6;
}


.logo {
    width: 80px;
    margin-right: 20px;
}

.logo img {
    width: 100%;
}

header .btnArea {
    display: flex;
    align-items: center;
}

header .btn {
    font-size: 14px;
    font-family: 'Pretendard-medium';
    background-color: #aa5aff;
    color: #fff;
    border: 2px solid #aa5aff;
}

header .btn:hover {
    border: 2px solid #aa5aff;
    box-sizing: border-box;
    background-color: #af65ff;
    color: #fff;
}

header .btn:focus {
    border: 2px solid #aa5aff;
    box-sizing: border-box;
    background-color: #af65ff;
    color: #fff;
}
</style>