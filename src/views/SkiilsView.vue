<template>
    <div class="pageOutWrap">
        <h2>Skills</h2>
        <div id="chart">
            <VueApexCharts type="bar" height="650" :options="chartOptions" :series="series"></VueApexCharts>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import VueApexCharts from "vue3-apexcharts";
const colors = [
    "#7C3AED", "#2563EB", "#059669", "#EA580C",
    "#DC2626", "#0EA5E9", "#F59E0B", "#10B981"
];
const series = ref([
    { data: [98, 90, 75, 50, 60, 60, 60, 60] }
]);

const chartOptions = ref({
    chart: {
        type: "bar",
        height: 650,
        toolbar: { show: false },
    },
    grid: {
        padding: {
            left: 50,
            right: 0,
        },
        strokeDashArray: 3,
        xaxis: { lines: { show: true } }
    },
    plotOptions: {
        bar: {
            columnWidth: '45%',
            distributed: true,
        }
    },
    dataLabels: {
        enabled: false,
    },
    colors,
    xaxis: {
        categories: [
            "HTML5/CSS3",
            "JavaScript/jQuery",
            "Vue 3",
            "React",
            "Figma",
            "Illustrator",
            "Photoshop",
            "GitHub",
        ],
        labels: {
            style: { fontSize: "16px", fontFamily: "Pretendard-Medium" },
            maxWidth: 40, // 줄임표(...) 하기 전 최대 사용 폭
            offsetX: 0,
            trim: false
        }
    },
    yaxis: {
        max: 100,
        tickAmount: 5,
        labels: { formatter: (v) => `${v}%` }
    },
    tooltip: {
        y: {
            formatter: (v) => `${v}%`,
            title: { formatter: () => "" }
        }
    },
    legend: { show: false },
});

</script>

<style>
.apexcharts-text tspan {
    font-family: 'Pretendard-Medium';
    font-size: 16px;
}
</style>