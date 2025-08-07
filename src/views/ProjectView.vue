<template>
    <div class="pageOutWrap">
        <h2>Projects</h2>

        <div class="projectList">
            <div class="projectCard" v-for="(project, idx) in projects" :key="idx">
                <div class="title">{{ project.title }}</div>
                <div class="description">{{ project.description }}</div>
                <div class="tags">{{ project.tags }}</div>
                <button class="demo" type="button" v-if="project.demo"><a :href="project.demo" target="_blank">페이지
                        바로가기</a></button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';


const projects = ref([
    // {
    //     title: 'Portfolio Website',
    //     description: 'Vue3 + ApexCharts 기반 포트폴리오 웹사이트',
    //     tags: '#Vue3, #ApexCharts, #Bootstrap',
    //     demo: 'https://example.com/demo1',
    //     github: 'https://github.com/example/project1'
    // },
    {
        title: '밴스의원',
        description: '웹사이트 퍼블리싱',
        tags: '#HTML5, #CSS3, #Jquery',
        demo: 'https://www.vandsclinic.co.kr/',
    },
    {
        title: '바노바기 피부과의원',
        description: '웹사이트 퍼블리싱',
        tags: '#HTML5, #CSS3, #Jquery',
        demo: 'https://skinbanobagi.com/web',
    },
    {
        title: '예약쏙',
        description: '웹사이트 퍼블리싱',
        tags: '#HTML5, #CSS3, #Jquery',
        demo: 'https://www.yeyakssok.com/',
    },
    {
        title: '밴스의원',
        description: '웹사이트 퍼블리싱',
        tags: '#HTML5, #CSS3, #Jquery',
        demo: 'https://www.vandsclinic.co.kr/',
    },
    {
        title: '바노바기 피부과의원',
        description: '웹사이트 퍼블리싱',
        tags: '#HTML5, #CSS3, #Jquery',
        demo: 'https://skinbanobagi.com/web',
    },
    {
        title: '예약쏙',
        description: '웹사이트 퍼블리싱',
        tags: '#HTML5, #CSS3, #Jquery',
        demo: 'https://www.yeyakssok.com/',
    },
])
</script>

<style>
.projectList {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
}

.projectList .projectCard {
    width: calc((100% - 40px)/3);
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 1px solid #ccc;
    padding: 10px;
    box-sizing: border-box;
    border-radius: 10px;
    font-family: 'Pretendard-Regular';
}

.projectList .projectCard .title {
    font-family: 'Pretendard-Bold';
}

.projectList .projectCard .description {
    font-size: 14px;
    margin-top: 20px;
}

.projectList .projectCard .demo {
    font-size: 14px;
    border: none;
    padding: 5px 10px;
    box-sizing: border-box;
    border-radius: 5px;
    background-color: rgb(193, 128, 255);
    margin-top: 5px;
}

.projectList .projectCard .demo a {
    color: #fff;
}

.projectList .projectCard .tags {
    font-size: 12px;
    margin-top: 10px;
}
</style>