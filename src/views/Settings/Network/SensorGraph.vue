<template>
  <div>
    <b-row>
      <b-col xl="6">
        <b-col xl="4" class="display_inline">
          <span>History Interval(Min)</span>
        </b-col>
        <b-col xl="6" class="display_inline">
          <b-form-group label-for="HInterval">
            <b-form-select
              id="HInterval"
              v-model="HInterval"
              class="input"
              :options="HIntervalOptions"
              data-test-id="HInterval-option"
              @change="historyinterval()"
            ></b-form-select>
          </b-form-group>
        </b-col>
      </b-col>
      <b-col xl="5">
        <div class="text-right mb10">
          <b-button variant="primary" @click="initBack()"> Back </b-button>
        </div>
      </b-col>
    </b-row>
    <b-row>
      <b-col v-if="lineDatadone" xl="12">
        <h2>{{ sensorGraphData.name }}</h2>
        <chart
          v-if="lineDatadone"
          :data="lineData"
          :options="options"
          :type="type"
        />
      </b-col>
    </b-row>
  </div>
</template>
<script>
import Chart from '@/components/Global/Graph.vue';
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';

export default {
  components: {
    Chart,
  },
  mixins: [LoadingBarMixin],
  props: {
    type: {
      type: String,
      default: '',
    },
    sensorGraphData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      lineDatadone: false,
      HIntervalOptions: [
        {
          text: '10',
          value: 10,
        },
        {
          text: '20',
          value: 20,
        },
        {
          text: '30',
          value: 30,
        },
      ],
      HInterval: 10,
      lineData: {},
      options: {
        defaults: {
          borderColor: '#ce3a2f',
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            boxWidth: 25,
            displayColors: false,
            callbacks: {
              title: function (TooltipItem) {
                return TooltipItem[0].label;
              },
              label: function (TooltipItem) {
                return TooltipItem.parsed.y;
              },
            },
            intersect: false,
          },
        },
        responsive: true,
        interaction: {
          intersect: false,
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Timestamp',
            },
            defaults: {
              borderColor: 'red',
            },
          },
          y: {
            display: true,
            title: {
              display: true,
              text: 'Values',
            },
          },
        },
        elements: {
          line: {
            borderColor: '#cf4132',
            borderWidth: 2,
          },
          point: {
            radius: 3,
          },
        },
      },
      itemdata: {},
    };
  },
  watch: {
    lineData() {},
  },
  created() {
    this.historyinterval();
  },
  methods: {
    initBack() {
      this.$emit('BackSensorpage');
    },
    async sensorData() {
      this.lineDatadone = false;
      this.lineData = {};
      var datasets = [];
      var labels = [];
      var data = [];
      var label = '';
      var chartdata;
      this.lineData.datasets = [];
      this.lineData.labels = [];
      this.itemdata = this.$store.getters['sensors/GraphSensors'];
      this.itemdata.History.forEach((val) => {
        label = this.timestammptotime(val.Time);
        data.push(val.ReadingCelsius);
        labels.push(label);
      });
      chartdata = {
        data: data,
        fill: true,
        borderColor: '#416f89',
        tension: 0.1,
      };
      datasets.push(chartdata);
      this.lineData = {
        labels: labels,
        datasets: datasets,
      };
    },
    getTimeStamp(timeInSeconds) {
      var evtTimeStamp = '';
      var eventDate = new Date(timeInSeconds * 1000);

      var evtMonth = eventDate.getUTCMonth() + 1;
      evtMonth = (evtMonth < 10 ? '0' : '') + evtMonth;
      var evtDate = eventDate.getUTCDate();
      evtDate = (evtDate < 10 ? '0' : '') + evtDate;
      evtTimeStamp =
        evtMonth + '/' + evtDate + '/' + eventDate.getUTCFullYear();

      var evtHours = eventDate.getUTCHours();
      evtHours = (evtHours < 10 ? '0' : '') + evtHours;
      var evtMins = eventDate.getUTCMinutes();
      evtMins = (evtMins < 10 ? '0' : '') + evtMins;
      var evtSecs = eventDate.getUTCSeconds();
      evtSecs = (evtSecs < 10 ? '0' : '') + evtSecs;
      evtTimeStamp += '  ' + evtHours + ':' + evtMins + ':' + evtSecs;
      return evtTimeStamp;
    },

    timestammptotime(unixTimeStamp) {
      // unixTimeStamp to HH:MM:SS format
      var dateFormat = this.getTimeStamp(unixTimeStamp);
      var HHMMSS = dateFormat.split(' ');
      return HHMMSS[2];
    },
    historyinterval() {
      let hI = {
        id: this.sensorGraphData.id,
        value: this.HInterval,
      };
      this.startLoader();
      this.$store.dispatch('sensors/getTimeInterval', hI).finally(() => {
        this.isBusy = false;
        this.sensorData().then(() => {
          this.lineDatadone = true;
        });
        this.endLoader();
      });
    },
  },
};
</script>
<style scoped>
.display_inline {
  display: inline-block;
}
</style>
