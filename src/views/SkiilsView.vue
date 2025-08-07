<template>
    <div class="pageOutWrap">
        <h2>Skills</h2>
        <div id="chart">
            <VueApexCharts type="bar" height="350" :options="chartOptions" :series="series"></VueApexCharts>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import VueApexCharts from "vue3-apexcharts";

const series = ref([
    {
        data: [98, 90, 75, 50, 60, 60],
    },
]);
const chartOptions = ref({
    chart: {
        type: "bar",
        height: 350,
    },
    plotOptions: {
        bar: {
            borderRadius: 4,
            borderRadiusApplication: "end",
            horizontal: true,
        },
    },
    dataLabels: {
        enabled: false,
        formatter: (val) => `${val}%` // 데이터 레이블에 % 추가
    },

    colors: [
        '#aa5aff', // 첫 번째 데이터 색상
    ],
    xaxis: {
        categories: [
            "HTML5/CSS3",
            "JavaScript/Jquery",
            "Vue3",
            "React",
            "Figma/Illustrator/Photoshop",
            "GitHub",
        ],
        labels: {
            formatter: (value) => `${value}%`
        }
    },
    legend: {
        show: false
    },
    tooltip: {
        y: {
            formatter: (val) => `${val}%`, // 툴팁에도 % 추가
            title: {
                formatter: () => '' // series 이름 제거
            }
        }
    },

});
</script>

<style>
.apexcharts-text tspan {
    font-family: 'Pretendard-Medium';
}
</style>