<template>
    <div class="cv-wrap">
        <h2>Code</h2>

        <div v-if="loading">불러오는 중…</div>
        <div v-else-if="error" class="cv-error">{{ error }}</div>
        <pre v-else :class="['cv-pre', theme]" v-html="html"></pre>

        <button class="prevBtn" @click="goBack">이전</button>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
hljs.registerLanguage('javascript', javascript)

const route = useRoute()
const router = useRouter()

const html = ref('')
const loading = ref(false)
const error = ref('')
const theme = ref('light')

async function loadCode() {
    loading.value = true
    error.value = ''
    html.value = ''

    try {
        // 1. json 불러오기
        const res = await fetch('/code/files.json', { cache: 'no-store' })
        const data = await res.json()

        // 2. URL 파라미터에서 프로젝트 키 얻기
        const projectKey = route.params.project?.toString()
        if (!projectKey || !data[projectKey]) {
            throw new Error('해당 프로젝트를 찾을 수 없습니다.')
        }

        // 3. 첫 번째 파일 경로
        const fileName = data[projectKey][0]

        // 4. 파일 내용 불러오기
        const fileRes = await fetch(`/code/${fileName}`, { cache: 'no-store' })
        const text = await fileRes.text()

        // 5. highlight.js로 변환
        const { value } = hljs.highlight(text, { language: 'javascript' })
        html.value = `<code class="hljs language-js">${value}</code>`
    } catch (e) {
        error.value = '파일을 불러올 수 없습니다.'
    } finally {
        loading.value = false
    }
}

function goBack() {
    router.back()
}

onMounted(loadCode)
</script>

<style>
@import 'highlight.js/styles/github.css';
@import 'highlight.js/styles/github-dark.css';

.cv-wrap {
    max-width: 1100px;
    margin: 0 auto;
    padding: 20px;
}

.cv-pre {
    padding: 16px;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    background: #fff;
    max-height: 70vh;
    overflow: auto;
    user-select: none;
}

.cv-pre.dark {
    background: #0d1117;
    color: #c9d1d9;
}

.prevBtn {
    padding: 10px 30px;
    background-color: #aa5aff;
    color: #fff;
    border: none;
    border-radius: 5px;
}
</style>
