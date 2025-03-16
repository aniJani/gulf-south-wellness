<template>
    <div class="chart-container">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </template>
  
  <script>
  import Chart from 'chart.js/auto';
import { onMounted, ref, watch } from 'vue';
  
  export default {
    name: 'ActivityChart',
    props: {
      chartData: {
        type: Object,
        required: true
      }
    },
    setup(props) {
      const chartCanvas = ref(null);
      let chartInstance = null;
  
      const renderChart = () => {
        if (chartInstance) {
          chartInstance.destroy();
        }
  
        const ctx = chartCanvas.value.getContext('2d');
        
        // Create gradient for the first dataset
        const gradient1 = ctx.createLinearGradient(0, 0, 0, 400);
        gradient1.addColorStop(0, 'rgba(187, 134, 252, 0.4)');
        gradient1.addColorStop(1, 'rgba(187, 134, 252, 0.0)');
        
        // Create gradient for the second dataset
        const gradient2 = ctx.createLinearGradient(0, 0, 0, 400);
        gradient2.addColorStop(0, 'rgba(3, 218, 198, 0.4)');
        gradient2.addColorStop(1, 'rgba(3, 218, 198, 0.0)');
  
        // Apply gradients to datasets
        const datasets = props.chartData.datasets.map((dataset, index) => {
          return {
            ...dataset,
            backgroundColor: index === 0 ? gradient1 : gradient2,
            borderWidth: 2,
            pointBackgroundColor: index === 0 ? '#bb86fc' : '#03dac6',
            pointBorderColor: '#121212',
            pointRadius: 4,
            pointHoverRadius: 6
          };
        });
  
        chartInstance = new Chart(chartCanvas.value, {
          type: 'line',
          data: {
            labels: props.chartData.labels,
            datasets
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'top',
                labels: {
                  color: 'rgba(255, 255, 255, 0.6)',
                  font: {
                    size: 12
                  },
                  usePointStyle: true,
                  pointStyle: 'circle'
                }
              },
              tooltip: {
                backgroundColor: 'rgba(30, 30, 30, 0.8)',
                titleColor: 'rgba(255, 255, 255, 0.87)',
                bodyColor: 'rgba(255, 255, 255, 0.6)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1,
                padding: 10,
                cornerRadius: 8,
                displayColors: true,
                usePointStyle: true,
                boxPadding: 6
              }
            },
            scales: {
              x: {
                grid: {
                  color: 'rgba(255, 255, 255, 0.05)',
                  drawBorder: false
                },
                ticks: {
                  color: 'rgba(255, 255, 255, 0.6)'
                }
              },
              y: {
                grid: {
                  color: 'rgba(255, 255, 255, 0.05)',
                  drawBorder: false
                },
                ticks: {
                  color: 'rgba(255, 255, 255, 0.6)',
                  padding: 10
                },
                beginAtZero: true
              }
            },
            elements: {
              line: {
                tension: 0.4
              }
            },
            interaction: {
              mode: 'index',
              intersect: false
            }
          }
        });
      };
  
      onMounted(() => {
        if (props.chartData) {
          renderChart();
        }
      });
  
      watch(() => props.chartData, () => {
        if (props.chartData) {
          renderChart();
        }
      }, { deep: true });
  
      return {
        chartCanvas
      };
    }
  };
  </script>
  
  <style scoped>
  .chart-container {
    width: 100%;
    height: 350px;
    position: relative;
  }
  </style>