<template>
    <div>
      <canvas ref="chartCanvas"></canvas>
    </div>
  </template>
  
  <script>
  import Chart from 'chart.js/auto'
import { onMounted, ref, watch } from 'vue'
  
  export default {
    name: 'ChallengesChart',
    props: {
      chartData: { type: Object, required: true }
    },
    setup(props) {
      const chartCanvas = ref(null)
      let chartInstance = null
  
      const renderChart = () => {
        if (chartInstance) chartInstance.destroy()
        chartInstance = new Chart(chartCanvas.value, {
          type: 'line',
          data: {
            labels: props.chartData.labels,
            datasets: [{
              label: 'Challenges Completed',
              data: props.chartData.data,
              borderColor: 'rgba(75,192,192,1)',
              backgroundColor: 'rgba(75,192,192,0.2)',
              fill: true
            }]
          },
          options: { responsive: true, maintainAspectRatio: false }
        })
      }
  
      onMounted(() => { if (props.chartData) renderChart() })
      watch(() => props.chartData, (newData) => { if(newData) renderChart() })
  
      return { chartCanvas }
    }
  }
  </script>
  
  <style scoped>
  canvas {
    width: 100%;
    height: 100%;
  }
  </style>
  