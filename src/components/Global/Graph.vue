<template>
  <div>
    <canvas id="chart"></canvas>
  </div>
</template>
<script>
import Chart from 'chart.js/auto';

export default {
  name: 'ChartJs',
  props: {
    type: {
      type: String,
      default: '',
    },
    data: {
      type: Object,
      default: () => {},
    },
    options: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      chrt: '',
      chart: '',
    };
  },
  mounted() {
    if (this.chart) {
      this.chart.destroy();
    }
    this.chrt = document.getElementById('chart');
    Chart.defaults.borderColor = '#ede7e7';
    this.chart = new Chart(this.chrt, {
      type: this.type,
      data: this.data,
      options: this.options,
    });
    this.chart;
  },
};
</script>
<style>
.container {
  height: 100%;
  width: 100%;
}
</style>
