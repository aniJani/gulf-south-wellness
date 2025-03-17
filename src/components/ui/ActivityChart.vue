<template>
  <div class="chart-container">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script>
import Chart from 'chart.js/auto';
import { onMounted, onUnmounted, ref, watch } from 'vue';

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
    const isDarkMode = ref(false);

    // Function to check if dark mode is active
    const checkTheme = () => {
      const theme = localStorage.getItem('theme') || 'light';
      isDarkMode.value = theme === 'dark';
    };

    const renderChart = () => {
      if (chartInstance) {
        chartInstance.destroy();
      }

      checkTheme(); // Check current theme

      const ctx = chartCanvas.value.getContext('2d');
      
      // Create gradient for the first dataset
      const gradient1 = ctx.createLinearGradient(0, 0, 0, 400);
      gradient1.addColorStop(0, 'rgba(187, 134, 252, 0.4)');
      gradient1.addColorStop(1, 'rgba(187, 134, 252, 0.0)');
      
      // Create gradient for the second dataset
      const gradient2 = ctx.createLinearGradient(0, 0, 0, 400);
      gradient2.addColorStop(0, 'rgba(3, 218, 198, 0.4)');
      gradient2.addColorStop(1, 'rgba(3, 218, 198, 0.0)');

      // Set theme-specific colors
      const lightModeColors = {
        legendColor: 'rgba(33, 37, 41, 0.8)',
        tooltipBackground: 'rgba(255, 255, 255, 0.9)',
        tooltipTitleColor: 'rgba(33, 37, 41, 0.95)',
        tooltipBodyColor: 'rgba(33, 37, 41, 0.8)',
        tooltipBorderColor: 'rgba(0, 0, 0, 0.1)',
        gridColor: 'rgba(0, 0, 0, 0.05)',
        tickColor: 'rgba(33, 37, 41, 0.7)',
        pointBorderColor: '#ffffff'
      };

      // Apply gradients to datasets
      const datasets = props.chartData.datasets.map((dataset, index) => {
        return {
          ...dataset,
          backgroundColor: index === 0 ? gradient1 : gradient2,
          borderColor: index === 0 ? '#bb86fc' : '#03dac6',
          borderWidth: 2,
          pointBackgroundColor: index === 0 ? '#bb86fc' : '#03dac6',
          pointBorderColor: isDarkMode.value ? '#121212' : lightModeColors.pointBorderColor,
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
                color: isDarkMode.value 
                  ? 'rgba(255, 255, 255, 0.6)' 
                  : lightModeColors.legendColor,
                font: {
                  size: 12
                },
                usePointStyle: true,
                pointStyle: 'circle'
              }
            },
            tooltip: {
              backgroundColor: isDarkMode.value 
                ? 'rgba(30, 30, 30, 0.8)' 
                : lightModeColors.tooltipBackground,
              titleColor: isDarkMode.value 
                ? 'rgba(255, 255, 255, 0.87)' 
                : lightModeColors.tooltipTitleColor,
              bodyColor: isDarkMode.value 
                ? 'rgba(255, 255, 255, 0.6)' 
                : lightModeColors.tooltipBodyColor,
              borderColor: isDarkMode.value 
                ? 'rgba(255, 255, 255, 0.1)' 
                : lightModeColors.tooltipBorderColor,
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
                color: isDarkMode.value 
                  ? 'rgba(255, 255, 255, 0.05)'
                  : lightModeColors.gridColor,
                drawBorder: false
              },
              ticks: {
                color: isDarkMode.value 
                  ? 'rgba(255, 255, 255, 0.6)'
                  : lightModeColors.tickColor
              }
            },
            y: {
              grid: {
                color: isDarkMode.value 
                  ? 'rgba(255, 255, 255, 0.05)'
                  : lightModeColors.gridColor,
                drawBorder: false
              },
              ticks: {
                color: isDarkMode.value 
                  ? 'rgba(255, 255, 255, 0.6)'
                  : lightModeColors.tickColor,
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

    // Observer to detect theme attribute changes on document element
    let themeObserver = null;

    const setupThemeObserver = () => {
      themeObserver = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.attributeName === 'data-theme') {
            handleThemeChange();
          }
        }
      });
      
      themeObserver.observe(document.documentElement, { attributes: true });
    };

    // Handler for theme changes
    const handleThemeChange = () => {
      if (props.chartData) {
        renderChart();
      }
    };

    onMounted(() => {
      if (props.chartData) {
        renderChart();
      }

      // Listen for storage events to detect theme changes from other tabs
      window.addEventListener('storage', (event) => {
        if (event.key === 'theme') {
          handleThemeChange();
        }
      });

      // Listen for custom theme changed event
      document.addEventListener('themeChanged', handleThemeChange);
      
      // Set up the mutation observer to detect theme changes directly
      setupThemeObserver();
    });

    // Clean up event listeners when component unmounts
    onUnmounted(() => {
      window.removeEventListener('storage', handleThemeChange);
      document.removeEventListener('themeChanged', handleThemeChange);
      
      if (themeObserver) {
        themeObserver.disconnect();
      }
      
      if (chartInstance) {
        chartInstance.destroy();
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