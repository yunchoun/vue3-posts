<template>
    <div class="pageOutWrap">
        <h2>Projects</h2>

        <div class="projectList">
            <div class="projectCard" v-for="(project, idx) in pageProjects" :key="idx">
                <div class="title">{{ project.title }}</div>
                <div class="description">{{ project.description }}</div>
                <div class="tags">{{ project.tags }}</div>
                <button class="demo" type="button" v-if="project.demo"><a :href="project.demo" target="_blank">페이지
                        바로가기</a></button>
                <button class="git" type="button" v-if="project.github">
                    <a :href="project.github" target="_blank">깃허브 바로가기</a>
                </button>
                <router-link v-if="project.codeRoute" class="code" :to="project.codeRoute">코드 보기</router-link>
                <button class="copyright" type="button" v-if="project.copyright">저작권으로 인해 코드 공개 X</button>
            </div>
        </div>

        <ul class="pagination">
            <li @click="goPrev" :class="{ dis: currentPage === 1 }">&#60;</li>
            <li v-for="n in totalPages" :key="n" @click="goTo(n)" :class="{ on: currentPage === n }">{{ n }}</li>
            <li @click="goNext" :class="{ dis: currentPage === totalPages }">&#62;</li>
        </ul>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';


const projects = ref([
    {
        title: 'Portfolio Website',
        description: 'Vue3 + ApexCharts 기반 포트폴리오 웹사이트',
        tags: '#Vue3, #ApexCharts, #Bootstrap',
        github: 'https://github.com/yunchoun/vue3-shop-project'
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
    {
        title: '고운몸의원',
        description: '웹사이트 퍼블리싱',
        tags: '#HTML5, #CSS3, #Jquery',
        demo: 'https://www.gowoonmom.co.kr/',
    },
    {
        title: '리쥬엘의원',
        description: '웹사이트 퍼블리싱',
        tags: '#HTML5, #CSS3, #Jquery',
        demo: 'https://www.rejuel.com/',
    },
    {
        title: '뷰티픽',
        description: '웹사이트 퍼블리싱',
        tags: '#HTML5, #CSS3, #Jquery',
        demo: 'https://www.btpick.co.kr/web',
    },
    {
        title: '알에프바이오',
        description: '웹사이트 퍼블리싱',
        tags: '#HTML5, #CSS3, #Jquery',
        demo: 'https://www.rfbio.co.kr/',
    },
    {
        title: '엄지 한의원',
        description: '웹사이트 퍼블리싱',
        tags: '#HTML5, #CSS3, #Jquery',
        demo: 'https://www.umjiclinic.com/',
    },
    {
        title: '라해 의원',
        description: '웹사이트 퍼블리싱',
        tags: '#HTML5, #CSS3, #Jquery',
        demo: 'https://www.rahae.co.kr/',
    },
    {
        title: '천재 미술 - 캔버스clip',
        description: '이러닝 - 개발',
        tags: '#HTML5, #CSS3, #Jquery, #e-learning, #이러닝 #canvas #fabric.js #canvas clip',
        demo: '',
        codeRoute: '/code/art-canvas'
    },
    {
        title: '천재 미술 - 회전',
        description: '이러닝 - 개발',
        tags: '#HTML5, #CSS3, #Jquery, #e-learning, #이러닝',
        demo: '',
        codeRoute: '/code/art-rotate'
    },
    {
        title: '천재 미술 - 그리기(도형, 선, 거리조정)',
        description: '이러닝 - 개발',
        tags: '#HTML5, #CSS3, #Jquery, #e-learning, #이러닝 #canvas #fabric.js #capture',
        demo: '',
        codeRoute: '/code/art-draw'
    },
    {
        title: '천재 미술 - 드래그',
        description: '이러닝 - 개발',
        tags: '#HTML5, #CSS3, #Jquery, #e-learning, #이러닝',
        demo: '',
        codeRoute: '/code/art-drag'
    },
    {
        title: '아이스크림',
        description: '이러닝 - 개발 및 양산작업',
        tags: '#HTML5, #CSS3, #Jquery, #e-learning, #이러닝',
        copyright: '저작권',
    },
    {
        title: '지학사',
        description: '이러닝 - 개발',
        tags: '#HTML5, #CSS3, #Jquery, #e-learning, #이러닝 #game',
        copyright: '저작권',
    },
    {
        title: '웅진 올키즈 영어 - 말하기(녹음)',
        description: '이러닝 - 개발 및 양산작업',
        tags: '#HTML5, #CSS3, #Jquery, #e-learning, #이러닝 #record',
        codeRoute: '/code/eng-record'
    },
    {
        title: '웅진 문해력 - 초급',
        description: '이러닝 - 개발 및 양산작업',
        tags: '#HTML5, #CSS3, #Jquery, #e-learning, #이러닝 #game',
        copyright: '저작권',
    },
    {
        title: '미래엔 수학',
        description: '이러닝 - 개발 및 양산작업',
        tags: '#HTML5, #CSS3, #Jquery, #e-learning, #이러닝',
        copyright: '저작권',
    },
    {
        title: '천재 국어',
        description: '이러닝 - 개발 및 양산작업',
        tags: '#HTML5, #CSS3, #Jquery, #e-learning, #이러닝',
        copyright: '저작권',
    },
    {
        title: '웅진바로쏙',
        description: '이러닝 - 개발 및 양산작업',
        tags: '#HTML5, #CSS3, #Jquery, #e-learning, #이러닝',
        copyright: '저작권',
    },
    {
        title: '비상 에듀테크 수학',
        description: '이러닝 - 차시작업',
        tags: '#HTML5, #CSS3, #Jquery, #e-learning, #이러닝',
        copyright: '저작권',
    },
    {
        title: '비상 사회',
        description: '이러닝 - 차시작업',
        tags: '#HTML5, #CSS3, #Jquery, #e-learning, #이러닝',
        copyright: '저작권',
    },
])

const currentPage = ref(1);
const itemsPerPage = 9;
const totalPages = ref(Math.ceil(projects.value.length / itemsPerPage));
console.log(currentPage)

const pageProjects = computed(() => {
    return projects.value.slice((currentPage.value - 1) * itemsPerPage, currentPage.value * itemsPerPage);
});

const goTo = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
    }
};

const goPrev = () => {
    if (currentPage.value > 1) {
        currentPage.value--;
    }
};

const goNext = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++;
    }
};


</script>

<style scoped>
.projectList {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
}

.projectList .projectCard {
    width: calc((100% - 40px)/3);
    height: 230px;
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 1px solid #ccc;
    padding: 30px;
    box-sizing: border-box;
    border-radius: 10px;
    font-family: 'Pretendard-Regular';
    background-color: #fff;
}

.projectList .projectCard .title {
    font-family: 'Pretendard-Bold';
}

.projectList .projectCard .description {
    font-size: 14px;
    margin-top: 20px;
}

.projectList .projectCard .demo,
.projectList .projectCard .git,
.projectList .projectCard .code,
.projectList .projectCard .copyright {
    font-size: 16px;
    border: none;
    padding: 5px 20px;
    box-sizing: border-box;
    border-radius: 5px;
    background-color: rgb(193, 128, 255);
    margin-top: 45px;
    color: #fff;
    font-family: 'Pretendard-Medium';
}

.projectList .projectCard .copyright {
    background-color: #420085;
    pointer-events: none;
}

.projectList .projectCard .demo a,
.projectList .projectCard .git a {
    color: #fff;
}

.projectList .projectCard .tags {
    font-size: 12px;
    margin-top: 10px;
}

.pagination {
    position: absolute;
    bottom: 0px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-top: 30px;
}

.pagination li {
    width: 30px;
    height: 30px;
    border: 1px solid #ccc;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.pagination li.on {
    color: #420085;
    border-color: #420085;
}

.pagination li.dis {
    color: #ccc;
    cursor: inherit;
}
</style>